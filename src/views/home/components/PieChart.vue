<template>
  <div :id="id" />
</template>

<script setup>
//需要考虑loading怎么做
import * as echarts from "echarts";
import { watch } from "vue";
import { onMounted, onUnmounted, defineProps, computed } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  color: {
    type: Object,
    default: () => ({})
  },
  x: {
    type: Array,
    default: () => []
  },
  fontSize: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  }
});
let chartDom;
let rerenderStartTime = Date.now();
const initChart = () => {
  chartDom.setOption({
    tooltip: {
      trigger: "item",
      formatter(args) {
        return `${args.marker}${args.name}:${args.percent}%`;
      }
    },
    legend: {
      show: true,
      orient: "vertical",
      right: "5%",
      top: "center",
      padding: 0,
      textStyle: {
        color: props.color.front
      },
      selectedMode:false
    },
    series: [
      {
        type: "pie",
        radius: "90%",
        center: ["50%", "50%"],
        labelLine: {
          show: false
        },
        label: {
          show: true,
          position: "inside",
          formatter: "{d}%"
        },
        data: [
          {
            name: "已使用",
            value: props.data.use
          },
          {
            name: "未使用",
            value: props.data.unUse
          }
        ]
      }
    ]
  });
};
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
  // data监听
  watchDataId = watch(
    () => props.data,
    (n, o) => {
      chartDom.setOption({
        series: [
          {
            data: [
              {
                name: "已使用",
                value: n.use
              },
              {
                name: "未使用",
                value: n.unUse
              }
            ]
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
  watchDataId();
  window.removeEventListener("resize", rerenderChart);
});
</script>
