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
          backgroundColor: "#6a7985"
        }
      }
    },
    legend: {
      data: Object.keys(props.data),
      textStyle: {
        color: "#fff"
      }
    },
    grid: {
      left: "5%",
      right: "10%",
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
          color: "#fff",
          margin: 15
        }
      }
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: "#fff"
        }
      }
    ],
    series: Object.keys(props.data).map(v => {
      return {
        name: v,
        type: "line",
        data: props.data[v]
      };
    })
  });
};
let watchXId;
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
        legend: {
          data: Object.keys(props.data)
        },
        series: Object.keys(props.data).map(v => {
          return {
            name: v,
            type: "line",
            data: props.data[v]
          };
        })
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
  watchXId();
  window.removeEventListener("resize", rerenderChart);
});
</script>
