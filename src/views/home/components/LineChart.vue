<template>
  <div :id="id" />
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted, nextTick, onUnmounted, defineProps,computed,watch, defineEmits, reactive } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  x: {
    type: Array,
    default:()=>[]
  },
  min1: {
    type: Array,
    default:()=>[]
  },
  min5: {
    type: Array,
    default:()=>[]
  },
  min15: {
    type: Array,
    default:()=>[]
  },
});
const types = reactive(['min1', 'min5', 'min15'])
let chartDom;
let rerenderStartTime = Date.now();
const initChart = () => {
  chartDom.setOption({
    title: {
    show:false,
    // text: 'Stacked Area Chart'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: types,
    textStyle: {
      color:'#fff'
    }
  },
  grid: {
    left: '5%',
    right: '10%',
    bottom: '3%',
    top:'10%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: props.x,
      axisLabel: {
        color: '#fff',
        margin:15
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        color:'#fff'
      }
    }
    ],
  series: [
    {
      name: 'min1',
      type: 'line',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: props.min1
    },
    {
      name: 'min5',
      type: 'line',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: props.min5
    },
    {
      name: 'min15',
      type: 'line',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: props.min15
    }
  ]
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
        series: [
          {
            data: props.min1
          },
          {
            data: props.min5
          },
          {
            data: props.min15
          }
        ]
      })
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
