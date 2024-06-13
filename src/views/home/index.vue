<template>
  <div class="home">
    <!-- 第一行 -->
    <div class="fullWidth xflex">
      <div class="contentBlock spacingRight color stretch spacingBottom">
        <div class="blockTitle">系统信息</div>
        <div class="blockValue">
          主机名称：{{ data.host.hostname }}
        </div>
        <div class="blockValue">
          发行版本：{{ data.host.os_version }}
        </div>
        <div class="blockValue">
          内核版本：{{ data.host.os_release }}
        </div>
        <div class="blockValue">
          系统类型：{{ data.host.platform }}
        </div>
        <div class="blockValue">
          系统时间：{{ data.host.systime }}
        </div>
      </div>
      <div class="contentBlock spacingRight color stretch spacingBottom">
        <div class="blockTitle">CPU占用率</div>
        <GaugeChart
          id="cpu"
          :color="color"
          :fontSize="fontSize"
          :data="cpuRate"
          class="GaugeChart color"
        />
      </div>
      <div class="contentBlock spacingRight color stretch spacingBottom">
        <div class="blockTitle">内存占用率</div>
        <GaugeChart
          id="mem"
          :color="color"
          :fontSize="fontSize"
          :data="memRate"
          class="GaugeChart color"
        />
      </div>
      <div class="contentBlock color stretch spacingBottom">
        <div class="blockTitle">虚拟内存</div>
        <GaugeChart
          id="swap"
          :color="color"
          :fontSize="fontSize"
          :data="swapRate"
          class="GaugeChart color"
        />
      </div>
    </div>
    <!-- 第二行 -->
    <div class="fullWidth xflex">
      <div class="contentBlock color yflex stretch spacingRight spacingBottom">
        <div class="blockTitle">负载情况</div>
        <LineChart
          id="load"
          :x="lineX"
          :min1="loadMin1"
          :min5="loadMin5"
          :min15="loadMin15"
          class="color stretch"
        />
      </div>
      <div class="contentBlock color yflex stretch spacingRight spacingBottom">
        <div class="blockTitle">磁盘总空间</div>
        <PieChart
          id="disk"
          :color="color"
          :fontSize="fontSize"
          :data="data.disk"
          class="color stretch"
        />
      </div>
      <div class="contentBlock color yflex stretch spacingBottom">
        <div class="blockTitle">磁盘使用情况</div>
        <div class="tableHeader">
          <div class="colHeader" title="剩余容量">剩余容量</div>
          <div class="colHeader" title="文件系统">文件系统</div>
          <div class="colHeader" title="挂载分区">挂载分区</div>
          <div class="colHeader" title="总容量">总容量</div>
          <div class="colHeader" title="使用率">使用率</div>
          <div class="colHeader" title="已使用">已使用</div>
        </div>
        <div class="table spacingBottom">
          <template v-for="item in data.disk" :key="item.mounted_on">
            <span class="tableData" :title="item.available">{{ item.available }}</span>
            <span class="tableData" :title="item.filesystem">{{ item.filesystem }}</span>
            <span class="tableData" :title="item.mounted_on">{{ item.mounted_on }}</span>
            <span class="tableData" :title="item.size">{{ item.size }}</span>
            <span class="tableData" :title="item.use_percent">{{ item.use_percent }}</span>
            <span class="tableData" :title="item.used">{{ item.used }}</span>
          </template>
        </div>
      </div>
    </div>
    <!-- 第三行 -->
    <div class="fullWidth xflex stretch">
      <div class="contentBlock color stretch yflex">
        <div class="blockTitle">网络流量统计</div>
        <div id="blockTabs" class="stretch xflex color">
          <div class="tabs">
            <div :title="item.name+`[${item.ipv4.join()}]`" @click="curTab=item.name" :class="['tab',curTab===item.name&&'active']" v-for="item in netData" :key="item.name">{{ item.name }}&nbsp;{{ item.ipv4 }}</div>
          </div>
          <NetChart
            v-if="!!curTab"
            :color="color"
          :fontSize="fontSize"
            id="netLoad"
            class="stretch"
            :x="lineX"
            :data="curData"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { dashboardInfo,dashboardData } from '@/api/sysinfo';
import GaugeChart from "./components/GaugeChart.vue";
import LineChart from "./components/LineChart.vue";
import NetChart from "./components/NetChart.vue";
import PieChart from "./components/PieChart.vue";
import { message } from '@/utils/message';
import {ref,onMounted,reactive,onUnmounted,computed} from "vue";

const loading = ref(false);
//数据
const data = reactive({
  host: {},
  swap: {},
  disk:[]
})
const color = reactive({
  front: '#fff',
  back: '#111',
  guage:['#00e280','#ffae3b','#dd001f']
})
const fontSize = reactive({
  titleSize:35,
  bodySize:25,
  descSize:15
})

