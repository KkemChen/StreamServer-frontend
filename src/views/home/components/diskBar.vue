<template>
  <div ref="diskBar" class="diskBar" />
</template>
<script setup>
import { ref, computed, onUnmounted, defineProps, watch } from "vue";
import { useDark, useECharts } from "@pureadmin/utils";

const { isDark } = useDark();
const diskBar = ref();
let theme = computed(() => {
  return isDark.value ? "dark" : "default";
});

const { getInstance, setOptions, resize } = useECharts(diskBar, { theme });
const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
});
const KBToGB = (value = 0) => {
  return Number.parseFloat((value / 1024 / 1024).toFixed(2));
};
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
let watchId = watch(
  () => props.value,
  (n, o) => {
    getInstance()?.setOption({
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
setOptions({
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
    bottom: "0%",
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
onUnmounted(() => {
  // 销毁监听器
  watchId();
});
</script>
<style lang="scss" scoped>
.diskBar {
  flex-grow: 1;
  align-self: stretch;
  min-width: 300px;
  min-height: 300px;
}
</style>
