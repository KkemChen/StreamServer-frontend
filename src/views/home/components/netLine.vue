<template>
  <div ref="netLine" class="netLine" />
</template>
<script setup>
import { ref, onUnmounted, defineProps, watch, onMounted } from "vue";
import * as echarts from "echarts";

const netLine = ref();

const props = defineProps({
  rx: {
    type: Array,
    default: () => []
  },
  tx: {
    type: Array,
    default: () => []
  },
  x: {
    type: Array,
    default: () => []
  },
  showMode: {
    type: Number,
    default: 1
  }
});
let chartDom;
const initChart = () => {
  chartDom.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      },
      formatter(args) {
        if (props.showMode === 1) {
          return `${args[0].axisValueLabel}<br/>${args.map(v => `${v.marker} ${v.seriesName}：${v.data}Mbit`).join("<br/>")}`;
        } else {
          return `${args[0].axisValueLabel}<br/>${args.map(v => `${v.marker} ${v.seriesName}：${v.data}%`).join("<br/>")}`;
        }
      }
    },
    grid: {
      left: "1%",
      right: "1%",
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
        max: args => {
          if (props.showMode === 1) {
            return args.max;
          } else {
            return 100;
          }
        },
        axisLabel: {
          formatter: v => {
            if (props.showMode === 1) {
              return `${v}Mbit`;
            } else {
              return `${v}%`;
            }
          }
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
        name: "上传速度",
        type: "line",
        smooth: true,
        lineStyle: {
          type: "dashed",
          color: "#df2574",
          width: 5
        },
        itemStyle: {
          color: "#df2574"
        },
        showSymbol: false,
        data: props.tx
      },
      {
        name: "下载速度",
        type: "line",
        areaStyle: {
          color: "#3bf21d",
          opacity: 0.1
        },
        itemStyle: {
          color: "#3bf21d"
        },
        smooth: true,
        showSymbol: false,
        data: props.rx
      }
    ]
  });
};
let watchId;
onMounted(() => {
  chartDom = echarts.init(netLine.value);
  watchId = {
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
    tx: watch(
      () => props.tx,
      (n, o) => {
        chartDom.setOption({
          series: [
            {
              data: n
            }
          ]
        });
      }
    ),
    rx: watch(
      () => props.rx,
      (n, o) => {
        chartDom.setOption({
          series: [
            {
              data: props.tx
            },
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
  watchId.rx();
  watchId.x();
  watchId.tx();
  window.removeEventListener("resize", chartDom.resize);
});
</script>

<style lang="scss" scoped>
.netLine {
  flex-grow: 1;
  align-self: stretch;
  min-width: 700px;
  min-height: 200px;
}
</style>
