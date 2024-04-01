<script setup lang="ts">
import { reactive, watch } from "vue";
import "vue-json-pretty/lib/styles.css";
import VueJsonPretty from "vue-json-pretty";

defineOptions({
  name: "JsonEditor"
});

const defaultData = {
  msg: "set_stream_source_info",
  video_source_info: [
    {
      urlorfile: "rtsp://192.168.1.82/live/66",
      vendor: 1,
      ip: "192.168.1.66",
      camera_id: "test",
      name: "测试",
      dev_type: 1,
      stream_mode: 0
    },
    {
      urlorfile: "rtsp://192.168.1.82/live/66",
      vendor: 1,
      ip: "192.168.1.66",
      camera_id: "test",
      name: "测试",
      dev_type: 1,
      stream_mode: 0
    },
    {
      urlorfile: "rtsp://192.168.1.82/live/66",
      vendor: 1,
      ip: "192.168.1.66",
      camera_id: "test",
      name: "测试",
      dev_type: 1,
      stream_mode: 0
    },
    {
      urlorfile: "rtsp://192.168.1.82/live/66",
      vendor: 1,
      ip: "192.168.1.66",
      camera_id: "test",
      name: "测试",
      dev_type: 1,
      stream_mode: 0
    },
    {
      urlorfile: "rtsp://192.168.1.82/live/66",
      vendor: 1,
      ip: "192.168.1.66",
      camera_id: "test",
      name: "测试",
      dev_type: 1,
      stream_mode: 0
    },
    {
      urlorfile: "rtsp://192.168.1.82/live/66",
      vendor: 1,
      ip: "192.168.1.66",
      camera_id: "test",
      name: "测试",
      dev_type: 1,
      stream_mode: 0
    },
    {
      urlorfile: "rtsp://192.168.1.82/live/66",
      vendor: 1,
      ip: "192.168.1.66",
      camera_id: "test",
      name: "测试",
      dev_type: 1,
      stream_mode: 0
    },
    {
      urlorfile: "rtsp://192.168.1.82/live/66",
      vendor: 1,
      ip: "192.168.1.66",
      camera_id: "test",
      name: "测试",
      dev_type: 1,
      stream_mode: 0
    },
    {
      urlorfile: "rtsp://192.168.1.82/live/66",
      vendor: 1,
      ip: "192.168.1.66",
      camera_id: "test",
      name: "测试",
      dev_type: 1,
      stream_mode: 0
    }
  ]
};

const state = reactive({
  val: JSON.stringify(defaultData),
  data: defaultData,
  showLine: true,
  showLineNumber: true,
  showDoubleQuotes: true,
  showLength: true,
  editable: true,
  showIcon: true,
  editableTrigger: "click",
  deep: 3
});

watch(
  () => state.val,
  newVal => {
    try {
      state.data = JSON.parse(newVal);
    } catch (err) {
      // console.log('JSON ERROR');
    }
  }
);

watch(
  () => state.data,
  newVal => {
    try {
      state.val = JSON.stringify(newVal);
    } catch (err) {
      // console.log('JSON ERROR');
    }
  }
);
</script>

<template>
  <el-card shadow="never" class="json-pretty-card">
    <vue-json-pretty
      v-model:data="state.data"
      :deep="state.deep"
      :show-double-quotes="state.showDoubleQuotes"
      :show-line="state.showLine"
      :show-length="state.showLength"
      :show-icon="state.showIcon"
      :show-line-number="state.showLineNumber"
      :editable="state.editable"
      :editable-trigger="state.editableTrigger as any"
    />
  </el-card>
</template>

<style scope>
.json-pretty-card {
  max-height: 300px; /* 设置你希望的最大高度 */
  overflow-y: auto; /* 当内容超出高度时显示滚动条 */
  margin-bottom: 10px;
  margin-left: 10px;
}
</style>
