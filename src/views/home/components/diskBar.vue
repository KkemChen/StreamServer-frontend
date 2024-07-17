<template>
  <div ref="diskBar" />
</template>
<script setup>
import { ref, computed, onUnmounted, defineProps, watch, onMounted } from "vue";
import * as echarts from "echarts";

const diskBar = ref();
const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
});
const KBToGB = (value = 0) => {
  return Number.parseFloat((value / 1024 / 1024).toFixed(2));
};
let chartDom;
const ChartData = computed(() => {
  let seriesName = [];
  let used = [];
  let available = [];
  props.value.forEach(v => {
    seriesName.push(v.mounted_on);
    used.push(v.used);
    available.push(v.available);
  });
  return { seriesName, used, available };
});
let watchId;

const initChart = () => {
  chartDom.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      },
      formatter: args => {
        return `${args[0].axisValueLabel}<br/>${args.map(v => `${v.marker} ${v.seriesName}：${KBToGB(v.value)}GB`).join("<br/>")}`;
      }
    },
    grid: {
      left: "3%",
      right: "5%",
      bottom: "1%",
      top: "5%",
      containLabel: true
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: v => {
          return KBToGB(v) + "GB";
        }
      }
    },
    yAxis: {
      type: "category",
      axisLabel: {
        width: 70,
        showMaxLabel: true,
        overflow: "truncate"
      },
      data: ChartData.value.seriesName
    },
    series: [
      {
        name: "已使用",
        type: "bar",
        data: ChartData.value.used
      },
      {
        name: "未使用",
        type: "bar",
        data: ChartData.value.available
      }
    ]
  });
};
onMounted(() => {
  chartDom = echarts.init(diskBar.value);
  watchId = watch(
    () => props.value,
    (n, o) => {
      chartDom.setOption({
        yAxis: {
          data: ChartData.value.seriesName
        },
        series: [
          {
            data: ChartData.value.used
          },
          {
            data: ChartData.value.available
          }
        ]
      });
    },
    {
      deep: true
    }
  );
  window.addEventListener("resize", chartDom.resize);
  initChart();
});
onUnmounted(() => {
  // 销毁监听器
  watchId();
  window.removeEventListener("resize", chartDom.resize);
});
</script>
