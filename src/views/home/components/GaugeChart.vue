<template>
  <div :id="id" />
</template>

<script setup>
import * as echarts from "echarts";
import { watch, defineEmits } from "vue";

import { ref, onMounted, nextTick, onUnmounted, defineProps } from "vue";

// const emits = defineEmits(["chartMounted"]);
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Number,
    default: 0
  },
  color: {
    type: Object,
    default: () => ({
      guage: []
    })
  },
  fontSize: {
    type: Object,
    default: () => ({})
  }
});

let chartDom;
let rerenderStartTime = Date.now();
const getColor = value => {
  if (value >= 85) {
    return props.color.guage[2];
  } else if (value >= 55) {
    return props.color.guage[1];
  } else {
    return props.color.guage[0];
  }
};
const initChart = () => {
  chartDom.setOption({
    series: [
      {
        type: "gauge",
        center: ["50%", "90%"],
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        radius: "170%",
        itemStyle: {
          color: getColor(props.data),
          shadowColor: "rgba(0,0,0,0.3)",
          shadowBlur: 2
        },
        progress: {
          show: true,
          roundCap: true,
          width: props.fontSize.descSize
        },
        pointer: {
          icon: "path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z",
          length: "65%",
          width: props.fontSize.descSize /3,
          offsetCenter: [0, 0]
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: props.fontSize.descSize,
            color: [[1, props.color.subBack]]
          }
        },
        axisTick: {
          splitNumber: 2,
          lineStyle: {
            width: 2,
            cap: "round",
            color: props.color.front
          }
        },
        splitLine: {
          length: props.fontSize.descSize,
          lineStyle: {
            width: 2,
            cap: "round",
            color: props.color.subBack
          }
        },
        axisLabel: {
          distance: props.fontSize.descSize,
          color: props.color.front,
          fontSize: props.fontSize.descSize
        },
        title: {
          show: false
        },
        detail: {
          offsetCenter: [0, props.fontSize.titleSize / 2],
          valueAnimation: true,
          formatter: function (value) {
            return "{value|" + value.toFixed(0) + "}{unit|%}";
          },
          rich: {
            value: {
              fontSize: props.fontSize.bodySize,
              fontWeight: "bolder",
              color: getColor(props.data)
            },
            unit: {
              fontSize: props.fontSize.bodySize,
              color: getColor(props.data)
            }
          }
        },
        data: [
          {
            value: props.data
          }
        ]
      }
    ]
  });
};
let watchDataId,watchColorId;
const rerenderChart = () => {
  let time = Date.now();
  // 节流
  if (time - rerenderStartTime > 333) {
    rerenderStartTime = time;
    chartDom.resize();
  }
};
onMounted(() => {
  // 初始化dom
  chartDom = echarts.init(document.getElementById(props.id));
  // data监听
  watchDataId = watch(
    () => props.data,
    value => {
      chartDom.setOption({
        series: [
          {
            detail: {
              rich: {
                value: {
                  color: getColor(props.data)
                },
                unit: {
                  color: getColor(props.data)
                }
              }
            },
            itemStyle: {
              color: getColor(props.data)
            },
            data: [
              {
                value
              }
            ]
          }
        ]
      });
    }
  );
  watchColorId = watch(() => props.color, (value) => {
    chartDom.setOption({
        series: [
          {
            axisLine: {
          lineStyle: {
            color: [[1, value.subBack]],
          }
        },
        axisTick: {
          lineStyle: {
            color: value.front
          }
        },
        splitLine: {
          lineStyle: {
            color: value.subBack
          }
        },
        axisLabel: {
          color: value.front,
        }
          }
        ]
      });
  })
  initChart();
  window.addEventListener("resize", rerenderChart);
});
onUnmounted(() => {
  watchDataId();
  watchColorId()
  window.removeEventListener("resize", rerenderChart);
});
</script>
