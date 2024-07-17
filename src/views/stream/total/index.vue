<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
// import tree from "./tree.vue";
import { useUser } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

// import Upload from "@iconify-icons/ri/upload-line";
// import Role from "@iconify-icons/ri/admin-line";
// import Password from "@iconify-icons/ri/lock-password-line";
// import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Play from "@iconify-icons/ri/play-circle-line";
import Info from "@iconify-icons/ri/information-line";
import * as Elicon from "@element-plus/icons-vue";

// import flvjs from "flv.js";
import mpegts from "mpegts.js";
import DPlayer from "dplayer";
import PureTable from "@pureadmin/table";

defineOptions({
  name: "SystemUser"
});

const treeRef = ref();
const formRef = ref();
const tableRef = ref();

const {
  streamTypes,
  vendorImages,
  downloadData,
  form,
  detailVisible,
  detailInfo,
  loading,
  columns,
  dataList,
  // treeData,
  // treeLoading,
  selectedNum,
  pagination,
  // buttonClass,
  deviceDetection,
  fetchAll,
  sortChange,
  onSearch,
  resetForm,
  onbatchDel,
  openDialog,
  // onTreeSelect,
  // handleUpdate,
  handleDelete,
  downloadTemplate,
  selectFile,
  // handleUpload,
  // handleReset,
  // handleRole,
  onSelectionCancel,
  handleSelectionChange,
  uploadLoading,
  checkedFileds,
  exportFiledsDialog,
  exportFileds,
  handleOpenDetail
} = useUser(tableRef, treeRef);

const playDialogVisible = ref(false);
const videoUrl = ref("");
let dp = null;
let flvPlayer = null;
const setLiveDotColor = color => {
  if (color == "#b7daff") {
  }
  const liveDot = document.querySelector(".dplayer-live-dot");
  if (liveDot) {
    liveDot.style.background = color;
  }
};

function initPlayer(hasAudio) {
  flvPlayer = mpegts.createPlayer({
    type: "flv",
    url: videoUrl.value,
    hasAudio: hasAudio
  });

  dp = new DPlayer({
    container: document.getElementById("dplayer"),
    live: true,
    screenshot: true,
    video: {
      url: videoUrl.value,
      type: "customFlv",
      customType: {
        customFlv: (video, player) => {
          flvPlayer.attachMediaElement(video);
          flvPlayer.load();
        }
      }
    }
  });

  dp.on("pause", () => setLiveDotColor("#b7daff"));

  dp.on("loadeddata", function () {
    // 获取 .dplayer-live-dot 元素
    const live = document.querySelector(".dplayer-live-badge");
    // 检查元素是否存在
    if (live) {
      // 添加点击事件监听器
      live.style.cursor = "pointer"; // 添加鼠标指针样式
      live.addEventListener("click", function () {
        // 停止当前流并重新加载视频
        // dp.pause();
        flvPlayer.unload();
        flvPlayer.load();
        flvPlayer.play();
        setTimeout(() => {
          setLiveDotColor("#ff0000");
        }, 0);
      });
    }
  });
  setLiveDotColor("#ff0000");
  dp.play();
}

function checkAudioFormat() {
  flvPlayer.on(mpegts.Events.METADATA_ARRIVED, function (event) {
    const audioCodecid = event.audiocodecid;
    // console.log("Audio codec:", audioCodecid);
    // 10: AAC; 7: MP3 G711;
    if (!audioCodecid || audioCodecid != 10) {
      flvPlayer.destroy();
      dp.destroy();
      initPlayer(false);
    }
  });
}

watch(playDialogVisible, newVal => {
  if (newVal) {
    nextTick().then(() => {
      // 对话框显示，初始化DPlayer
      initPlayer(true);
      checkAudioFormat();
    });
  } else {
    // 对话框隐藏，销毁DPlayer实例
    if (dp) {
      dp.destroy(); // 销毁DPlayer实例
      dp = null; // 重置dp变量
      if (flvPlayer) {
        flvPlayer.destroy();
        flvPlayer = null;
      }
    }
  }
});

