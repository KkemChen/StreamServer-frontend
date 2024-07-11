<template>
  <div ref="diskBar" class="diskBar" />
</template>
<script setup>
import { ref, computed, onUnmounted, defineProps, watch, onMounted } from "vue";
import { useDark, useECharts } from "@pureadmin/utils";

const { isDark } = useDark();
const diskBar = ref();
let theme = computed(() => {
  return isDark.value ? "dark" : "default";
});

const { getInstance, setOptions } = useECharts(diskBar, { theme });
const props = defineProps({
  value: {
    type: Array,
    default: () => []
  }
});
const KBToGB = (value = 0) => {
  return Number.parseFloat((value / 1024 / 1024).toFixed(2));
};
let watchId = watch(
  () => props.value,
  (n, o) => {
    getInstance()?.setOption({
      series: [
        {
          data: n.map(v => ({
            name: v.mounted_on,
            value: Number.parseFloat(v.size)
          }))
        }
      ]
    });
  },
  {
    deep: true
  }
);
setOptions({
  legend: {},
  tooltip: {
    trigger: "item",
    formatter: args => {
      return `${args.seriesName}<br/>${args.marker}${args.name}\t${KBToGB(args.value)}GB(${args.percent}%)`;
    }
  },
  series: [
    {
      name: "硬盘使用情况",
      type: "pie",
      radius: "70%",
      avoidLabelOverlap: false,
      label: {
        show: true
        // position: "inside"
      },
      labelLine: {
        show: true
      },
      data: props.value.map(v => ({
        name: v.mounted_on,
        value: Number.parseFloat(v.size)
      }))
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
  min-width: 50px;
  min-height: 350px;
}
</style>
