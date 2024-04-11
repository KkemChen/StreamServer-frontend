<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "xterm-addon-fit"; // 取消这行的注释
import "@xterm/xterm/css/xterm.css";

const logLevelColors = {
  INFO: "\x1b[32m", // 绿色
  TRACE: "\x1b[34m", // 蓝色
  DEBUG: "\x1b[36m", // 青色
  WARN: "\x1b[33m", // 黄色
  ERROR: "\x1b[31m", // 红色
  FATAL: "\x1b[35m" // 明亮红色
};

function colorizeLog(log) {
  // 使用正则表达式从日志中提取日志级别
  const logLevelMatch = log.match(/\[(INFO|TRACE|DEBUG|WARN|ERROR|FATAL)\]/);
  if (logLevelMatch) {
    const logLevel = logLevelMatch[1];
    // 获取对应日志级别的颜色代码
    const colorCode = logLevelColors[logLevel] || "";
    // 将颜色代码应用到整条日志上，并在末尾重置颜色
    return `${colorCode}${log}\x1b[0m`;
  }
  return log; // 如果没有匹配到日志级别，返回原始日志
}

const defaultTheme = {
  foreground: "#ffffff", // 字体
  background: "#010101", // 背景色
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
  cursorStyle: "bar", // 光标样式：'block', 'underline', 'bar'
  cursorBlink: true, // 光标闪烁
  cursorWidth: 2, // 光标宽度（仅在'bar'样式下有效）
  // readOnly: true,
  fontFamily: '"Cascadia Code"',
  cols: 120,
  scrollback: 50000,
  theme: defaultTheme
  // disableStdin: true
});

let ws;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5; // 最大重连尝试次数

const connectWebSocket = () => {
  ws = new WebSocket(
    `ws://${import.meta.env.VITE_APP_BASE_IP ? import.meta.env.VITE_APP_BASE_IP : window.location.hostname}:8088/ws/log`
  );
};

onMounted(() => {
  const fitAddon = new FitAddon(); // 创建 FitAddon 实例
  const container = document.getElementById("xterm-container");
  // term.setOption('scrollbarHidden',true)
  term.loadAddon(fitAddon); // 加载 FitAddon
  term.open(container);
  fitAddon.fit(); // 自动调整大小以适应容器

  connectWebSocket();
  ws.onopen = () => {
    console.log("WebSocket connection success");
    term.writeln(
      `============================================================================`
    );
    term.writeln("\x1b[32m[Xterm]: StreamServer connect success!\x1b[0m");
    term.writeln(
      `============================================================================\n`
    );
    reconnectAttempts = 0; // 重置重连尝试次数
  };

  ws.onerror = event => {
    console.log("WebSocket connection error", event);
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(connectWebSocket, 5000 * reconnectAttempts); // 使用指数回退策略增加重连延迟
      reconnectAttempts++;
    } else {
      console.error("WebSocket connection failed after maximum attempts.");
    }
  };

  ws.onmessage = event => {
    let log = event.data.replace(/\n$/, "");
    const colorizedLog = colorizeLog(log);
    term.writeln(colorizedLog);
  };

  // ws.onclose = event => {
  //   console.log("WebSocket connection closed", event);
  //   // 可选：在这里处理非正常关闭情况下的重连逻辑
  //   if (!event.wasClean && reconnectAttempts < maxReconnectAttempts) {
  //     setTimeout(connectWebSocket, 5000 * reconnectAttempts); // 使用指数回退策略增加重连延迟
  //     reconnectAttempts++;
  //   }
  // };
});

onBeforeUnmount(() => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    // 使用状态码 1000（正常关闭）和一个原因
    ws.close();
  }
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

#xterm-container {
  position: absolute;
  top: 80px;
  left: 100px;
  width: calc(100% - 100px - 100px);
  height: calc(100% - 60px - 80px);
  z-index: 5; /* 确保它在.glitch之上 */
  /* padding-left: 100px; */
  :deep(.xterm-viewport) {
    overflow: hidden !important;
  }
}

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
  background-color: #010101;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
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
  pointer-events: none;
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
