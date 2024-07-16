<template>
  <div class="pageRoot allPadding">
    <!--  基础文字信息-->
    <div class="row xFlex label">
      <div class="info allPadding mr stretch yFlex jcc aic">
        系统运行时间：{{ runtime }}
      </div>
      <div class="info allPadding mr xFlex stretch jcc aic">
        <div class="mr">CPU：</div>
        <div class="xFlex">
          <div class="item overlay allPadding">
            {{ data.cpu["Core(s) per socket"] }}核
          </div>
          <div class="item overlay ml allPadding">
            {{ data.cpu["CPU(s)"] }}线程
          </div>
        </div>
      </div>
      <div class="info allPadding mr xFlex jcc aic">
        <div class="mr">内存：</div>
        <div class="xFlex">
          <div class="item allPadding overlay xFlex aic">
            <span>总容量：</span>
            <span>{{ convertUnit(data.mem.total, "kb") }}</span>
          </div>
          <div class="item allPadding overlay xFlex aic ml">
            <span>已使用：</span>
            <span>{{ convertUnit(data.mem.used, "kb") }}</span>
          </div>
          <div class="item allPadding overlay xFlex aic ml">
            <span>未使用：</span>
            <span>{{ convertUnit(data.mem.free, "kb") }}</span>
          </div>
        </div>
      </div>
      <div class="info allPadding xFlex jcc aic stretch flexRight">
        <div class="item allPadding xFlex aic">
          <span>转发总路数：</span>
          <span>{{ liveCount }}</span>
        </div>
        <div class="item allPadding xFlex aic ml">
          <span>观看总人数：</span>
          <span>{{ playerCount }}</span>
        </div>
      </div>
    </div>
    <div class="row grid3 mt">
      <div class="info allPadding stretch yFlex">
        <div class="xFlex jcsb aic stretch">
          <span :title="data.cpu['Model name']" class="label labelNoWrap">{{
            data.cpu["Model name"]
          }}</span>
          <el-tag :type="tagColor" class="value" round>{{ cpuRate }}%</el-tag>
        </div>
        <cpuLine :value="cpuRateList" :x="lineX" />
      </div>
      <div class="info allPadding stretch yFlex">
        <div class="xFlex jcsb aic fullWidth">
          <span class="label">硬盘</span>
          <span class="label"
            >{{ convertUnit(diskTotal.used, "kb") }}/{{
              convertUnit(diskTotal.size, "kb")
            }}</span
          >
        </div>
        <diskBar :value="data.disk" />
      </div>
      <div class="info allPadding stretch yFlex">
        <div class="xFlex jcsb aic stretch">
          <span class="label">内存</span>
          <el-tag round size="large" type="success"
            >{{ convertUnit(data.mem.total, "kb") }}
          </el-tag>
        </div>
        <memChart :source="data.mem" :value="memList" :x="lineX" />
      </div>
    </div>
    <div class="row amplify info allPadding mt yFlex">
      <div class="xFlex aic stretch">
        <el-tag round size="large" type="primary"
          >上传速度：{{ netTotalData.nowTx }}Mbit/s
        </el-tag>
        <el-tag class="ml" round size="large" type="primary"
          >下载速度：{{ netTotalData.nowRx }}Mbit/s
        </el-tag>
        <el-tag class="xMargin" round size="large" type="primary"
          >总上传：{{ convertUnit(netTotalData.txs, "mb") }}
        </el-tag>
        <el-tag round size="large" type="primary"
          >总下载：{{ convertUnit(netTotalData.rxs, "mb") }}
        </el-tag>
        <!--        切换操作-->
        <el-select
          v-model="curNet"
          class="flexRight"
          clearable
          placeholder="请选择需要查看的网卡"
          size="large"
          style="width: 250px"
        >
          <el-option
            v-for="item in data.net"
            :key="item.interface_name"
            :label="item.interface_name"
            :value="item.interface_name"
          />
        </el-select>
        <el-radio-group v-model="showMode" class="ml" size="large">
          <el-radio-button :value="1" label="按数值" />
          <el-radio-button :value="2" label="按百分比" />
        </el-radio-group>
      </div>
      <netLine
        ref="refNetLine"
        :rx="dataByShowMode.rx"
        :showMode="showMode"
        :tx="dataByShowMode.tx"
        :x="lineX"
      />
    </div>
  </div>
