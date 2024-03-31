<script setup lang="ts">
import { ref, watchEffect } from "vue";
// https://plus-pro-components.com/components/drawer-form.html
import "plus-pro-components/es/components/drawer-form/style/css";
import {
  type PlusColumn,
  type FieldValues,
  PlusDrawerForm
} from "plus-pro-components";
import { watch } from "fs";
import { log } from "console";

const columns: PlusColumn[] = [
  {
    label: "名称",
    width: 120,
    prop: "name",
    valueType: "copy",
    tooltip: "名称最多显示6个字符"
  },
  {
    label: "状态",
    width: 120,
    prop: "status",
    valueType: "select",
    options: [
      {
        label: "未解决",
        value: "0",
        color: "red"
      },
      {
        label: "已解决",
        value: "1",
        color: "blue"
      },
      {
        label: "解决中",
        value: "2",
        color: "yellow"
      },
      {
        label: "失败",
        value: "3",
        color: "red"
      }
    ]
  },
  {
    label: "是否显示",
    width: 100,
    prop: "switch",
    valueType: "switch"
  }
];

const props = defineProps<{
  visible: boolean;
}>();

// const visible = ref(true);
const values = ref<FieldValues>({});

let visible = ref(props.visible);

watchEffect(() => {
  visible.value = props.visible;
  console.log(`p: `, props.visible, visible.value);
});
// const visible = ref(true)
const handleOpen = () => {
  // props.visible = true;
};
</script>

<template>
  <div>
    <!-- <el-button @click="handleOpen">打开抽屉表单</el-button> -->
    <!-- <PlusDrawerForm
      v-model:visible="props.visible"
      v-model="values"
      :form="{ columns }"
    /> -->




    
  </div>
</template>
