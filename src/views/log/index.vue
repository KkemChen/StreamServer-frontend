<script setup>
import { ref, onMounted } from "vue";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "xterm-addon-fit"; // 取消这行的注释
import "@xterm/xterm/css/xterm.css";

const fitAddon = new FitAddon(); // 创建 FitAddon 实例

const defaultTheme = {
  foreground: "#1c1c1c", // 字体
  background: "#d2e2fc", // 背景色
  cursor: "#ffffff", // 设置光标
  selection: "rgba(235, 235, 235, 0.3)",
  black: "#000000",
  brightBlack: "#808080",
  red: "#ce2f2b",
  brightRed: "#f44a47",
  green: "#00b976",
  brightGreen: "#05d289",
  yellow: "#e0d500",
  brightYellow: "#f4f628",
  magenta: "#bd37bc",
  brightMagenta: "#d86cd8",
  blue: "#1d6fca",
  brightBlue: "#358bed",
  cyan: "#00a8cf",
  brightCyan: "#19b8dd",
  white: "#e5e5e5",
  brightWhite: "#ffffff"
};

const term = new Terminal({
  theme: defaultTheme
});
onMounted(() => {
  const container = document.getElementById("xterm-container");
  term.loadAddon(fitAddon); // 加载 FitAddon
  term.open(container);
  fitAddon.fit(); // 自动调整大小以适应容器

  // 随机生成日志
  const generateLog = () => {
    const log = `Log ${Math.random()}`;
    term.writeln(log);
  };

  // 每秒生成一条随机日志
  setInterval(generateLog, 1000);
});
</script>

<template>
  <div>
    <div id="xterm-container" style="width: 100%; height: 100%"></div>
  </div>
</template>

<style>
/* 确保 #xterm-container 元素满屏 */
#xterm-container {
  width: 100%;
  height: 100vh;
}
</style>