// CPU占用率
const cpuRate = ref(0)
//内存占用率
const memRate = ref(0)
// 虚拟内存占用
const swapRate = ref(0)
// 负载
const lineX=reactive([])
const loadMin1=reactive([])
const loadMin5=reactive([])
const loadMin15 = reactive([])
//网络负载
const netData = reactive([])
// tab选中
const curTab = ref()
// 当前选中的数据，rx是下载
const curData = computed(() => {
  let obj = netData.find(v => v.name === curTab.value)
  return obj
})
//定时器id
let timerId = undefined
let refreshId=undefined
const  loopGetData = async() => {
  await loadDashboardData()
  if (!refreshId) {
    // 一个小时刷新一次这个页面，数据堆积可能会卡死
    refreshId=setTimeout(() => {
      window.location.reload()
    }, 60*60*1000);
  }
  if (timerId) {
    clearTimeout(timerId)
    timerId=undefined
  }
  timerId=setTimeout(() => {
    loopGetData()
  }, 5*1000);
}
// 单位转换
const convertUnit = (value=0, unit='') => {
  const units = ['PB','TB', 'GB', 'MB', 'KB', 'B']
  const convertValue = 1024
  const hold=2//保留多少位
  // 值和单位
  let upUnit = unit.toUpperCase()//大写单位
  if (units.includes(upUnit)) {
    let startIndex = units.findIndex(v => v === upUnit)
    if (startIndex === 0||value<convertValue) {
      return `${Number.parseFloat(value.toFixed(hold))}${upUnit}`
    }
    else {
      let result = value,resultUnit=upUnit
      while (result > convertValue && startIndex!==0)
      {
        result = result / convertValue
        startIndex--
        resultUnit=units[startIndex]
      }
      return `${Number.parseFloat(result.toFixed(hold))}${resultUnit}`
    }
  }
  else { 
    return `${Number.parseFloat(value.toFixed(hold))}${upUnit}`
  }
}
const loadDashboardInfo = async () => {
  try {
    let res = await dashboardInfo()
    if (res.code === 0) {
      // 这里的结构是echart的series结构
      netData.push(...res.data.net.map(v => ({
        ...v,
        name: v.interface_name,
        data: {
          rx: [],
          tx:[]
        }
      })))
      curTab.value=netData.at().name
    }
    else {
      message(res.msg)
    }
  }
  catch (err) {
    console.log(err)
  }
}
const loadDashboardData = async () => {
  try {
    let res = await dashboardData()
    if (res.code === 0) {
      // cpu占用率
      
      cpuRate.value = Number.parseFloat((100-res.data.cpu.idle).toFixed(2))
      // 内存比率
      memRate.value = Number.parseFloat((res.data.mem.used / res.data.mem.total*100).toFixed(2)) 
      // 虚拟内存占用
      swapRate.value = Number.parseFloat((res.data.swap.used / res.data.swap.total*100).toFixed(2))
      //折线图和负载图共享x轴
      lineX.push(res.data.host.systime)
      loadMin1.push(res.data.load.min1)
      loadMin5.push(res.data.load.min5)
      loadMin15.push(res.data.load.min15)
      // 负载图数据
      res.data.net.forEach(v => {
        let name = v.interface_name
        let currentData = netData.find(v => v.name === name)
        if (currentData) {
          const tx = Number.parseFloat((v.tx/1024).toFixed(2))
          const rx=Number.parseFloat((v.rx/1024).toFixed(2))
          currentData.data.rx.push(rx)
          currentData.data.tx.push(tx)
        }
      });
      // 主机信息
      data.host = res.data.host
      data.host.os_version=res.data.host.os_version.replace(/\s+.*$/g,'')
      //虚拟内存
      data.swap = res.data.swap
      //磁盘信息
      data.disk=res.data.disk
    }
    else {
      message(res.msg)
    }
  }
  catch (err) {
    console.log(err)
  }
}
onMounted(async () => {
  loading.value = true
  await loadDashboardInfo()
  await loopGetData()
  loading.value=false
});

onUnmounted(() => {
  clearTimeout(timerId)
  timerId=undefined
  clearTimeout(refreshId)
  refreshId=undefined
});
</script>

<style lang="scss" scoped>
$backColor: #111;
$frontColor: #fff;
$spacing: 15px;
$radius:5px;
$titleSize:35px;
$bodySize:25px;
$descSize:15px;
// 16:9的比例
$widthRate:16px;
$heightRate:9px;
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
  .spacingBottom{
    margin-bottom: $spacing;
  }
  .xflex {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
  }
  .yflex{
    display: flex;
    flex-direction: column;
  }
  .tableHeader{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6,1fr);
    .colHeader{
      font-size: $bodySize;
    }
    
  }
  .table{
    align-self: stretch;
    width: 100%;
    height: 240px;
    flex-shrink: 0;
    flex-grow: 1;
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(6,1fr);
    &::-webkit-scrollbar{
      display: none;
    }
    .tableData{
      font-size: $descSize;
    }
  }
  .colHeader,.tableData{
    overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
  }
  .stretch{
    align-self: stretch;
    flex-grow: 1;
  }
  .contentBlock {
    padding: $spacing;
    box-shadow: 0 0 $radius $frontColor;
    &>.blockTitle{
      font-size: $titleSize;
    }
    &>.blockValue{
      font-size: $bodySize;
      margin-top: $spacing;
    }
  }
  .spacingRight {
    margin-right:$spacing ;
  }
  .GaugeChart {
    $rate:30;
    min-width: $widthRate  *  $rate;
    min-height: $heightRate * $rate;
  }
  #load{
    $rate:40;
    min-width: $widthRate  *  $rate;
    min-height: $heightRate * $rate;
  }
  #disk{
    $rate:40;
    min-width: $widthRate  *  $rate;
    min-height: $heightRate * $rate;
  }
  #netLoad{
    width: max-content;
    height: 100%;
  }
  #blockTabs{
    $rate:45;
    width: 100%;
    margin-top: $spacing;
    height: $heightRate * $rate;;
    .tabs{
      width: max-content;
      max-width: 400px;
      width: 100%;
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar{
        display: none;
      }
      .tab{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
        width: 100%;
        color: $frontColor;
        font-size: $bodySize;
        margin-bottom: $spacing;
        background-color: rgba($frontColor,0.15);
        padding: $spacing;
        border-radius: $radius;
        &:hover{
          background-color: rgba($frontColor,0.10);
        }
      }
      .active{
        background-color: rgba($frontColor,0.10);
      }
    }
  }
}
</style>
