<template>
  <div class="home">
    <div class="fullWidth xflex">
      <div class="contentBlock spacing color">CPU</div>
      <div class="contentBlock spacing color">GPU</div>
      <div class="contentBlock spacing color">内存总量</div>
      <div class="contentBlock spacing color">CPU使用率</div>
      <div class="contentBlock spacing color">内存使用率</div>
      <Chart
        id="leida"
        :data="gaugeData"
        :loading="loading"
        class="chart color spacing"
        @chartMounted="chartMounted"
      />
      <LineChart
        id="linechart"
        :data="lineChar"
        class="chart color"
        @chartMounted="lineMounted"
      />
    </div>
    <div class="fullWidth xflex spacingTop" />
  </div>
</template>

<script setup>
import Chart from "./components/Chart.vue";

import LineChart from "./components/LineChart.vue";
import {
  ref,
  onMounted,
  reactive,
  nextTick,
  onUnmounted,
  watchEffect
} from "vue";

const loading = ref(false);
const gaugeData = ref(0);
const lineChar = reactive([]);
const lineLoading = ref(false);
const lineMounted = () => {
  setInterval(() => {
    loadLine();
  }, 1000);
};
const chartMounted = () => {
  loadData();
};
const loadData = () => {
  loading.value = true;
  setTimeout(() => {
    gaugeData.value = Number.parseFloat((Math.random() * 100).toFixed(2));
    loading.value = false;
  }, 1000);
};
const loadLine = () => {
  lineLoading.value = true;
  setTimeout(() => {
    lineChar[0] = (Math.random() * 100).toFixed(2);
    lineLoading.value = false;
  }, 1000);
};
onMounted(() => {});

onUnmounted(() => {});
</script>

<style lang="scss" scoped>
$backColor: #111;
$frontColor: #fff;
$hoverBackColor: #333;
$spacing: 15px;
.home {
  user-select: none;

  .fullWidth {
    width: 100%;
  }

  .color {
    background-color: $backColor;
    color: $frontColor;
    border-radius: 3px;
  }

  .marginCenter {
    margin: 0 auto;
  }

  .spacingTop {
    margin-top: $spacing;
  }

  .xflex {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .contentBlock {
    width: max-content;
    padding: $spacing;
    box-shadow: 0 0 3px #000;
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      cursor: pointer;
      background-color: $hoverBackColor;
    }
  }

  .spacing {
    margin: 0 $spacing 0 0;
  }

  .chart {
    width: 300px;
    height: 200px;
  }
}
</style>
