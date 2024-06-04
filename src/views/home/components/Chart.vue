<template>
  <div :id="id" />
</template>

<script setup>
//需要考虑loading怎么做
import * as echarts from "echarts";
import { watch, defineEmits } from "vue";

import { ref, onMounted, nextTick, onUnmounted, defineProps } from "vue";

const emits = defineEmits(["chartMounted"]);
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  data: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  }
});
let chartDom;
let rerenderStartTime = Date.now();
const initChart = () => {
  chartDom.setOption({
    series: [
      {
        type: "gauge",
        center: ["50%", "80%"],
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 120,
        splitNumber: 10,
        radius: 140,
        itemStyle: {
          color: "#ae8",
          shadowColor: "rgba(0,0,0,0.3)",
          shadowBlur: 2
        },
        progress: {
          show: true,
          roundCap: true,
          width: 7
        },
        pointer: {
          icon: "path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z",
          length: "70%",
          width: 7,
          offsetCenter: [0, 0]
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 7
          }
        },
        axisTick: {
          splitNumber: 2,
          lineStyle: {
            width: 2,
            cap: "round",
            color: "#fff"
          }
        },
        splitLine: {
          length: 10,
          lineStyle: {
            width: 2,
            cap: "round",
            color: "#fff"
          }
        },
        axisLabel: {
          distance: 10,
          color: "#fff",
          fontSize: 10
        },
        title: {
          show: false
        },
        detail: {
          // backgroundColor: "#ae9",
          // borderColor: "#999",
          // borderWidth: 0,
          // width: "50%",
          // lineHeight: 40,
          // height: 40,
          // borderRadius: 8,
          offsetCenter: [0, 20],
          valueAnimation: true,
          formatter: function (value) {
            return "{value|" + value.toFixed(0) + "}{unit|%}";
          },
          rich: {
            value: {
              fontSize: 20,
              fontWeight: "bolder",
              color: "#fff"
            },
            unit: {
              fontSize: 20,
              color: "#0ff"
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
let watchLoadingId;
let watchDataId;
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
  // 挂载loading监听
  emits("chartMounted");
  // 挂载loading监听
  watchLoadingId = watch(
    () => props.loading,
    (n, o) => {
      if (n) {
        chartDom.showLoading("default", {
          text: "",
          color: "#ae0",
          textColor: "#fff",
          maskColor: "rgba(0, 0, 0, 0.75)",
          zlevel: 0,

          // 字体大小。从 `v4.8.0` 开始支持。
          fontSize: 12,
          // 是否显示旋转动画（spinner）。从 `v4.8.0` 开始支持。
          showSpinner: true,
          // 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
          spinnerRadius: 10,
          // 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
          lineWidth: 1
        });
      } else {
        chartDom.hideLoading();
      }
    }
  );
  // data监听
  watchDataId = watch(
    () => props.data,
    (n, o) => {
      chartDom.setOption({
        series: [
          {
            data: [
              {
                value: n
              }
            ]
          }
        ]
      });
    }
  );
  initChart();
  window.addEventListener("resize", rerenderChart);
});
onUnmounted(() => {
  watchLoadingId();
  watchDataId();
  window.removeEventListener("resize", rerenderChart);
});
</script>
