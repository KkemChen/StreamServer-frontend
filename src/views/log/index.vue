<script setup>
import { ref, onMounted } from "vue";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "xterm-addon-fit"; // 取消这行的注释
import "@xterm/xterm/css/xterm.css";

const fitAddon = new FitAddon(); // 创建 FitAddon 实例

const defaultTheme = {
  foreground: "#ffffff", // 字体
  background: "#000000", // 背景色
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
    const log = `[2024-04-10 17:13:32.060] [INFO] |15917|: Log ${Math.random()} ${Math.random()} ${Math.random()}`;
    term.writeln(log);
  };

  // 每秒生成一条随机日志
  setInterval(generateLog, 100);
});
</script>

<template>
  <div class="wrapper">
    <div class="glitch" data-text="Glitch!"></div>
    <div class="black-overlay"></div>
    <div id="xterm-container"></div>
  </div>
</template>

<style scoped>
/* 确保 #xterm-container 元素满屏 */
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 !important;
}

.black-overlay {
  position: fixed;
  top: 0;
  left: 0;
  background-color: black;
  width: 100%;
  height: 100%;
  z-index: 1;
}

#xterm-container {
  position: absolute;
  top: 80px;
  left: 100px;
  width: 100%;
  height: calc(100% - 60px - 40px);
  z-index: 5; /* 确保它在.glitch之上 */
  /* padding-left: 100px; */
}

.glitch {
  position: relative;
  color: white;
  /* opacity: 0.5; */
  /* background-color: #1a1a1a; */
  font-size: 2em;
  width: 100%; /* 图片的宽度 */
  height: 100%; /* 图片的高度 */
  background-image: url("@/assets/logBk.png");
  background-size: 100% 100%;
  /* background-size: 100% auto; */
  overflow: hidden;
  margin: 0px !important;
  z-index: 10;
}

.glitch::before,
.glitch::after {
  content: "";
  position: absolute;
  top: 0;
  left: -50px;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/line3.png");
  background-size: cover;
}

.glitch::before {
  opacity: 0.01;
  background-position: 2px 0;
  animation: glitch-anim s infinite linear alternate-reverse;
}

.glitch::after {
  opacity: 0.01;
  background-position: -2px 0;
  animation: glitch-anim2 2s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% {
    opacity: 1;
    transform: translate3d(var(--gap-horizontal), 0, 0);
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
  }
  2% {
    clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
  }
  4% {
    clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
  }
  6% {
    clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
  }
  8% {
    clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
  }
  10% {
    clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
  }
  12% {
    clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
  }
  14% {
    clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
  }
  16% {
    clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
  }
  18% {
    clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
  }
  20% {
    clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
  }
  21.9% {
    opacity: 1;
    transform: translate3d(var(--gap-horizontal), 0, 0);
  }
  22%,
  100% {
    opacity: 0;
    transform: translate3d(0, 0, 0);
    clip-path: polygon(0 0, 0 0, 0 0, 0 0);
  }
}

@keyframes glitch-anim2 {
  0% {
    opacity: 1;
    transform: translate3d(var(--gap-horizontal), 0, 0);
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
  }
  2% {
    clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
  }
  4% {
    clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
  }
  6% {
    clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
  }
  8% {
    clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
  }
  10% {
    clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
  }
  12% {
    clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
  }
  14% {
    clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
  }
  16% {
    clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
  }
  18% {
    clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
  }
  20% {
    clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
  }
  21.9% {
    opacity: 1;
    transform: translate3d(var(--gap-horizontal), 0, 0);
  }
  22%,
  100% {
    opacity: 0;
    transform: translate3d(0, 0, 0);
    clip-path: polygon(0 0, 0 0, 0 0, 0 0);
  }
}
</style>
