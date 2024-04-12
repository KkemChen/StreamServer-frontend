<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "xterm-addon-fit"; // 取消这行的注释
import "@xterm/xterm/css/xterm.css";

import Solar from "./solar.vue";

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
  background: "rgba(0, 0, 0, 0.0)", // 背景色
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
  fontFamily: '"Courier New"',
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
const asciiArt = [
  "\x1b[1m\x1b[5m\x1b[93m",
  "============================================================================",
  " _____ _                            _____                          ",
  "/  ___| |                          /  ___|                         ",
  "\\ `--.| |_ _ __ ___  __ _ _ __ ___ \\ `--.  ___ _ ____   _____ _ __ ",
  " `--. \\ __| '__/ _ \\/ _` | '_ ` _ \\ `--. \\/ _ \\ '__\\ \\ / / _ \\ '__|",
  "/\\__/ / |_| | |  __/ (_| | | | | | /\\__/ /  __/ |   \\ V /  __/ |   ",
  "\\____/ \\__|_|  \\___|\\__,_|_| |_| |_\\____/ \\___|_|    \\_/ \\___|_|   ",
  "",
  "============================================================================",
  "\x1b[0m"
];

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

    asciiArt.forEach(line => {
      term.writeln(line); // 逐行输出
    });

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
    <Solar solarSystemClass="solar" />
    <div class="black-overlay"></div>
    <div id="xterm-container"></div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 !important;
  font:
    normal 1em/1.45em "Helvetica Neue",
    Helvetica,
    Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #fff;
  background: radial-gradient(
    ellipse 100% 100% at 70% 50%,
    #27384d 0%,
    #181c25 100%
  );
  background-attachment: fixed;
}

