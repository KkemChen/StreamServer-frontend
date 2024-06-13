<template>
  <div :id="id" />
</template>

<script setup>
//需要考虑loading怎么做
import * as echarts from "echarts";
import { watch } from "vue";
import {  onMounted,  onUnmounted, defineProps } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  color: {
    type: Object,
    default: () => ({})
  },
  fontSize: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Array,
    default: () => []
  }
});
let chartDom;
let rerenderStartTime = Date.now();
const initChart = () => {
  chartDom.setOption({
  tooltip: {
      trigger: 'item',
      formatter: tooltip => {
        let obj = props.data.find(v => v.mounted_on === tooltip.data.name)
        return `${tooltip.marker}   ${tooltip.data.name}   ${obj?.used||''}`
      }
  },
  legend: {
    orient: 'vertical',
    right: '0',
    top: 'center',
    padding: 0,
    formatter: name => {
      let obj = props.data.find(v => v.mounted_on === name)
      return `${name}（${obj?.used ||''}）`
    },
    textStyle: {
      color:props.color.front
    }
  },
  series: [
    {
      name: '磁盘总空间',
      type: 'pie',
      radius: '95%',
      center: ['30%', '50%'],
      labelLine: {
        show:false
      },
      label: {
        show:false
      },
      data: props.data.map(v => ({
          value: Number.parseFloat(v.use_percent),
          name:v.mounted_on
        }))
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
            data:props.data.map(v => ({
          value: Number.parseFloat(v.use_percent),
          name:v.mounted_on
        }))
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
