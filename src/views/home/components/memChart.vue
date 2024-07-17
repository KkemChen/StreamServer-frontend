<template>
  <div ref="memChart" />
</template>
<script setup>
import { ref, onUnmounted, defineProps, watch, onMounted } from "vue";
import * as echarts from "echarts";

const memChart = ref();
const props = defineProps({
  source: {
    type: Object,
    default: () => ({})
  },
  value: {
    type: Array,
    default: () => []
  },
  x: {
    type: Array,
    default: () => []
  }
});
const KBToGB = (value = 0) => {
  return Number.parseFloat((value / 1024 / 1024).toFixed(2));
};
let chartDom;
let watchId;
const initChart = () => {
  chartDom.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      },
      formatter(args) {
        return `${args[0].axisValueLabel}<br/>${args.map(v => `${v.marker} ${v.seriesName}：${KBToGB(v.value)}GB`).join("<br/>")}`;
      }
    },
    dataZoom: [
      {
        type: "inside"
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
        max: props.source.total,
        axisLabel: {
          formatter: v => {
            return KBToGB(v) + "GB";
          }
        }
      }
    ],
    series: [
      {
        name: "已使用",
        type: "bar",
        stack: "total",
        data: props.value.map(v => v.used)
      },
      {
        name: "未使用",
        type: "bar",
        stack: "total",
        data: props.value.map(v => v.free)
      }
    ]
  });
};
onMounted(() => {
  chartDom = echarts.init(memChart.value);
  watchId = {
    source: watch(
      () => props.source,
      (n, o) => {
        chartDom.setOption({
          yAxis: [
            {
              max: n.total
            }
          ]
        });
      },
      {
        deep: true
      }
    ),
    x: watch(
      props.x,
      (n, o) => {
        chartDom.setOption({
          xAxis: [
            {
              data: n
            }
          ]
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
              data: n.map(v => v.used)
            },
            {
              data: n.map(v => v.free)
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
  watchId.value();
  watchId.x();
  watchId.source();
  window.removeEventListener("resize", chartDom.resize);
});
</script>
