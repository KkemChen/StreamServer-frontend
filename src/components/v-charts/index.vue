<template>
  <component :is="typeComponentMap[type]" :height="height" :option="option" :dataZoom="dataZoom" class="v-charts" />
</template>
<script lang="ts" setup>
// import line from './components/Line.vue';
import pie from './components/Pie.vue';
defineOptions({ name: 'VCharts' });
defineProps({
  type: {
    type: String,
    default: 'pie',
  },
  height: {
    type: String,
    default: '100%',
  },
  dataZoom: Boolean,
  option: {
    type: Object,
    required: false,
  }, // { title , xDatas, yDatas, formatStr  }
});

const typeComponentMap = { pie };
</script>
