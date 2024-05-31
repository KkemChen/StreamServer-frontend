<template>
  <div class="root">
    <div class="fullWidth xflex">
      <div class="contentBlock spacing color">CPU</div>
      <div class="contentBlock spacing color">GPU</div>
      <Chart id="leida" class="chart" />
    </div>
    <div class="fullWidth xflex spacingTop" />
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import Chart from "./components/Chart.vue";
import { ref, onMounted, nextTick, onUnmounted, watchEffect } from "vue";

console.log(echarts);
const loading = ref(false);
const loadData = async () => {
  loading.value = true;
  let res = await Promise.all([]);
  loading.value = false;
};

onMounted(() => {});

onUnmounted(() => {});
</script>

<style lang="scss" scoped>
$backColor: #111;
$frontColor: #fff;
$hoverBackColor: #333;
.root {
  user-select: none;
}

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
  margin-top: 15px;
}

.xflex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.contentBlock {
  width: max-content;
  padding: 15px;
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
  margin: 0 15px 15px 0;
}

.chart {
  width: 800px;
  height: 300px;
}
</style>
