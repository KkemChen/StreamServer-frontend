<template>
  <div ref="memChart" />
</template>
<script setup>
import { ref, reactive, computed, onUnmounted, defineProps, watch } from "vue";
import { useDark, useECharts } from "@pureadmin/utils";

const { isDark } = useDark();
const memChart = ref();
let theme = computed(() => {
  return isDark.value ? "dark" : "default";
});
const { setOptions, getInstance } = useECharts(memChart, { theme });
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
setOptions({
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
let watchId = {
  source: watch(
    () => props.source,
    (n, o) => {
      getInstance()?.setOption({
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
      getInstance()?.setOption({
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
      getInstance()?.setOption({
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
onUnmounted(() => {
  // 销毁监听器
  watchId.value();
  watchId.x();
  watchId.source();
});
</script>