.black-overlay {
  width: 100%;
  height: 100%;
  content: "";
  position: absolute;
  height: 2px;
  width: 2px;
  top: -2px;
  background: white;
  box-shadow:
    1373px 74px 0 0px rgba(255, 255, 255, 0.252),
    98px 242px 0 0px rgba(255, 255, 255, 0.601),
    1309px 298px 0 0px rgba(255, 255, 255, 0.387),
    1438px 1787px 0 0px rgba(255, 255, 255, 0.462),
    1468px 1682px 0 0px rgba(255, 255, 255, 0.004),
    1728px 1605px 0 0px rgba(255, 255, 255, 0.654),
    464px 1655px 0 0px rgba(255, 255, 255, 0.938),
    878px 906px 0 0px rgba(255, 255, 255, 0.731),
    1171px 678px 0 0px rgba(255, 255, 255, 0.509),
    679px 898px 0 0px rgba(255, 255, 255, 0.134),
    1336px 1403px 0 0px rgba(255, 255, 255, 0.954),
    388px 1689px 0 0px rgba(255, 255, 255, 0.848),
    779px 490px 0 0px rgba(255, 255, 255, 0.715),
    14px 617px 0 0px rgba(255, 255, 255, 0.081),
    464px 1317px 0 0px rgba(255, 255, 255, 0.765),
    499px 1731px 0 0px rgba(255, 255, 255, 0.543),
    109px 1272px 0 0px rgba(255, 255, 255, 0.585),
    864px 426px 0 0px rgba(255, 255, 255, 0.312),
    1456px 119px 0 0px rgba(255, 255, 255, 0.529),
    1191px 748px 0 0px rgba(255, 255, 255, 0.17),
    141px 870px 0 0px rgba(255, 255, 255, 0.762),
    509px 44px 0 0px rgba(255, 255, 255, 0.883),
    630px 1299px 0 0px rgba(255, 255, 255, 0.214),
    580px 677px 0 0px rgba(255, 255, 255, 0.174),
    367px 527px 0 0px rgba(255, 255, 255, 0.388),
    797px 411px 0 0px rgba(255, 255, 255, 0.761),
    1731px 1126px 0 0px rgba(255, 255, 255, 0.833),
    455px 1159px 0 0px rgba(255, 255, 255, 0.29),
    556px 454px 0 0px rgba(255, 255, 255, 0.538),
    236px 348px 0 0px rgba(255, 255, 255, 0.709),
    1016px 9px 0 0px rgba(255, 255, 255, 0.371),
    784px 1025px 0 0px rgba(255, 255, 255, 0.782),
    299px 1762px 0 0px rgba(255, 255, 255, 0.707),
    1750px 1789px 0 0px rgba(255, 255, 255, 0.773),
    249px 223px 0 0px rgba(255, 255, 255, 0.039),
    1135px 891px 0 0px rgba(255, 255, 255, 0.328),
    1619px 17px 0 0px rgba(255, 255, 255, 0.051),
    1213px 1167px 0 0px rgba(255, 255, 255, 0.898),
    1346px 658px 0 0px rgba(255, 255, 255, 0.819),
    656px 1105px 0 0px rgba(255, 255, 255, 0.572),
    120px 547px 0 0px rgba(255, 255, 255, 0.065),
    1196px 217px 0 0px rgba(255, 255, 255, 0.353),
    515px 1550px 0 0px rgba(255, 255, 255, 0.968),
    599px 29px 0 0px rgba(255, 255, 255, 0.1),
    724px 1084px 0 0px rgba(255, 255, 255, 0.169),
    1507px 1038px 0 0px rgba(255, 255, 255, 0.665),
    974px 506px 0 0px rgba(255, 255, 255, 0.15),
    1744px 1436px 0 0px rgba(255, 255, 255, 0.682),
    50px 1442px 0 0px rgba(255, 255, 255, 0.118),
    1301px 308px 0 0px rgba(255, 255, 255, 0.553),
    1321px 681px 0 0px rgba(255, 255, 255, 0.487),
    1657px 856px 0 0px rgba(255, 255, 255, 0.951),
    1395px 1671px 0 0px rgba(255, 255, 255, 0.458),
    666px 177px 0 0px rgba(255, 255, 255, 0.819),
    898px 1145px 0 0px rgba(255, 255, 255, 0.914),
    593px 1055px 0 0px rgba(255, 255, 255, 0.279),
    675px 788px 0 0px rgba(255, 255, 255, 0.738),
    481px 1521px 0 0px rgba(255, 255, 255, 0.776),
    25px 1163px 0 0px rgba(255, 255, 255, 0.196),
    212px 495px 0 0px rgba(255, 255, 255, 0.804),
    990px 1659px 0 0px rgba(255, 255, 255, 0.514),
    1363px 540px 0 0px rgba(255, 255, 255, 0.99),
    1557px 298px 0 0px rgba(255, 255, 255, 0.567),
    1390px 814px 0 0px rgba(255, 255, 255, 0.566),
    600px 912px 0 0px rgba(255, 255, 255, 0.197),
    543px 1030px 0 0px rgba(255, 255, 255, 0.613),
    1149px 694px 0 0px rgba(255, 255, 255, 0.843),
    137px 1387px 0 0px rgba(255, 255, 255, 0.227),
    640px 971px 0 0px rgba(255, 255, 255, 0.869),
    995px 1168px 0 0px rgba(255, 255, 255, 0.175),
    981px 432px 0 0px rgba(255, 255, 255, 0.472),
    882px 1586px 0 0px rgba(255, 255, 255, 0.204),
    693px 1045px 0 0px rgba(255, 255, 255, 0.619),
    415px 1345px 0 0px rgba(255, 255, 255, 0.187),
    1791px 720px 0 0px rgba(255, 255, 255, 0.146),
    637px 760px 0 0px rgba(255, 255, 255, 0.746),
    923px 1472px 0 0px rgba(255, 255, 255, 0.932),
    20px 1081px 0 0px rgba(255, 255, 255, 0.53),
    1285px 1788px 0 0px rgba(255, 255, 255, 0.84),
    470px 1025px 0 0px rgba(255, 255, 255, 0.23),
    900px 1568px 0 0px rgba(255, 255, 255, 0.741),
    1297px 504px 0 0px rgba(255, 255, 255, 0.327),
    84px 508px 0 0px rgba(255, 255, 255, 0.769),
    1192px 157px 0 0px rgba(255, 255, 255, 0.656),
    739px 620px 0 0px rgba(255, 255, 255, 0.81),
    619px 468px 0 0px rgba(255, 255, 255, 0.293),
    570px 616px 0 0px rgba(255, 255, 255, 0.091),
    1276px 800px 0 0px rgba(255, 255, 255, 0.306),
    1205px 277px 0 0px rgba(255, 255, 255, 0.61),
    674px 1054px 0 0px rgba(255, 255, 255, 0.631),
    1333px 1087px 0 0px rgba(255, 255, 255, 0.56),
    1725px 1469px 0 0px rgba(255, 255, 255, 0.71),
    666px 1224px 0 0px rgba(255, 255, 255, 0.88),
    1073px 1582px 0 0px rgba(255, 255, 255, 0.531),
    1693px 800px 0 0px rgba(255, 255, 255, 0.278),
    1768px 1467px 0 0px rgba(255, 255, 255, 0.555),
    398px 1393px 0 0px rgba(255, 255, 255, 0.744),
    188px 369px 0 0px rgba(255, 255, 255, 0.973),
    1436px 1291px 0 0px rgba(255, 255, 255, 0.768),
    1686px 379px 0 0px rgba(255, 255, 255, 0.755),
    22px 1185px 0 0px rgba(255, 255, 255, 0.015),
    974px 461px 0 0px rgba(255, 255, 255, 1),
    837px 452px 0 0px rgba(255, 255, 255, 0.968),
    1751px 564px 0 0px rgba(255, 255, 255, 0.332),
    1270px 1490px 0 0px rgba(255, 255, 255, 0.284),
    58px 1631px 0 0px rgba(255, 255, 255, 0.394),
    1395px 1243px 0 0px rgba(255, 255, 255, 0.405),
    1027px 1435px 0 0px rgba(255, 255, 255, 0.677),
    445px 874px 0 0px rgba(255, 255, 255, 0.298),
    246px 1157px 0 0px rgba(255, 255, 255, 0.018),
    144px 288px 0 0px rgba(255, 255, 255, 0.48),
    349px 400px 0 0px rgba(255, 255, 255, 0.88),
    1351px 383px 0 0px rgba(255, 255, 255, 0.375),
    782px 897px 0 0px rgba(255, 255, 255, 0.398),
    149px 1534px 0 0px rgba(255, 255, 255, 0.027),
    1563px 1281px 0 0px rgba(255, 255, 255, 0.371),
    1599px 1471px 0 0px rgba(255, 255, 255, 0.312),
    568px 1784px 0 0px rgba(255, 255, 255, 0.963),
    1081px 5px 0 0px rgba(255, 255, 255, 0.079),
    781px 1337px 0 0px rgba(255, 255, 255, 0.103),
    815px 6px 0 0px rgba(255, 255, 255, 0.698),
    1442px 1408px 0 0px rgba(255, 255, 255, 0.439),
    233px 209px 0 0px rgba(255, 255, 255, 0.431),
    728px 922px 0 0px rgba(255, 255, 255, 0.322),
    471px 1394px 0 0px rgba(255, 255, 255, 0.807),
    977px 45px 0 0px rgba(255, 255, 255, 0.576),
    1645px 340px 0 0px rgba(255, 255, 255, 0.525),
    894px 1234px 0 0px rgba(255, 255, 255, 0.283),
    440px 1143px 0 0px rgba(255, 255, 255, 0.543),
    753px 1556px 0 0px rgba(255, 255, 255, 0.396),
    1331px 75px 0 0px rgba(255, 255, 255, 0.295),
    1554px 794px 0 0px rgba(255, 255, 255, 0.604),
    722px 843px 0 0px rgba(255, 255, 255, 0.499),
    424px 1420px 0 0px rgba(255, 255, 255, 0.247),
    1772px 55px 0 0px rgba(255, 255, 255, 0.806),
    1336px 94px 0 0px rgba(255, 255, 255, 0.988),
    1444px 56px 0 0px rgba(255, 255, 255, 0.002),
    1404px 1405px 0 0px rgba(255, 255, 255, 0.928),
    290px 1797px 0 0px rgba(255, 255, 255, 0.886),
    1195px 815px 0 0px rgba(255, 255, 255, 0.236),
    1250px 831px 0 0px rgba(255, 255, 255, 0.262),
    1169px 604px 0 0px rgba(255, 255, 255, 0.072),
    1317px 814px 0 0px rgba(255, 255, 255, 0.83),
    1130px 511px 0 0px rgba(255, 255, 255, 0.805),
    957px 860px 0 0px rgba(255, 255, 255, 0.791),
    986px 1371px 0 0px rgba(255, 255, 255, 0.648),
    662px 1427px 0 0px rgba(255, 255, 255, 0.898),
    858px 933px 0 0px rgba(255, 255, 255, 0.661),
    717px 1193px 0 0px rgba(255, 255, 255, 0.611),
    879px 149px 0 0px rgba(255, 255, 255, 0.022),
    664px 911px 0 0px rgba(255, 255, 255, 0.416),
    593px 487px 0 0px rgba(255, 255, 255, 0.272),
    267px 904px 0 0px rgba(255, 255, 255, 0.687),
    1204px 1671px 0 0px rgba(255, 255, 255, 0.177),
    920px 1165px 0 0px rgba(255, 255, 255, 0.757),
    230px 1709px 0 0px rgba(255, 255, 255, 0.628),
    50px 776px 0 0px rgba(255, 255, 255, 0.734),
    596px 5px 0 0px rgba(255, 255, 255, 0.044),
    1472px 1032px 0 0px rgba(255, 255, 255, 0.19),
    1407px 1752px 0 0px rgba(255, 255, 255, 0.387),
    1192px 496px 0 0px rgba(255, 255, 255, 0.076),
    1117px 1102px 0 0px rgba(255, 255, 255, 0.998),
    683px 1052px 0 0px rgba(255, 255, 255, 0.947),
    833px 837px 0 0px rgba(255, 255, 255, 0.349),
    1486px 1241px 0 0px rgba(255, 255, 255, 0.04),
    11px 1681px 0 0px rgba(255, 255, 255, 0.124),
    923px 1040px 0 0px rgba(255, 255, 255, 0.822),
    1576px 357px 0 0px rgba(255, 255, 255, 0.004),
    1319px 159px 0 0px rgba(255, 255, 255, 0.878),
    275px 835px 0 0px rgba(255, 255, 255, 0.62),
    1000px 1384px 0 0px rgba(255, 255, 255, 0.666),
    1242px 1602px 0 0px rgba(255, 255, 255, 0.627),
    1054px 702px 0 0px rgba(255, 255, 255, 0.441),
    39px 310px 0 0px rgba(255, 255, 255, 0.549),
    1285px 236px 0 0px rgba(255, 255, 255, 0.503),
    676px 1030px 0 0px rgba(255, 255, 255, 0.55),
    38px 374px 0 0px rgba(255, 255, 255, 0.045),
    419px 1309px 0 0px rgba(255, 255, 255, 1),
    1016px 91px 0 0px rgba(255, 255, 255, 0.315),
    713px 1684px 0 0px rgba(255, 255, 255, 0.871),
    1668px 9px 0 0px rgba(255, 255, 255, 0.904),
    170px 1496px 0 0px rgba(255, 255, 255, 0.798),
    484px 1445px 0 0px rgba(255, 255, 255, 0.125),
    1620px 1699px 0 0px rgba(255, 255, 255, 0.683),
    836px 1561px 0 0px rgba(255, 255, 255, 0.28),
    1797px 739px 0 0px rgba(255, 255, 255, 0.929),
    1014px 848px 0 0px rgba(255, 255, 255, 0.589),
    936px 1610px 0 0px rgba(255, 255, 255, 0.097),
    108px 248px 0 0px rgba(255, 255, 255, 0.509),
    516px 854px 0 0px rgba(255, 255, 255, 0.5),
    180px 1613px 0 0px rgba(255, 255, 255, 0.515),
    552px 959px 0 0px rgba(255, 255, 255, 0.946),
    231px 436px 0 0px rgba(255, 255, 255, 0.025),
    1786px 92px 0 0px rgba(255, 255, 255, 0.995),
    1304px 113px 0 0px rgba(255, 255, 255, 0.2),
    1507px 711px 0 0px rgba(255, 255, 255, 0.122),
    403px 1332px 0 0px rgba(255, 255, 255, 0.772),
    837px 43px 0 0px rgba(255, 255, 255, 0.819),
    985px 1451px 0 0px rgba(255, 255, 255, 0.195),
    181px 435px 0 0px rgba(255, 255, 255, 0.789),
    1761px 1359px 0 0px rgba(255, 255, 255, 0.504),
    124px 100px 0 0px rgba(255, 255, 255, 0.117),
    1359px 567px 0 0px rgba(255, 255, 255, 0.885),
    420px 1109px 0 0px rgba(255, 255, 255, 0.95),
    25px 1146px 0 0px rgba(255, 255, 255, 0.555),
    1627px 1404px 0 0px rgba(255, 255, 255, 0.506),
    1098px 1359px 0 0px rgba(255, 255, 255, 0.461),
    1319px 304px 0 0px rgba(255, 255, 255, 0.006),
    941px 908px 0 0px rgba(255, 255, 255, 0.721),
    1365px 332px 0 0px rgba(255, 255, 255, 0.224),
    941px 1528px 0 0px rgba(255, 255, 255, 0.56),
    1797px 1511px 0 0px rgba(255, 255, 255, 0.451),
    965px 655px 0 0px rgba(255, 255, 255, 0.266),
    1797px 1267px 0 0px rgba(255, 255, 255, 0.775),
    680px 1102px 0 0px rgba(255, 255, 255, 0.063),
    200px 1025px 0 0px rgba(255, 255, 255, 0.098),
    1498px 1383px 0 0px rgba(255, 255, 255, 0.032),
    207px 1237px 0 0px rgba(255, 255, 255, 0.988),
    1176px 30px 0 0px rgba(255, 255, 255, 0.149),
    1670px 807px 0 0px rgba(255, 255, 255, 0.644),
    1194px 526px 0 0px rgba(255, 255, 255, 0.456),
    1622px 321px 0 0px rgba(255, 255, 255, 0.128),
    1309px 144px 0 0px rgba(255, 255, 255, 0.297),
    847px 222px 0 0px rgba(255, 255, 255, 0.175),
    574px 91px 0 0px rgba(255, 255, 255, 0.273),
    215px 293px 0 0px rgba(255, 255, 255, 0.258),
    1473px 385px 0 0px rgba(255, 255, 255, 0.73),
    1661px 742px 0 0px rgba(255, 255, 255, 0.329),
    1631px 183px 0 0px rgba(255, 255, 255, 0.216),
    220px 733px 0 0px rgba(255, 255, 255, 0.642),
    1279px 141px 0 0px rgba(255, 255, 255, 0.003),
    1528px 1231px 0 0px rgba(255, 255, 255, 0.044),
    805px 1561px 0 0px rgba(255, 255, 255, 0.221),
    992px 1592px 0 0px rgba(255, 255, 255, 0.402),
    272px 985px 0 0px rgba(255, 255, 255, 0.508),
    356px 1438px 0 0px rgba(255, 255, 255, 0.855),
    1730px 956px 0 0px rgba(255, 255, 255, 0.389),
    1730px 647px 0 0px rgba(255, 255, 255, 0.22),
    1753px 1725px 0 0px rgba(255, 255, 255, 0.705),
    1040px 182px 0 0px rgba(255, 255, 255, 0.503),
    1243px 294px 0 0px rgba(255, 255, 255, 0.497),
    1750px 463px 0 0px rgba(255, 255, 255, 0.395),
    254px 1499px 0 0px rgba(255, 255, 255, 0.36),
    660px 180px 0 0px rgba(255, 255, 255, 0.001),
    1329px 883px 0 0px rgba(255, 255, 255, 0.926),
    739px 1729px 0 0px rgba(255, 255, 255, 0.506),
    1143px 836px 0 0px rgba(255, 255, 255, 0.764),
    538px 354px 0 0px rgba(255, 255, 255, 0.22),
    728px 1385px 0 0px rgba(255, 255, 255, 0.816),
    1712px 605px 0 0px rgba(255, 255, 255, 1),
    1298px 1413px 0 0px rgba(255, 255, 255, 0.231),
    500px 103px 0 0px rgba(255, 255, 255, 0.725),
    1340px 603px 0 0px rgba(255, 255, 255, 0.78),
    1120px 770px 0 0px rgba(255, 255, 255, 0.374),
    1394px 1122px 0 0px rgba(255, 255, 255, 0.799),
    874px 1716px 0 0px rgba(255, 255, 255, 0.28),
    1561px 1305px 0 0px rgba(255, 255, 255, 0.646),
    399px 133px 0 0px rgba(255, 255, 255, 0.024),
    30px 1173px 0 0px rgba(255, 255, 255, 0.963),
    1455px 1018px 0 0px rgba(255, 255, 255, 0.616),
    1090px 1271px 0 0px rgba(255, 255, 255, 0.5),
    619px 1px 0 0px rgba(255, 255, 255, 0.097),
    1363px 1287px 0 0px rgba(255, 255, 255, 0.243),
    689px 1374px 0 0px rgba(255, 255, 255, 0.717),
    1168px 817px 0 0px rgba(255, 255, 255, 0.492),
    627px 1358px 0 0px rgba(255, 255, 255, 0.588),
    1774px 1154px 0 0px rgba(255, 255, 255, 0.395),
    461px 1301px 0 0px rgba(255, 255, 255, 0.147),
    436px 1438px 0 0px rgba(255, 255, 255, 0.144),
    1322px 184px 0 0px rgba(255, 255, 255, 0.975),
    760px 1330px 0 0px rgba(255, 255, 255, 0.007),
    669px 62px 0 0px rgba(255, 255, 255, 0.62),
    547px 238px 0 0px rgba(255, 255, 255, 0.947),
    547px 980px 0 0px rgba(255, 255, 255, 0.901),
    542px 1703px 0 0px rgba(255, 255, 255, 0.093),
    781px 660px 0 0px rgba(255, 255, 255, 0.988),
    258px 601px 0 0px rgba(255, 255, 255, 0.965),
    939px 216px 0 0px rgba(255, 255, 255, 0.298),
    1257px 5px 0 0px rgba(255, 255, 255, 0.948),
    339px 1033px 0 0px rgba(255, 255, 255, 0.375),
    1219px 623px 0 0px rgba(255, 255, 255, 0.753),
    582px 523px 0 0px rgba(255, 255, 255, 0.55),
    114px 1568px 0 0px rgba(255, 255, 255, 0.32),
    635px 748px 0 0px rgba(255, 255, 255, 0.112),
    1262px 340px 0 0px rgba(255, 255, 255, 0.462),
    207px 1437px 0 0px rgba(255, 255, 255, 0.998),
    1225px 173px 0 0px rgba(255, 255, 255, 0.277),
    1142px 1570px 0 0px rgba(255, 255, 255, 0.842),
    50px 478px 0 0px rgba(255, 255, 255, 0.077),
    1288px 1074px 0 0px rgba(255, 255, 255, 0.53),
    1496px 239px 0 0px rgba(255, 255, 255, 0.578),
    1169px 948px 0 0px rgba(255, 255, 255, 0.732),
    191px 1194px 0 0px rgba(255, 255, 255, 0.059),
    1217px 808px 0 0px rgba(255, 255, 255, 0.872),
    677px 408px 0 0px rgba(255, 255, 255, 0.491),
    941px 470px 0 0px rgba(255, 255, 255, 0.392),
    1173px 698px 0 0px rgba(255, 255, 255, 0.397),
    32px 1711px 0 0px rgba(255, 255, 255, 0.23),
    1303px 1101px 0 0px rgba(255, 255, 255, 0.853),
    409px 1689px 0 0px rgba(255, 255, 255, 0.768),
    1266px 1454px 0 0px rgba(255, 255, 255, 0.61),
    1730px 428px 0 0px rgba(255, 255, 255, 0.863),
    911px 927px 0 0px rgba(255, 255, 255, 0.904),
    735px 646px 0 0px rgba(255, 255, 255, 0.795),
    1517px 882px 0 0px rgba(255, 255, 255, 0.114),
    1629px 1660px 0 0px rgba(255, 255, 255, 0.749),
    1140px 1189px 0 0px rgba(255, 255, 255, 0.345),
    1068px 1760px 0 0px rgba(255, 255, 255, 0.868),
    774px 1262px 0 0px rgba(255, 255, 255, 0.74),
    1133px 5px 0 0px rgba(255, 255, 255, 0.319),
    194px 1647px 0 0px rgba(255, 255, 255, 0.441),
    1063px 531px 0 0px rgba(255, 255, 255, 0.734),
    1688px 1743px 0 0px rgba(255, 255, 255, 0.305),
    728px 1047px 0 0px rgba(255, 255, 255, 0.681),
    721px 1468px 0 0px rgba(255, 255, 255, 0.522),
    1465px 325px 0 0px rgba(255, 255, 255, 0.302),
    960px 703px 0 0px rgba(255, 255, 255, 0.658),
    1764px 1291px 0 0px rgba(255, 255, 255, 0.155),
    1065px 852px 0 0px rgba(255, 255, 255, 0.005),
    1759px 759px 0 0px rgba(255, 255, 255, 0.528),
    1291px 103px 0 0px rgba(255, 255, 255, 0.972),
    971px 103px 0 0px rgba(255, 255, 255, 0.199),
    380px 1463px 0 0px rgba(255, 255, 255, 0.704),
    654px 631px 0 0px rgba(255, 255, 255, 0.776),
    1087px 36px 0 0px rgba(255, 255, 255, 0.544),
    437px 1111px 0 0px rgba(255, 255, 255, 0.846),
    1220px 75px 0 0px rgba(255, 255, 255, 0.73),
    1681px 32px 0 0px rgba(255, 255, 255, 0.875),
    1071px 1106px 0 0px rgba(255, 255, 255, 0.494),
    380px 1098px 0 0px rgba(255, 255, 255, 0.294),
    1620px 935px 0 0px rgba(255, 255, 255, 0.132),
    650px 564px 0 0px rgba(255, 255, 255, 0.947),
    842px 920px 0 0px rgba(255, 255, 255, 0.611),
    78px 185px 0 0px rgba(255, 255, 255, 0.842),
    135px 249px 0 0px rgba(255, 255, 255, 0.021),
    73px 989px 0 0px rgba(255, 255, 255, 0.182),
    1085px 406px 0 0px rgba(255, 255, 255, 0.585),
    404px 1673px 0 0px rgba(255, 255, 255, 0.988),
    1256px 435px 0 0px rgba(255, 255, 255, 0.539),
    1337px 1283px 0 0px rgba(255, 255, 255, 0.806),
    43px 1325px 0 0px rgba(255, 255, 255, 0.761),
    1278px 539px 0 0px rgba(255, 255, 255, 0.504),
    1713px 61px 0 0px rgba(255, 255, 255, 0.398),
    1635px 1589px 0 0px rgba(255, 255, 255, 0.521),
    987px 89px 0 0px rgba(255, 255, 255, 0.269),
    1661px 229px 0 0px rgba(255, 255, 255, 0.95),
    940px 453px 0 0px rgba(255, 255, 255, 0.963),
    708px 1149px 0 0px rgba(255, 255, 255, 0.136),
    1485px 853px 0 0px rgba(255, 255, 255, 0.616),
    1142px 1329px 0 0px rgba(255, 255, 255, 0.431),
    1637px 1643px 0 0px rgba(255, 255, 255, 0.229),
    43px 400px 0 0px rgba(255, 255, 255, 0.439),
    258px 480px 0 0px rgba(255, 255, 255, 0.859),
    897px 689px 0 0px rgba(255, 255, 255, 0.887),
    1759px 90px 0 0px rgba(255, 255, 255, 0.997),
    1787px 1771px 0 0px rgba(255, 255, 255, 0.401),
    1716px 1375px 0 0px rgba(255, 255, 255, 0.055),
    603px 522px 0 0px rgba(255, 255, 255, 0.573),
    1678px 795px 0 0px rgba(255, 255, 255, 0.917),
    221px 1516px 0 0px rgba(255, 255, 255, 0.757),
    1464px 1046px 0 0px rgba(255, 255, 255, 0.065),
    1511px 1747px 0 0px rgba(255, 255, 255, 0.507),
    907px 377px 0 0px rgba(255, 255, 255, 0.762),
    275px 1384px 0 0px rgba(255, 255, 255, 0.488),
    451px 1301px 0 0px rgba(255, 255, 255, 0.562),
    534px 900px 0 0px rgba(255, 255, 255, 0.323),
    1390px 792px 0 0px rgba(255, 255, 255, 0.062),
    1308px 673px 0 0px rgba(255, 255, 255, 0.319),
    1752px 119px 0 0px rgba(255, 255, 255, 0.187),
    460px 1760px 0 0px rgba(255, 255, 255, 0.714),
    1211px 903px 0 0px rgba(255, 255, 255, 0.276),
    1489px 845px 0 0px rgba(255, 255, 255, 0.628),
    1479px 1601px 0 0px rgba(255, 255, 255, 0.008),
    408px 1431px 0 0px rgba(255, 255, 255, 0.712),
    726px 538px 0 0px rgba(255, 255, 255, 0.904),
    1799px 1505px 0 0px rgba(255, 255, 255, 0.457),
    678px 803px 0 0px rgba(255, 255, 255, 0.889),
    1450px 802px 0 0px rgba(255, 255, 255, 0.26),
    1419px 335px 0 0px rgba(255, 255, 255, 0.17),
    336px 424px 0 0px rgba(255, 255, 255, 0.007),
    214px 1404px 0 0px rgba(255, 255, 255, 0.638),
    205px 399px 0 0px rgba(255, 255, 255, 0.968),
    268px 65px 0 0px rgba(255, 255, 255, 0.78),
    22px 1480px 0 0px rgba(255, 255, 255, 0.6),
    616px 745px 0 0px rgba(255, 255, 255, 0.037),
    1777px 922px 0 0px rgba(255, 255, 255, 0.814),
    1450px 920px 0 0px rgba(255, 255, 255, 0.384),
    872px 678px 0 0px rgba(255, 255, 255, 0.853),
    105px 1491px 0 0px rgba(255, 255, 255, 0.78),
    1577px 324px 0 0px rgba(255, 255, 255, 0.861),
    999px 546px 0 0px rgba(255, 255, 255, 0.488),
    1137px 80px 0 0px rgba(255, 255, 255, 0.588),
    161px 141px 0 0px rgba(255, 255, 255, 0.465),
    782px 559px 0 0px rgba(255, 255, 255, 0.608),
    377px 1143px 0 0px rgba(255, 255, 255, 0.213),
    141px 1698px 0 0px rgba(255, 255, 255, 0.144),
    729px 1757px 0 0px rgba(255, 255, 255, 0.229),
    1337px 746px 0 0px rgba(255, 255, 255, 0.943),
    878px 1193px 0 0px rgba(255, 255, 255, 0.964),
    530px 641px 0 0px rgba(255, 255, 255, 0.279),
    24px 914px 0 0px rgba(255, 255, 255, 0.418),
    1539px 874px 0 0px rgba(255, 255, 255, 0.955),
    930px 297px 0 0px rgba(255, 255, 255, 0.179),
    1188px 484px 0 0px rgba(255, 255, 255, 0.153),
    487px 1238px 0 0px rgba(255, 255, 255, 0.865),
    1559px 101px 0 0px rgba(255, 255, 255, 0.671),
    1297px 1774px 0 0px rgba(255, 255, 255, 0.522),
    1781px 502px 0 0px rgba(255, 255, 255, 0.175),
    1328px 697px 0 0px rgba(255, 255, 255, 0.859),
    1314px 1515px 0 0px rgba(255, 255, 255, 0.259),
    1153px 209px 0 0px rgba(255, 255, 255, 0.301),
    1704px 1205px 0 0px rgba(255, 255, 255, 0.199),
    1575px 261px 0 0px rgba(255, 255, 255, 0.734),
    726px 561px 0 0px rgba(255, 255, 255, 0.98),
    1208px 384px 0 0px rgba(255, 255, 255, 0.208),
    209px 111px 0 0px rgba(255, 255, 255, 0.57),
    1352px 1782px 0 0px rgba(255, 255, 255, 0.937),
    1412px 1382px 0 0px rgba(255, 255, 255, 0.069),
    1513px 220px 0 0px rgba(255, 255, 255, 0.626),
    547px 115px 0 0px rgba(255, 255, 255, 0.092),
    1195px 1368px 0 0px rgba(255, 255, 255, 0.986),
    314px 417px 0 0px rgba(255, 255, 255, 0.246),
    1239px 1120px 0 0px rgba(255, 255, 255, 0.098),
    1558px 284px 0 0px rgba(255, 255, 255, 0.567),
    50px 606px 0 0px rgba(255, 255, 255, 0.594),
    638px 812px 0 0px rgba(255, 255, 255, 0.905),
    369px 1287px 0 0px rgba(255, 255, 255, 0.934),
    296px 973px 0 0px rgba(255, 255, 255, 0.632),
    910px 1089px 0 0px rgba(255, 255, 255, 0.657),
    346px 782px 0 0px rgba(255, 255, 255, 0.267),
    914px 269px 0 0px rgba(255, 255, 255, 0.912),
    424px 1377px 0 0px rgba(255, 255, 255, 0.015),
    1278px 229px 0 0px rgba(255, 255, 255, 0.982),
    1045px 803px 0 0px rgba(255, 255, 255, 0.959),
    1272px 503px 0 0px rgba(255, 255, 255, 0.503),
    699px 1653px 0 0px rgba(255, 255, 255, 0.045),
    1305px 1555px 0 0px rgba(255, 255, 255, 0.063),
    705px 431px 0 0px rgba(255, 255, 255, 0.857),
    1003px 1043px 0 0px rgba(255, 255, 255, 0.916),
    394px 748px 0 0px rgba(255, 255, 255, 0.784),
    1287px 745px 0 0px rgba(255, 255, 255, 0.229),
    187px 1236px 0 0px rgba(255, 255, 255, 0.871),
    122px 752px 0 0px rgba(255, 255, 255, 0.147),
    769px 1663px 0 0px rgba(255, 255, 255, 0.293),
    1563px 811px 0 0px rgba(255, 255, 255, 0.638),
    1754px 1119px 0 0px rgba(255, 255, 255, 0.061),
    1269px 705px 0 0px rgba(255, 255, 255, 0.51),
    1173px 1785px 0 0px rgba(255, 255, 255, 0.541),
    1238px 36px 0 0px rgba(255, 255, 255, 0.37),
    846px 1429px 0 0px rgba(255, 255, 255, 0.39),
    426px 1640px 0 0px rgba(255, 255, 255, 0.126),
    276px 1197px 0 0px rgba(255, 255, 255, 0.76),
    1112px 725px 0 0px rgba(255, 255, 255, 0.336),
    780px 1187px 0 0px rgba(255, 255, 255, 0.864),
    650px 1738px 0 0px rgba(255, 255, 255, 0.706),
    405px 1064px 0 0px rgba(255, 255, 255, 0.663),
    1388px 1188px 0 0px rgba(255, 255, 255, 0.653),
    330px 17px 0 0px rgba(255, 255, 255, 0.87),
    942px 1100px 0 0px rgba(255, 255, 255, 0.153),
    1198px 21px 0 0px rgba(255, 255, 255, 0.197),
    751px 1523px 0 0px rgba(255, 255, 255, 0.733),
    690px 756px 0 0px rgba(255, 255, 255, 0.684),
    850px 1055px 0 0px rgba(255, 255, 255, 0.032),
    173px 1796px 0 0px rgba(255, 255, 255, 0.855),
    1052px 683px 0 0px rgba(255, 255, 255, 0.815),
    1761px 1452px 0 0px rgba(255, 255, 255, 0.981),
    998px 1360px 0 0px rgba(255, 255, 255, 0.948),
    1502px 711px 0 0px rgba(255, 255, 255, 0.18),
    689px 1549px 0 0px rgba(255, 255, 255, 0.133),
    63px 1492px 0 0px rgba(255, 255, 255, 0.908),
    232px 1080px 0 0px rgba(255, 255, 255, 0.845),
    894px 1616px 0 0px rgba(255, 255, 255, 0.594),
    210px 1067px 0 0px rgba(255, 255, 255, 0.632),
    674px 865px 0 0px rgba(255, 255, 255, 0.039),
    140px 1448px 0 0px rgba(255, 255, 255, 0.739),
    1382px 1510px 0 0px rgba(255, 255, 255, 0.889),
    279px 1766px 0 0px rgba(255, 255, 255, 0.642),
    599px 1701px 0 0px rgba(255, 255, 255, 0.984),
    1615px 697px 0 0px rgba(255, 255, 255, 0.63),
    1775px 1433px 0 0px rgba(255, 255, 255, 0.027),
    1771px 684px 0 0px rgba(255, 255, 255, 0.555),
    345px 600px 0 0px rgba(255, 255, 255, 0.959),
    821px 236px 0 0px rgba(255, 255, 255, 0.704),
    691px 1005px 0 0px rgba(255, 255, 255, 0.371),
    1367px 802px 0 0px rgba(255, 255, 255, 0.533),
    1708px 1338px 0 0px rgba(255, 255, 255, 0.999),
    863px 177px 0 0px rgba(255, 255, 255, 0.249),
    1129px 1480px 0 0px rgba(255, 255, 255, 0.007),
    430px 776px 0 0px rgba(255, 255, 255, 0.277),
    525px 1088px 0 0px rgba(255, 255, 255, 0.51),
    407px 246px 0 0px rgba(255, 255, 255, 0.912),
    1192px 307px 0 0px rgba(255, 255, 255, 0.077),
    163px 1070px 0 0px rgba(255, 255, 255, 0.788),
    713px 1010px 0 0px rgba(255, 255, 255, 0.672),
    388px 1783px 0 0px rgba(255, 255, 255, 0.252),
    981px 8px 0 0px rgba(255, 255, 255, 0.394),
    148px 1541px 0 0px rgba(255, 255, 255, 0.537),
    1359px 1727px 0 0px rgba(255, 255, 255, 0.039),
    1333px 1112px 0 0px rgba(255, 255, 255, 0.883),
    972px 979px 0 0px rgba(255, 255, 255, 0.93);
  border-radius: 100px;
}

#xterm-container {
  opacity: 1;
  position: absolute;
  top: 80px;
  left: 100px;
  width: calc(100% - 100px - 100px);
  height: calc(100% - 60px - 80px);
  z-index: 5; /* 确保它在.glitch之上 */
  /* padding-left: 100px; */

  /* scrollbar-color: #888 transparent !important; */
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0;
  }

  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb {
    cursor: pointer;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.8);
    transition: color 0.2s ease;
  }

  :deep(.xterm-viewport) {
    overflow: hidden !important;
  }
  :hover :deep(.xterm-viewport) {
    overflow: auto !important;
  }
}

.solar {
  position: relative;
  width: 100%;
  height: 100%;
  top: 10%;
  left: 25%;
  pointer-events: none;
  /* background: none; */
}
</style>
