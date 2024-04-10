<script setup>
import CPUInfo from "@/components/sysinfo/CPUInfo.vue";
import DiskInfo from "@/components/sysinfo/DiskInfo.vue";
import ProcessInfo from "@/components/sysinfo/ProcessInfo.vue";
import Pie from "@/components/v-charts/index.vue";
import IOInfo from "@/components/sysinfo/IOInfo.vue";
import GpuInfo from "@/components/sysinfo/GpuInfo.vue";
import { ref, onMounted, nextTick, onUnmounted, watchEffect } from "vue";
import { useGlobalStore } from "@/store/modules/sysinfo";

const globalStore = useGlobalStore();

const pieWidth = ref(200);
const pieHeight = ref(200);

const chartsOption = ref({
  cpuChart: {
    title: "CPU",
    data: 0.0
  },
  memoryChart: {
    title: "Memory",
    data: 0.0
  },
  loadChart: {
    title: "Load",
    data: 0.0
  },
  diskChart: {
    title: "Disk",
    data: 0.0
  }
});

const cpuInfo = ref("");
const cpuTableData = ref([]);
const memTableData = ref({});
const loadTableData = ref({});
const netTableData = ref([]);
const diskTableData = ref([]);
const processTableData = ref([]);
const gpuTableData = ref([]);
const diskInfo = ref("");

const getCPUUsage = cpuData => {
  if (cpuData.usage > 0) {
    return cpuData.usage * 100;
  }
  return 0.0;
};

const getMemoryUsage = memData => {
  if (memData.used && memData.total) {
    const usage = (memData.used / memData.total) * 100;
    return usage;
  }
  return 0.0;
};

const getLoadUsage = (loadData, cpuCount) => {
  if (loadData && cpuCount > 0) {
    return (loadData.load1 / cpuCount) * 100;
  }
  return 0.0;
};

const getDiskUsage = diskData => {
  if (diskData.length > 0) {
    return parseFloat(diskData);
  }
  return 0.0;
};

const getRemoteInfo = async () => {
  console.log("start");
  await globalStore.getSystemInfo();
  console.log(globalStore);
  cpuInfo.value = globalStore.systemInfo.cpuInfo;
  // cpu 进度表
  cpuTableData.value = globalStore.systemInfo.cpuDetail;
  // memory pie
  memTableData.value = globalStore.systemInfo.memoryInfo;
  // load pie
  loadTableData.value = globalStore.systemInfo.loadInfo;
  // networks i/o
  netTableData.value = globalStore.systemInfo.networksInfo;
  // disk pie
  diskInfo.value = globalStore.systemInfo.diskInfo;
  // disk 表格
  diskTableData.value = globalStore.systemInfo.diskDetail;
  // process 表格
  processTableData.value = globalStore.systemInfo.processInfo;
  // gpu 表格
  gpuTableData.value = globalStore.systemInfo.gpuDetail;
  // pie 图表赋值
  chartsOption.value.cpuChart.data = getCPUUsage(cpuInfo.value).toFixed(2);
  chartsOption.value.memoryChart.data = getMemoryUsage(
    memTableData.value
  ).toFixed(2);
  chartsOption.value.loadChart.data = getLoadUsage(
    loadTableData.value,
    cpuTableData.value.length
  ).toFixed(2);
  chartsOption.value.diskChart.data = getDiskUsage(diskInfo.value).toFixed(2);
};

const resizePie = () => {
  // 获取图表容器元素
  let container = document.getElementById("pie-container");
  if (!container) return;
  adjustFlexPieItems();
  // 计算新的宽度和高度为容器的 25%
  nextTick(() => {
    pieWidth.value = container.offsetWidth * 0.25;
    pieHeight.value = container.offsetHeight * 1;
  });
};

function adjustFlexPieItems() {
  const container = document.querySelector(".flex-pie");
  const items = container.children;
  const itemCount = items.length;

  for (let i = 0; i < itemCount; i++) {
    items[i].style.position = "absolute";
    items[i].style.top = "0";
    items[i].style.height = "100%";
    items[i].style.left = `${(100 / itemCount) * i}%`;
    items[i].style.width = `${100 / itemCount}%`;
  }
}

onMounted(() => {
  //初始化本地连接状态配置缓存
  globalStore.initLocalStorage();
  resizePie();
  getRemoteInfo();
  window.addEventListener("resize", resizePie);
  watchEffect(() => {
    if (globalStore.isConnected) {
      //先触发一次保证第一个三秒内有值
      getRemoteInfo();
      setInterval(() => {
        nextTick(() => {
          getRemoteInfo();
        });
      }, 2000);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", resizePie);
});
</script>

<template>
  <div id="welcome-container">
    <el-row :gutter="10" class="welcome-row">
      <el-col :span="24" class="welcome-col">
        <div class="grid-content ep-bg-purple">
          <el-card class="box-card" id="pie-container">
            <div class="flex-pie">
              <Pie
                id="cpu"
                :width="pieWidth + 'px'"
                :height="pieHeight + 'px'"
                :option="chartsOption.cpuChart"
              />
              <Pie
                id="memory"
                :width="pieWidth + 'px'"
                :height="pieHeight + 'px'"
                :option="chartsOption.memoryChart"
              />
              <Pie
                id="load"
                :width="pieWidth + 'px'"
                :height="pieHeight + 'px'"
                :option="chartsOption.loadChart"
              />
              <Pie
                id="disk"
                :width="pieWidth + 'px'"
                :height="pieHeight + 'px'"
                :option="chartsOption.diskChart"
              />
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="5" class="welcome-row">
      <el-col :span="8" class="welcome-col">
        <div class="grid-content ep-bg-purple">
          <el-card class="box-card">
            <CPUInfo :option="cpuTableData" />
          </el-card>
        </div>
      </el-col>
      <el-col :span="8" class="welcome-col">
        <div class="grid-content ep-bg-purple">
          <el-card class="box-card">
            <GpuInfo :option="gpuTableData" />
          </el-card>
        </div>
      </el-col>
      <el-col :span="8" class="welcome-col">
        <div class="grid-content ep-bg-purple">
          <el-card class="box-card">
            <!-- <IOInfo :option="netTableData" /> -->
            <DiskInfo :option="diskTableData" />
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="welcome-row">
      <el-col :span="24" class="welcome-col">
        <div class="grid-content ep-bg-purple">
          <el-card class="box-card">
            <ProcessInfo :option="processTableData" />
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.welcome-row {
  height: calc((calc(100vh) - 108px) / 3);
  margin-bottom: 5px;
  .welcome-col {
    height: 100%;
  }
  .grid-content {
    height: 100%;
    .box-card {
      height: 100%;
      border-radius: 0px;
    }
    .flex-pie {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: nowrap;
      height: 100%;
      width: 100%;
    }
    :deep(.el-card__body) {
      padding: 0px !important;
      height: 100%;
    }
  }
}
</style>