</template>

<script setup>
// import { useDark } from "@pureadmin/utils";
import {
  dashboardInfo,
  dashboardData,
  streamLiveCount,
  streamPlayerCount
} from "@/api/sysinfo";
import cpuLine from "./components/cpuLine.vue";
import diskBar from "./components/diskBar.vue";
import netLine from "./components/netLine.vue";
import memChart from "./components/memChart.vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);
import { message } from "@/utils/message";
import { ref, onMounted, reactive, onUnmounted, computed } from "vue";

// const { isDark } = useDark();
//定时器id
let timerId = undefined;
let refreshId = undefined;
const loading = ref(false);
//观看人数
const liveCount = ref(0);
//摄像头总路数
const playerCount = ref(0);
// CPU占用率
const cpuRate = ref(0);
//CPU占用率历史
const cpuRateList = reactive([]);
//内存占用表
const memList = reactive([]);
// tab选中网卡
const curNet = ref("");
//当前选中的显示模式
const showMode = ref(1);

const data = reactive({
  cpu: {},
  host: {},
  disk: [],
  net: [],
  mem: {
    total: 0
  }
});
// 公用折线图X轴
const lineX = reactive([]);
// tag颜色
let tagColor = computed(() => {
  return cpuRate.value > 85
    ? "danger"
    : cpuRate.value > 75
      ? "warning"
      : "success";
});
//系统运行时长
const runtime = computed(() => {
  let dur = data.host.uptime ?? 0;
  // 天
  return Number.parseFloat((dur / 24 / 60 / 60).toFixed(2)) + "天";
  // 年月日
  // return dayjs.duration(dur * 1000).format("Y年M月D天 H:m:s");
});
//线程数
const threads = computed(() => {
  return (
    Number.parseInt(data.cpu["Core(s) per socket"]) *
    Number.parseInt(data.cpu["Thread(s) per core"])
  );
});
//硬盘统计数据
const diskTotal = computed(() => {
  let total = {
    used: 0,
    available: 0,
    size: 0
  };
  data.disk.forEach(v => {
    total.used += Number.parseFloat(v.used);
    total.available += Number.parseFloat(v.available);
    total.size += Number.parseFloat(v.size);
  });
  return total;
});
//这个数据需要算2份，统计栏用数值，图表里面可能用百分比和数值
const netNumberData = computed(() => {
  let obj = data.net.find(v => v.interface_name === curNet.value);
  let rx = [];
  let tx = [];
  // 网卡速率speed,Mbps
  if (obj) {
    //如果有选中的
    rx = obj.rx.map(v => {
      return Number.parseFloat(((v / 1024 / 1024) * 8).toFixed(2));
    });
    tx = obj.tx.map(v => {
      return Number.parseFloat(((v / 1024 / 1024) * 8).toFixed(2));
    });
  } else {
    //如果没有就看全部
    lineX.forEach((v, i) => {
      let total = data.net.reduce(
        (total, item) => {
          total.rx = total.rx + (item.rx[i] || 0);
          total.tx = total.tx + (item.tx[i] || 0);
          return total;
        },
        {
          rx: 0,
          tx: 0
        }
      );
      total.rx = Number.parseFloat(((total.rx / 1024 / 1024) * 8).toFixed(2));
      total.tx = Number.parseFloat(((total.tx / 1024 / 1024) * 8).toFixed(2));
      rx[i] = total.rx;
      tx[i] = total.tx;
    });
  }
  return {
    rx,
    tx
  };
});
//百分比数据
const netPercentData = computed(() => {
  let obj = data.net.find(v => v.interface_name === curNet.value);
  let rx = [];
  let tx = [];
  // 网卡速率speed,Mbps
  if (obj) {
    //如果有选中的
    let speed = (obj.speed / 8) * 1024 * 1024;
    rx = obj.rx.map(v => {
      return Number.parseFloat(((v / speed) * 100).toFixed(2));
    });
    tx = obj.tx.map(v => {
      return Number.parseFloat(((v / speed) * 100).toFixed(2));
    });
  } else {
    //如果没有就看全部
    lineX.forEach((v, i) => {
      let total = data.net.reduce(
        (total, item) => {
          total.rx = total.rx + (item.rx[i] || 0);
          total.tx = total.tx + (item.tx[i] || 0);
          total.speeds = total.speeds + item.speed;
          return total;
        },
        {
          rx: 0,
          tx: 0,
          speeds: 0
        }
      );
      let speed = (total.speeds / 8) * 1024 * 1024;
      rx[i] = Number.parseFloat(((total.rx / speed) * 100).toFixed(2));
      tx[i] = Number.parseFloat(((total.tx / speed) * 100).toFixed(2));
    });
  }
  return {
    rx,
    tx
  };
});
const dataByShowMode = computed(() => {
  if (showMode.value === 1) return netNumberData.value;
  else return netPercentData.value;
});
//网卡统计栏数据
const netTotalData = computed(() => {
  let nowRx = netNumberData.value.rx.at(-1) ?? 0,
    nowTx = netNumberData.value.tx.at(-1) ?? 0,
    rxs = netNumberData.value.rx.reduce((total, item) => total + item, 0) * 8,
    txs = netNumberData.value.tx.reduce((total, item) => total + item, 0) * 8;
  return {
    nowRx,
    nowTx,
    rxs,
    txs
  };
});
//timeout递归定时，不建议用interval
const loopGetData = async () => {
  await loadDashboardData();
  await loadStreamLiveCount();
  await loadStreamPlayerCount();
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
      data.cpu = res.data.cpu ?? {};
      data.net = (res.data.net ?? [])
        .filter(v => !!v.speed)
        .map(v => ({
          ...v,
          // 网卡速率
          speed: Number(v.speed || "0"),
          // 下行
          rx: [],
          // 上行
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
      //内存 数据
      data.mem = res.data?.mem ?? {};
      // cpu占用率
      let rt = Number.parseFloat((100 - (res.data.cpu?.idle ?? 0)).toFixed(2));
      cpuRate.value = rt;
      cpuRateList.push(rt);
      // 内存
      memList.push(res.data.mem);
      // 网络流量统计
      data.net.forEach(v => {
        let obj = (res.data.net ?? []).find(
          item => item.interface_name === v.interface_name
        );
        if (obj) {
          v.rx.push(obj.rx_speed);
          v.tx.push(obj.tx_speed);
        }
      });
      // 主机信息
      data.host = res.data.host ?? {};
      data.host.os_version = data.host?.os_version?.replace(/\s+.*$/g, "");
      //磁盘信息
      data.disk = res.data?.disk ?? [];
      //共享x轴放最后便于监听
      if (res.data.host?.systime) {
        lineX.push(res.data.host.systime);
      }
    } else {
      message(res.msg);
    }
  } catch (err) {
    throw err;
  }
};
const loadStreamLiveCount = async () => {
  try {
    let res = await streamLiveCount();
    if (res.code === 0) {
      liveCount.value = res.data.liveCount;
    } else {
      message(res.msg);
    }
  } catch (err) {
    throw err;
  }
};
const loadStreamPlayerCount = async () => {
  try {
    let res = await streamPlayerCount();
    if (res.code === 0) {
      playerCount.value = res.data.playerCount;
    } else {
      message(res.msg);
    }
  } catch (err) {
    throw err;
  }
};
onMounted(async () => {
  loading.value = true;
  await loadDashboardInfo();
  await loopGetData();
  loading.value = false;
  // 一个小时刷新一次这个页面，数据堆积可能会卡死
  refreshId = setTimeout(
    () => {
      window.location.reload();
    },
    60 * 60 * 1000
  );
});

onUnmounted(() => {
  clearTimeout(timerId);
  timerId = undefined;
  clearTimeout(refreshId);
  refreshId = undefined;
});
</script>

<style lang="scss" scoped>
//颜色定义文件在node_modules里面
//--el-bg-color-page
//--el-bg-color
//--el-bg-color-overlay

//间距圆角
//标准间距
$spacing: 10px;
$spacing2: 5px;
$spacing3: 3px;
$radius: 5px;
//字体大小，第一档最大
$titleSize: 25px;
$bodySize: 20px;
$descSize: 15px;
//第二档
$titleSize2: 20px;
$bodySize2: 16px;
$descSize2: 12px;
//第三档
$titleSize3: 15px;
$bodySize3: 13px;
$descSize3: 12px;

//布局类
.grid3 {
  display: grid;
  column-gap: $spacing;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 400px;
}

.xFlex {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;
}

.yFlex {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
}

.fullWidth {
  width: 100%;
}

.stretch {
  align-self: stretch;
}

.amplify {
  flex-grow: 1;
}

.aic {
  align-items: center;
}

.jcc {
  justify-content: center;
}

.jcsb {
  justify-content: space-between;
}

.tac {
  text-align: center;
}

//间距类
.mr {
  margin-right: $spacing;
}

.mb {
  margin-bottom: $spacing;
}

.mt {
  margin-top: $spacing;
}

.ml {
  margin-left: $spacing;
}

.allMargin {
  margin: $spacing;
}

.xMargin {
  margin-left: $spacing;
  margin-right: $spacing;
}

.yMargin {
  margin-top: $spacing;
  margin-bottom: $spacing;
}

.flexRight {
  margin: 0 0 0 auto;
}

.allPadding {
  padding: $spacing;
  box-sizing: border-box;
}

//字体大小
.label {
  font-size: $titleSize;
  font-weight: bold;
}

.value {
  font-size: $bodySize;
}

.desc {
  font-size: $descSize;
}

.labelNoWrap {
  width: 85%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

//实例样式
.pageRoot {
  user-select: none;
  margin: 0 !important;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  min-width: 1024px;

  * {
    word-break: break-all;
    word-wrap: break-word;
  }
}

.row {
  width: 100%;
}

.info {
  border-radius: $radius;
  background-color: var(--el-bg-color-overlay);

  .overlay {
    background-color: var(--el-bg-color);
  }

  .item {
    border-radius: $radius;
  }
}

@media screen and (max-width: 1366px) {
  .grid3 {
    column-gap: $spacing3;
  }
  //间距类
  .mr {
    margin-right: $spacing3;
  }

  .mb {
    margin-bottom: $spacing3;
  }

  .mt {
    margin-top: $spacing3;
  }

  .ml {
    margin-left: $spacing3;
  }

  .allMargin {
    margin: $spacing3;
  }

  .xMargin {
    margin-left: $spacing3;
    margin-right: $spacing3;
  }

  .yMargin {
    margin-top: $spacing3;
    margin-bottom: $spacing3;
  }

  .allPadding {
    padding: $spacing3;
  }

  //字体大小
  .label {
    font-size: $titleSize3;
  }

  .value {
    font-size: $bodySize3;
  }

  .desc {
    font-size: $descSize3;
  }
}

@media screen and (min-width: 1366px) and (max-width: 1920px) {
  .grid3 {
    column-gap: $spacing2;
  }
  //间距类
  .mr {
    margin-right: $spacing2;
  }

  .mb {
    margin-bottom: $spacing2;
  }

  .mt {
    margin-top: $spacing2;
  }

  .ml {
    margin-left: $spacing2;
  }

  .allMargin {
    margin: $spacing2;
  }

  .xMargin {
    margin-left: $spacing2;
    margin-right: $spacing2;
  }

  .yMargin {
    margin-top: $spacing2;
    margin-bottom: $spacing2;
  }

  .allPadding {
    padding: $spacing2;
  }

  //字体大小
  .label {
    font-size: $titleSize2;
  }

  .value {
    font-size: $bodySize2;
  }

  .desc {
    font-size: $descSize2;
  }
}

@media screen and (min-width: 1920px) {
  .grid3 {
    column-gap: $spacing;
  }
  //间距类
  .mr {
    margin-right: $spacing;
  }

  .mb {
    margin-bottom: $spacing;
  }

  .mt {
    margin-top: $spacing;
  }

  .ml {
    margin-left: $spacing;
  }

  .allMargin {
    margin: $spacing;
  }

  .xMargin {
    margin-left: $spacing;
    margin-right: $spacing;
  }

  .yMargin {
    margin-top: $spacing;
    margin-bottom: $spacing;
  }

  .allPadding {
    padding: $spacing;
  }

  //字体大小
  .label {
    font-size: $titleSize;
  }

  .value {
    font-size: $bodySize;
  }

  .desc {
    font-size: $descSize;
  }
}
</style>
