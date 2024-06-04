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
    type: Array,
    default: () => []
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
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [],
        type: "line",
        areaStyle: {}
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
            data: n
          }
        ]
      });
    },
    {
      deep: true
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
