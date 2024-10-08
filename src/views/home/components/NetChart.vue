<template>
  <div :id="id" />
</template>

<script setup>
import * as echarts from "echarts";
import {
  ref,
  onMounted,
  nextTick,
  onUnmounted,
  defineProps,
  computed,
  watch,
  defineEmits,
  reactive
} from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  x: {
    type: Array,
    default: () => []
  },
  data: {
    type: Object,
    default: () => ({})
  },
  color: {
    type: Object,
    default: () => ({})
  },
  fontSize: {
    type: Object,
    default: () => ({})
  }
});
let chartDom;
let rerenderStartTime = Date.now();

let keyMap = {
  rx: "下行流量",
  tx: "上行流量"
};
const initChart = () => {
  chartDom.setOption({
    title: {
      show: false
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          color: props.color.back,
          backgroundColor: props.color.front
        }
      },
      formatter(args) {
        return `${args[0].axisValueLabel}<br/>${args.map(v => `${v.marker} ${keyMap[v.seriesName]}：${v.value}%`).join("<br/>")}`;
      }
    },
    legend: {
      data: Object.keys(props.data),
      textStyle: {
        color: props.color.front
      },
      formatter: e => {
        return keyMap[e];
      }
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "3%",
      top: "10%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: props.x,
        axisLabel: {
          color: props.color.front,
          margin: 15
        }
      }
    ],
    yAxis: [
      {
        name: "（%）",
        nameLocation: "end",
        nameGap: 20,
        max: 100,
        nameTextStyle: {
          color: props.color.front,
          padding: [0, 20, 0, 0]
        },
        type: "value",
        axisLabel: {
          color: props.color.front
        }
      }
    ],
    // 上行和下行的数据
    series: Object.keys(props.data).map(v => ({
      name: v,
      type: "line",
      emphasis: {
        focus: "series"
      },
      showSymbol: false,
      areaStyle: {},
      data: props.data[v]
    }))
  });
};
let watchXId, watchDataId, watchColorId;
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
  watchXId = watch(
    () => props.x,
    (n, o) => {
      chartDom.setOption({
        xAxis: {
          data: n
        },
        series: Object.keys(props.data).map(v => ({
          name: v,
          data: props.data[v]
        }))
      });
    },
    {
      deep: true
    }
  );
  watchDataId = watch(
    () => props.data,
    (n, o) => {
      chartDom.setOption({
        xAxis: {
          data: props.x
        },
        series: Object.keys(props.data).map(v => ({
          name: v,
          type: "line",
          emphasis: {
            focus: "series"
          },
          data: n[v]
        }))
      });
    },
    {
      deep: true
    }
  );
  watchColorId = watch(
    () => props.color,
    value => {
      chartDom.setOption({
        tooltip: {
          axisPointer: {
            label: {
              color: value.back,
              backgroundColor: value.front
            }
          }
        },
        legend: {
          textStyle: {
            color: value.front
          }
        },
        xAxis: [
          {
            axisLabel: {
              color: value.front
            }
          }
        ],
        yAxis: [
          {
            nameTextStyle: {
              color: value.front
            },
            axisLabel: {
              color: value.front
            }
          }
        ]
      });
    }
  );
  initChart();
  window.addEventListener("resize", rerenderChart);
});
onUnmounted(() => {
  watchXId();
  watchDataId();
  watchColorId();
  window.removeEventListener("resize", rerenderChart);
});
</script>
