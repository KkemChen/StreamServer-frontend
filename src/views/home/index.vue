<template>
  <div class="home">
    <!-- 第一行 -->
    <div class="fullWidth xgrid4 spacingBottom">
      <div class="contentBlock color">
        <div class="blockTitle">系统信息</div>
        <div :title="data.host.hostname" class="blockValue">
          主机名称：{{ data.host.hostname }}
        </div>
        <div :title="data.host.os_version" class="blockValue">
          发行版本：{{ data.host.os_version }}
        </div>
        <div :title="data.host.os_release" class="blockValue">
          内核版本：{{ data.host.os_release }}
        </div>
        <div :title="data.host.platform" class="blockValue">
          系统类型：{{ data.host.platform }}
        </div>
        <div :title="data.host.systime" class="blockValue">
          系统时间：{{ data.host.systime }}
        </div>
      </div>
      <div class="contentBlock color stretch yflex">
        <div class="blockTitle">CPU占用率</div>
        <GaugeChart
          id="cpu"
          :color="color"
          :data="cpuRate"
          :fontSize="fontSize"
          class="GaugeChart stretch"
        />
      </div>
      <div class="contentBlock color stretch yflex">
        <div class="blockTitle">内存占用率</div>
        <GaugeChart
          id="mem"
          :color="color"
          :data="memRate"
          :fontSize="fontSize"
          class="GaugeChart stretch"
        />
      </div>
      <div class="contentBlock color stretch yflex">
        <div class="blockTitle">虚拟内存</div>
        <GaugeChart
          id="swap"
          :color="color"
          :data="swapRate"
          :fontSize="fontSize"
          class="GaugeChart stretch"
        />
      </div>
    </div>
    <!-- 第二行 -->
    <div class="fullWidth xgrid3 spacingBottom">
      <div class="contentBlock color yflex">
        <div class="blockTitle">负载情况</div>
        <LineChart
          id="load"
          :color="color"
          :data="data.load"
          :x="lineX"
          class="stretch"
        />
      </div>
      <div class="contentBlock color yflex">
        <div class="blockTitle">磁盘总空间</div>
        <PieChart
          id="disk"
          :color="color"
          :data="curDiskData"
          :fontSize="fontSize"
          :x="lineX"
          class="stretch"
        />
      </div>
      <div class="contentBlock color yflex">
        <div class="blockTitle">磁盘使用情况</div>
        <div class="tableHeader">
          <div class="colHeader" title="剩余容量">剩余容量</div>
          <div class="colHeader" title="文件系统">文件系统</div>
          <div class="colHeader" title="挂载分区">挂载分区</div>
          <div class="colHeader" title="总容量">总容量</div>
          <div class="colHeader" title="使用率">使用率</div>
          <div class="colHeader" title="已使用">已使用</div>
        </div>
        <div class="tables">
          <div
            v-for="item in data.disk"
            :key="item.mounted_on"
            :class="['tr', curDisk === item.mounted_on && 'active']"
            @click="setCurDisk(item.mounted_on)"
          >
            <span :title="item.available" class="tableData">{{
              convertUnit(item.available, "kb")
            }}</span>
            <span :title="item.filesystem" class="tableData">{{
              item.filesystem
            }}</span>
            <span :title="item.mounted_on" class="tableData">{{
              item.mounted_on
            }}</span>
            <span :title="item.size" class="tableData">{{
              convertUnit(item.size, "kb")
            }}</span>
            <span :title="item.use_percent" class="tableData">{{
              item.use_percent
            }}</span>
            <span :title="item.used" class="tableData">{{
              convertUnit(item.used, "kb")
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 第三行 -->
    <div class="fullWidth">
      <div class="contentBlock color yflex">
        <div class="blockTitle">网络流量统计</div>
        <div id="blockTabs" class="stretch xflex">
          <div class="tabs">
            <div
              v-for="item in data.net"
              :key="item.interface_name"
              :class="['tab', curNet === item.interface_name && 'active']"
              :title="item.interface_name + `[${item.ipv4.join()}]`"
              @click="setCurNet(item.interface_name)"
            >
              {{ item.interface_name }}&nbsp;{{ item.ipv4 }}
            </div>
          </div>
          <NetChart
            id="netLoad"
            :color="color"
            :data="curNetData"
            :fontSize="fontSize"
            :x="lineX"
            class="stretch"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDark } from "@pureadmin/utils";
import { dashboardInfo, dashboardData } from "@/api/sysinfo";
import GaugeChart from "./components/GaugeChart.vue";
import LineChart from "./components/LineChart.vue";
import NetChart from "./components/NetChart.vue";
import PieChart from "./components/PieChart.vue";
import { message } from "@/utils/message";
import { ref, onMounted, reactive, onUnmounted, computed, watch } from "vue";

const { isDark } = useDark();
const loading = ref(false);
//数据
const data = reactive({
  host: {},
  swap: {},
  disk: [],
  load: {},
  net: []
});
// 颜色配置
const color = computed(() => {
  return isDark.value
    ? {
        front: "#fff",
        back: "#000",
        subBack: "#fff",
        guage: ["#67C23A", "#E6A23C", "#F56C6C"]
      }
    : {
        front: "#000",
        back: "#fff",
        subBack: "#eee",
        guage: ["#67C23A", "#E6A23C", "#F56C6C"]
      };
});
// 字体配置
const fontSize = reactive({
  titleSize: 25,
  bodySize: 20,
  descSize: 15
});
// CPU占用率
const cpuRate = ref(0);
//内存占用率
const memRate = ref(0);
// 虚拟内存占用
const swapRate = ref(0);
// 负载
const lineX = reactive([]);
// tab选中网卡
const curNet = ref("");
//根据当前tab返回列表中的数据
const curNetData = computed(() => {
  let obj = data.net.find(v => v.interface_name === curNet.value);
  if (obj) {
    let rx = obj.rx.map(v => Number.parseFloat((v / 1024).toFixed(2)));
    let tx = obj.tx.map(v => Number.parseFloat((v / 1024).toFixed(2)));
    return {
      rx,
      tx
    };
  } else {
    let rx = [];
    let tx = [];
    lineX.forEach((v, i) => {
      let total = data.net.reduce(
        (total, item) => {
          total.rx += item.rx[i];
          total.tx += item.tx[i];
          return total;
        },
        {
          rx: 0,
          tx: 0
        }
      );
      rx.push(Number.parseFloat((total.rx / 1024).toFixed(2)));
      tx.push(Number.parseFloat((total.tx / 1024).toFixed(2)));
    });
    return {
      rx,
      tx
    };
  }
});
// 当前选中的硬盘
const curDisk = ref("");
const curDiskData = computed(() => {
  let obj = data.disk.find(v => v.mounted_on === curDisk.value);
  // 有obj则为选中
  if (obj) {
    let used = Number.parseFloat(obj.used);
    let available = Number.parseFloat(obj.available);
    return {
      use: used,
      unUse: available
    };
  } else {
    let used = data.disk.reduce((count, item) => {
      count += Number.parseFloat(item.used);
      return count;
    }, 0);
    let available = data.disk.reduce((count, item) => {
      count += Number.parseFloat(item.available);
      return count;
    }, 0);
    return {
      use: used,
      unUse: available
    };
  }
});
//定时器id
let timerId = undefined;
let refreshId = undefined;
const loopGetData = async () => {
  await loadDashboardData();
  if (!refreshId) {
    // 一个小时刷新一次这个页面，数据堆积可能会卡死
    refreshId = setTimeout(
      () => {
        window.location.reload();
      },
      60 * 60 * 1000
    );
  }
  if (timerId) {
    clearTimeout(timerId);
    timerId = undefined;
  }
  timerId = setTimeout(() => {
    loopGetData();
  }, 5 * 1000);
};
// 单位转换
const convertUnit = (value = 0, unit = "") => {
  const units = ["PB", "TB", "GB", "MB", "KB", "B"];
  const convertValue = 1024;
  const hold = 2; //保留多少位
  const NumberValue = Number.parseFloat(value);
  // 值和单位
  let upUnit = unit.toUpperCase(); //大写单位
  if (units.includes(upUnit)) {
    let startIndex = units.findIndex(v => v === upUnit);
    if (startIndex === 0 || NumberValue < convertValue) {
      return `${Number.parseFloat(NumberValue.toFixed(hold))}${upUnit}`;
    } else {
      let result = NumberValue,
        resultUnit = upUnit;
      while (result > convertValue && startIndex !== 0) {
        result = result / convertValue;
        startIndex--;
        resultUnit = units[startIndex];
      }
      return `${Number.parseFloat(result.toFixed(hold))}${resultUnit}`;
    }
  } else {
    return `${Number.parseFloat(NumberValue.toFixed(hold))}${upUnit}`;
  }
};
const loadDashboardInfo = async () => {
  try {
    let res = await dashboardInfo();
    if (res.code === 0) {
      data.net = (res.data.net ?? []).map(v => ({
        ...v,
        // 下行
        rx: [],
        tx: []
      }));
    } else {
      message(res.msg);
    }
  } catch (err) {
    throw err;
  }
};
const loadDashboardData = async () => {
  try {
    let res = await dashboardData();
    if (res.code === 0) {
      // cpu占用率
      cpuRate.value = Number.parseFloat(
        (100 - (res.data.cpu?.idle ?? 0)).toFixed(2)
      );
      // 内存比率
      memRate.value = Number.parseFloat(
        (
          ((res.data.mem?.used ?? 0) / (res.data.mem?.total ?? 0)) *
          100
        ).toFixed(2)
      );
      // 虚拟内存占用
      if (res.data.swap?.total === 0) {
        swapRate.value = 0;
      } else {
        swapRate.value = Number.parseFloat(
          (
            ((res.data.swap?.used ?? 0) / (res.data.swap?.total ?? 0)) *
            100
          ).toFixed(2)
        );
      }
      //共享x轴
      if (res.data.host?.systime) {
        lineX.push(res.data.host.systime);
      }
      // 负载图
      Object.keys(res.data.load).forEach(key => {
        let dt = data.load[key];
        if (dt) {
          data.load[key].push(res.data.load[key]);
        } else {
          data.load[key] = [res.data.load[key]];
        }
      });
      // 网络流量统计
      (res.data.net ?? []).forEach(v => {
        let name = v.interface_name;
        let currentData = data.net.find(v => v.interface_name === name);
        if (currentData) {
          currentData.rx.push(v.rx_speed);
          currentData.tx.push(v.tx_speed);
        }
      });
      // 主机信息
      data.host = res.data.host;
      data.host.os_version = res.data.host.os_version?.replace(/\s+.*$/g, "");
      //虚拟内存
      data.swap = res.data?.swap ?? [];
      //磁盘信息
      data.disk = res.data?.disk ?? [];
    } else {
      message(res.msg);
    }
  } catch (err) {
    throw err;
  }
};
const setCurNet = name => {
  if (curNet.value === name) {
    curNet.value = "";
  } else {
    curNet.value = name;
  }
};
const setCurDisk = name => {
  if (curDisk.value === name) {
    curDisk.value = "";
  } else {
    curDisk.value = name;
  }
};
onMounted(async () => {
  loading.value = true;
  await loadDashboardInfo();
  await loopGetData();
  loading.value = false;
});

onUnmounted(() => {
  clearTimeout(timerId);
  timerId = undefined;
  clearTimeout(refreshId);
  refreshId = undefined;
});
</script>

<style lang="scss" scoped>
$backColor: var(--el-bg-color);
$frontColor: var(--el-text-color-primary);
$spacing: 10px;
$radius: 3px;
$titleSize: 25px;
$bodySize: 20px;
$descSize: 15px;
// 16:9的比例
$widthRate: 16px;
$heightRate: 9px;
.home {
  user-select: none;

  .fullWidth {
    width: 100%;
  }

  .color {
    background-color: $backColor;
    color: $frontColor;
    border-radius: $radius;
  }

  .marginCenter {
    margin: 0 auto;
  }

  .spacingTop {
    margin-top: $spacing;
  }

  .spacingBottom {
    margin-bottom: $spacing;
  }

  .xgrid3 {
    display: grid;
    grid-template-columns: 0.5fr 0.5fr 1fr;
    column-gap: $spacing;
  }

  .xgrid4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: $spacing;
  }

  .xflex {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
  }

  .yflex {
    display: flex;
    flex-direction: column;
  }

  .tableHeader {
    width: 100%;
    flex-shrink: 0;
    display: grid;
    column-gap: $spacing;
    row-gap: $spacing;
    grid-template-columns: repeat(6, 1fr);

    .colHeader {
      font-weight: 600;
      font-size: $descSize;
      padding: $spacing;
    }
  }

  .tables {
    width: 100%;
    max-height: $heightRate * 30;
    overflow: auto;

    .tr {
      margin-bottom: $spacing;
      display: grid;
      column-gap: $spacing;
      grid-template-columns: repeat(6, 1fr);
      cursor: pointer;

      &:hover {
        & > .tableData {
          background-color: var(--el-text-color-placeholder);
        }
      }
    }

    .active {
      & > .tableData {
        background-color: var(--el-text-color-placeholder);
      }
    }

    &::-webkit-scrollbar {
      display: none;
    }

    .tableData {
      background-color: rgba($frontColor, 0.05);
      padding: $spacing;
      box-sizing: border-box;
      font-size: $descSize;
    }
  }

  .colHeader,
  .tableData {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .stretch {
    align-self: stretch;
    flex-grow: 1;
  }

  .contentBlock {
    padding: $spacing;
    box-shadow: 0 0 $radius $frontColor;

    & > .blockTitle {
      font-size: $titleSize;
    }

    & > .blockValue {
      font-size: $bodySize;
      margin-top: $spacing;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .spacingRight {
    margin-right: $spacing;
  }

  .GaugeChart {
    $rate: 20;
    min-width: $widthRate * $rate;
    min-height: $heightRate * $rate;
  }

  #load {
    $rate: 30;
    min-width: $widthRate * $rate;
    min-height: $heightRate * $rate;
  }

  #disk {
    $rate: 30;
    min-width: $widthRate * $rate;
    min-height: $heightRate * $rate;
  }

  #netLoad {
    width: max-content;
    height: 100%;
  }

  #blockTabs {
    $rate: 45;
    width: 100%;
    margin-top: $spacing;
    height: $heightRate * $rate;

    .tabs {
      width: max-content;
      max-width: 400px;
      width: 100%;
      height: 100%;
      overflow: auto;

      &::-webkit-scrollbar {
        display: none;
      }

      .tab {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        width: 100%;
        color: $frontColor;
        font-size: $bodySize;
        margin-bottom: $spacing;
        background-color: var(--el-fill-color);
        padding: $spacing;
        border-radius: $radius;

        &:hover {
          background-color: var(--el-text-color-placeholder);
        }
      }

      .active {
        background-color: var(--el-text-color-placeholder);
      }
    }
  }
}
</style>