const play = (id: String) => {
  videoUrl.value = `http://${import.meta.env.VITE_APP_BASE_IP ? import.meta.env.VITE_APP_BASE_IP : window.location.hostname}:8096/live/${id}.live.flv`;
  playDialogVisible.value = true;
};

// onMounted(() => {
//   const dp = new DPlayer({
//     container: document.getElementById("dplayer"),
//     video: {
//       url: "demo.mp4"
//     }
//   });
// });
</script>

<template>
  <div :class="['flex', 'justify-between', deviceDetection() && 'flex-wrap']">
    <!-- <tree
      ref="treeRef"
      :class="['mr-2', deviceDetection() ? 'w-full' : 'min-w-[200px]']"
      :treeData="treeData"
      :treeLoading="treeLoading"
      @tree-select="onTreeSelect"
    /> -->
    <div :class="[deviceDetection() ? ['w-full', 'mt-2'] : 'w-[calc(100%)]']">
      <el-form
        ref="formRef"
        :inline="true"
        :model="form"
        class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
      >
        <el-form-item label="视频流名称" prop="name">
          <el-input
            v-model="form.name"
            class="!w-[180px]"
            clearable
            placeholder="请输入视频流名称"
            @clear="onSearch(form)"
            @keyup.enter="onSearch(form)"
          />
        </el-form-item>
        <el-form-item label="视频流ID" prop="id">
          <el-input
            v-model="form.id"
            class="!w-[180px]"
            clearable
            placeholder="请输入视频流ID"
            @clear="onSearch(form)"
            @keyup.enter="onSearch(form)"
          />
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input
            v-model="form.ip"
            class="!w-[180px]"
            clearable
            placeholder="请输入IP地址"
            @clear="onSearch(form)"
            @keyup.enter="onSearch(form)"
          />
        </el-form-item>
        <el-form-item label="设备产商" prop="vendor">
          <el-select
            v-model="form.vendor"
            class="!w-[180px]"
            clearable
            placeholder="请选择设备产商"
            @change="onSearch(form)"
            @clear="onSearch(form)"
          >
            <el-option
              v-for="(item, index) in vendorImages"
              :key="index"
              :label="item.name"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="码流类型" prop="streamType">
          <el-select
            v-model="form.streamType"
            class="!w-[180px]"
            clearable
            placeholder="请选码流类型"
            @change="onSearch(form)"
            @clear="onSearch(form)"
          >
            <el-option
              v-for="(item, index) in streamTypes"
              :key="index"
              :label="item"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            :icon="useRenderIcon('ri:search-line')"
            :loading="loading"
            type="primary"
            @click="onSearch(form)"
          >
            搜索
          </el-button>
          <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>

      <PureTableBar
        :columns="columns"
        title="ivss_stream_info"
        @refresh="fetchAll"
      >
        <template #buttons>
          <el-button
            :icon="Elicon.Download"
            type="primary"
            @click="downloadTemplate()"
          >
            下载导入模板
          </el-button>
          <el-button
            :disabled="uploadLoading"
            :icon="Elicon.Upload"
            :loading="uploadLoading"
            type="primary"
            @click="selectFile()"
          >
            批量导入
          </el-button>
          <el-button
            :icon="Elicon.Download"
            type="primary"
            @click="exportFiledsDialog = true"
          >
            批量导出
          </el-button>
          <el-button
            :icon="useRenderIcon(AddFill)"
            type="primary"
            @click="openDialog()"
          >
            新增
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <div
            v-if="selectedNum > 0"
            v-motion-fade
            class="bg-[var(--el-fill-color-light)] w-full h-[46px] mb-2 pl-4 flex items-center"
          >
            <div class="flex-auto">
              <span
                class="text-[rgba(42,46,54,0.5)] dark:text-[rgba(220,220,242,0.5)]"
                style="font-size: var(--el-font-size-base)"
              >
                已选 {{ selectedNum }} 项
              </span>
              <el-button text type="primary" @click="onSelectionCancel">
                取消选择
              </el-button>
            </div>
            <el-popconfirm title="是否确认删除?" @confirm="onbatchDel">
              <template #reference>
                <el-button class="mr-1" text type="danger">
                  批量删除
                </el-button>
              </template>
            </el-popconfirm>
          </div>
          <pure-table
            ref="tableRef"
            :adaptiveConfig="{ offsetBottom: 108 }"
            :columns="dynamicColumns"
            :data="dataList"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            :loading="loading"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            :size="size"
            adaptive
            align-whole="center"
            border
            row-key="id"
            table-layout="auto"
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
          >
            <template #operation="{ row }">
              <el-button
                :icon="useRenderIcon(Play)"
                :size="size"
                class="reset-margin"
                link
                type="primary"
                @click="play(row.id)"
              >
                预览
              </el-button>
              <el-button
                :icon="useRenderIcon(EditPen)"
                :size="size"
                class="reset-margin"
                link
                type="primary"
                @click="openDialog('修改', row)"
              >
                修改
              </el-button>
              <el-popconfirm
                :title="`是否确认删除用户编号为${row.id}的这条数据`"
                :width="200"
                class="thisismystyle"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button
                    :icon="useRenderIcon(Delete)"
                    :size="size"
                    class="reset-margin"
                    link
                    type="primary"
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
              <el-button
                :icon="useRenderIcon(Info)"
                :size="size"
                class="reset-margin"
                link
                type="primary"
                @click="handleOpenDetail(row)"
              >
                详情
              </el-button>

              <!-- <el-dropdown>
                <el-button
                  class="ml-3 mt-[2px]"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(More)"
                  @click="handleUpdate(row)"
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Upload)"
                        @click="handleUpload(row)"
                      >
                        上传头像
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Password)"
                        @click="handleReset(row)"
                      >
                        重置密码
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        :class="buttonClass"
                        link
                        type="primary"
                        :size="size"
                        :icon="useRenderIcon(Role)"
                        @click="handleRole(row)"
                      >
                        分配角色
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown> -->
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <!-- <Detail :visible="detailVisible" /> -->
    <el-drawer v-model="detailVisible" size="50%" title="详情">
      <template #header>
        <h3>详情</h3>
      </template>
      <div>
        <el-descriptions :column="1" border class="h-systemInfo">
          <el-descriptions-item
            v-for="item in detailInfo"
            :key="item.value"
            class-name="system-content"
          >
            <template #label label-align="center">
              <span class="system-label">
                {{ item.label }}
              </span>
            </template>
            {{ item.value }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>

    <el-dialog
      id="player-dialog"
      v-model="playDialogVisible"
      :show-close="false"
      title=""
    >
      <div id="dplayer" />
    </el-dialog>
    <!-- 选择需要导出的字段 -->
    <el-dialog
      id="player-dialog"
      v-model="exportFiledsDialog"
      :show-close="true"
    >
      <template #header>
        <div class="dialogTitle">请选择需要导出的字段</div>
      </template>
      <div class="selectBody">
        <el-checkbox-group v-model="checkedFileds">
          <el-checkbox
            v-for="item in exportFileds"
            :key="item.prop"
            :disabled="!item.disabled"
            :label="item.label"
            :value="item.prop"
          />
        </el-checkbox-group>
        <el-button size="large" type="primary" @click="downloadData()"
          >开始导出
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.dialogTitle {
  padding: 15px;
  font-size: 15px;
  color: #1f2329;
  box-sizing: border-box;
}

.selectBody {
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  padding: 15px;
}

:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.h-systemInfo {
  margin-left: 18px;
  height: 216px;
}

@-moz-document url-prefix() {
  .h-systemInfo {
    height: auto;
  }
}

.system-label {
  font-weight: 400 !important;
  font-size: 14px !important;
  color: #1f2329;
  // text-align: right;
  // display: inline-block; /* 使宽度设置生效 */
  // width: 50px; /* 例如，设定一个固定的宽度 */
}

.system-content {
  font-size: 14px !important;
}

:deep(#player-dialog) {
  max-width: 50%;
  width: 45%;
  padding: 0;

  .el-dialog__header {
    padding: 0;
  }

  // #player {
  //   max-width: 100%;
  //   width: 100%;
  // }
}
</style>
