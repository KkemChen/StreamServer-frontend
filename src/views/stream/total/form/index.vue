<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../hooks";
import JsonView from "../jsonView/index.vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: "",
    /** 用于判断是`新增`还是`修改` */
    title: "",
    higherDeptOptions: [],
    name: "",
    streamMode: 0,
    vendor: 0,
    ip: "",
    url: "",
    status: 0,
    remark: ""
  })
});

const vendorOptions = [
  {
    value: 1,
    label: "海康"
  },
  {
    value: 2,
    label: "大华"
  },
  {
    value: 3,
    label: "宇视"
  },
  {
    value: 4,
    label: "天地伟业"
  },
  {
    value: 0,
    label: "其他"
  }
];

const streamModeOptions = [
  {
    value: 0,
    label: "DirectProxy"
  },
  {
    value: 1,
    label: "SPCC"
  },
  {
    value: 2,
    label: "FFmpegCli"
  }
];

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

const getLabel = vendorValue => {
  const option = vendorOptions.find(option => option.value === vendorValue);
  if (option) {
    return option.label;
  } else {
    // 如果未找到，找value为0的项的label
    const defaultOption = vendorOptions.find(option => option.value === 0);
    return defaultOption ? defaultOption.label : "未知"; // 如果连value为0的项都没有，返回'未知'
  }
};

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="id" prop="id">
          <el-input
            v-model="newFormInline.id"
            clearable
            placeholder="请输入视频流ID"
            :disabled="newFormInline.title === '修改'"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入视频流昵称"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="IP地址" prop="ip">
          <el-input
            v-model="newFormInline.ip"
            clearable
            placeholder="请输入ip地址"
          />
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="设备厂商">
          <el-select
            v-model="newFormInline.vendor"
            placeholder="请选择设备厂商"
            class="w-full"
          >
            <el-option
              v-for="(item, index) in vendorOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="取流模式">
          <el-select
            v-model="newFormInline.streamMode"
            placeholder="请选择取流模式"
            class="w-full"
          >
            <el-option
              v-for="(item, index) in streamModeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="url" prop="url">
          <el-input
            v-model="newFormInline.url"
            clearable
            placeholder="请输入取流地址"
          />
        </el-form-item>
      </re-col>
      <!-- <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户性别">
          <el-select
            v-model="newFormInline.sex"
            placeholder="请选择用户性别"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in sexOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </re-col> -->

      <!-- <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="归属部门">
          <el-cascader
            v-model="newFormInline.parentId"
            class="w-full"
            :options="newFormInline.higherDeptOptions"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择归属部门"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <re-col
        v-if="newFormInline.title === '新增'"
        :value="12"
        :xs="24"
        :sm="24"
      >
        <el-form-item label="用户状态">
          <el-switch
            v-model="newFormInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col> -->

      <re-col>
        <JsonView />
        <!-- <el-form-item label="备注">
          <el-input
            v-model="newFormInline.remark"
            placeholder="请输入备注信息"
            type="textarea"
          />
        </el-form-item> -->
      </re-col>
    </el-row>
  </el-form>
</template>
