<script setup>
import { ref, computed, onMounted } from "vue";
// import "@/webrtc/ZLMRTCClient.js";
// import { Endpoint, Events, GetAllScanResolution } from "@/lib/zlmwebrtc/export.js";
// import { Endpoint, Events, GetAllScanResolution } from "zlmwebrtc";
// const ZLMRTCClient = require('@/webrtc/ZLMRTCClient.js');
import mpegts from "mpegts.js";
import DPlayer from "dplayer";

const rows = ref(6);
const cols = ref(6);
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
// http://172.31.60.105:8096/live/1.live.flv
const play = () => {
  for (let i = 1; i <= rows.value * cols.value; i++) {
    const playerId = "test" + i;
    const streamUrl = `ws://192.168.1.172:8096/live/${i}.live.flv`;

    // 创建视频容器
    const container = document.getElementById(playerId);
    if (!container) {
      console.error(`Element with id ${playerId} not found`);
      continue;
    }

    // 初始化 DPlayer
    new DPlayer({
      container: container,
      autoplay: true,
      preload: "auto",
      mutex: false,
      video: {
        url: streamUrl,
        type: "customFlv",
        customType: {
          customFlv: function (video) {
            const flvPlayer = mpegts.createPlayer({
              type: "flv",
              url: video.src,
              isLive: true,
              hasAudio: false
            });
            flvPlayer.attachMediaElement(video);
            flvPlayer.load();
          }
        }
      }
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
        <div :id="'test' + n" autoplay muted />
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
