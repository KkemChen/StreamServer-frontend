<script setup>
import { ref, computed, onMounted } from "vue";
// import "@/webrtc/ZLMRTCClient.js";
// import { Endpoint, Events, GetAllScanResolution } from "@/lib/zlmwebrtc/export.js";
import { Endpoint, Events, GetAllScanResolution } from "zlmwebrtc";
// const ZLMRTCClient = require('@/webrtc/ZLMRTCClient.js');

const rows = ref(4);
const cols = ref(4);
const gap = ref(2);

const totalCells = computed(() => rows.value * cols.value);

const gridStyle = computed(() => ({
  display: "grid",
  gridTemplateRows: `repeat(${rows.value}, 1fr)`,
  gridTemplateColumns: `repeat(${cols.value}, 1fr)`,
  gap: `${gap.value}px`
}));

const w = 1280;
const h = 720;

// const streamUrl = `https://192.168.1.172/index/api/webrtc?app=live&stream=test1&type=play`

const play = () => {
  for (let i = 1; i <= rows.value * cols.value; i++) {
    const playerId = "test" + i;
    let streamUrl = `http://192.168.1.172:8088/webrtc/play?app=live&stream=${i}`;
    const player = new Endpoint({
      element: document.getElementById(playerId), // video 标签
      debug: true, // 是否打印日志
      zlmsdpUrl: streamUrl, //流地址
      simulcast: false,
      useCamera: false,
      audioEnable: false,
      videoEnable: true,
      recvOnly: true,
      resolution: { w, h },
      usedatachannel: 0
    });

    player.on(Events.WEBRTC_ON_CONNECTION_STATE_CHANGE, function (state) {
      console.log("当前状态==>", state);
    });
  }
};
</script>

<template>
  <div>
    <el-row :gutter="20" class="toolbar">
      <el-col :span="6">
        <label>行数: </label>
        <el-input v-model="rows" type="number" style="width: 20%" min="1" />
      </el-col>
      <el-col :span="6">
        <label>列数: </label>
        <el-input v-model="cols" type="number" style="width: 20%" min="1" />
      </el-col>
      <el-col :span="6">
        <label>间距(px): </label>
        <el-input v-model="gap" type="number" style="width: 20%" min="0" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="play">播放</el-button>
      </el-col>
    </el-row>

    <div class="video-grid" :style="gridStyle">
      <div v-for="n in totalCells" :key="n" class="video-cell">
        <video :id="'test' + n" autoplay muted />
      </div>
    </div>
  </div>
</template>

<style scoped>
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(0, 1fr));
  width: 100%;
  height: 80vh; /* 根据需要调整 */
  grid-auto-rows: calc(80vh / var(--rows)); /* 设定每个单元格的高度 */
}

.video-cell {
  width: 100%;
  height: 100%;
  background-color: aquamarine;
  overflow: hidden;
}

video {
  width: 100%; /* 确保视频填满单元格宽度 */
  max-height: 100%; /* 限制视频的最大高度，避免撑开容器 */
  object-fit: fill; /* 视频内容裁剪以填充容器 */
}

.toolbar {
  margin-bottom: 20px;
}
</style>
