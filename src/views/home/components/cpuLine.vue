<template>
  <div ref="cpuLine" />
</template>
<script setup>
import { ref, onUnmounted, defineProps, watch, onMounted } from "vue";
import * as echarts from "echarts";

const cpuLine = ref();
let chartDom;
const props = defineProps({
  x: {
    type: Array,
    default: () => []
  },
  value: {
    type: Array,
    default: () => []
  }
});
const initChart = () => {
  chartDom.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      },
      formatter(args) {
        return `${args[0].axisValueLabel}<br/>${args.map(v => `${v.marker} ${v.seriesName}：${v.value}%`).join("<br/>")}`;
      }
    },
    visualMap: [
      {
        show: false,
        type: "piecewise",
        seriesIndex: 0,
        pieces: [
          { min: 85, max: 100, color: "#F56C6C" },
          { min: 75, max: 85, color: "#E6A23C" },
          { min: 0, max: 75, color: "#67C23A" }
        ]
      }
    ],
    grid: {
      left: "3%",
      right: "5%",
      bottom: "1%",
      top: "5%",
      containLabel: true
    },
    xAxis: [
      {
        type: "category",
        data: props.x
      }
    ],
    yAxis: [
      {
        type: "value",
        max: 100,
        axisLabel: {
          formatter: "{value}%"
        }
      }
    ],
    dataZoom: [
      {
        type: "inside"
      }
    ],
    series: [
      {
        name: "占用率",
        type: "line",
        // areaStyle: {},
        smooth: true,
        showSymbol: false,
        data: props.value
      }
    ]
  });
};
let watchId;
onMounted(() => {
  chartDom = echarts.init(cpuLine.value);
  watchId = {
    x: watch(
      props.x,
      (n, o) => {
        chartDom.setOption({
          xAxis: {
            data: n
          }
        });
      },
      {
        deep: true
      }
    ),
    value: watch(
      props.value,
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
    )
  };
  window.addEventListener("resize", chartDom.resize);
  initChart();
});
onUnmounted(() => {
  // 销毁监听器
  watchId.x();
  watchId.value();
  window.removeEventListener("resize", chartDom.resize);
});
</script>
