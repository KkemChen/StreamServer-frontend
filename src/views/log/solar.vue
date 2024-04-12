<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  solarSystemClass: String,
  solarSystemStyle: Object
})
</script>

<template>
<div class='solar-syst' :class='solarSystemClass' :style='solarSystemStyle'>
  <div class='sun'></div>
  <div class='mercury'></div>
  <div class='venus'></div>
  <div class='earth'></div>
  <div class='mars'></div>
  <div class='jupiter'></div>
  <div class='saturn'></div>
  <div class='uranus'></div>
  <div class='neptune'></div>
  <div class='pluto'></div>
  <div class='asteroids-belt'></div>
</div>

</template>

<style scoped>
/*
  Malik Dellidj - @Dathink

  Solar System orbit animation true time scaled

  Revolution of planets in earth days (from Wikipedia)
  Mercury : ~87,5 days
  Venus : ~224,7 days
  Earth : ~365,2563 days
    + Moon : ~27,3216 days (around earth)
  Mars : ~687 days (~1,8 year)
  Jupiter : ~4 331 days (~12 years)
  Saturn : ~10 747 days (~30 years)
  Uranus : ~30 589 days (~84 years)
  Neptune : ~59 802 days (~165 years)
  Pluto : ~90 580 days (~248 years)
*/
*,
*:before,
*:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
}

body {
  font: normal 1em/1.45em "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: #fff;
  background: radial-gradient(ellipse at bottom, #1c2837 0%, #050608 100%);
  background-attachment: fixed;
}

h1 {
  font-weight: 300;
  font-size: 2.5em;
  text-transform: uppercase;
  font-family: Lato;
  line-height: 1.6em;
  letter-spacing: 0.1em;
}

a,
a:visited {
  text-decoration: none;
  color: white;
  opacity: 0.7;
}
a:hover,
a:visited:hover {
  opacity: 1;
}
a.icon,
a:visited.icon {
  margin-right: 2px;
  padding: 3px;
}

.description {
  padding: 30px;
  position: absolute;
  top: 0;
  left: 0;
  width: 25%;
  z-index: 999;
}
.description p {
  font-size: 0.9em;
}
.description p + p {
  margin-top: 20px;
}
.description p.author {
  font-size: 0.7em;
}
.description p.author .fa-heart {
  color: #860014;
}

hr {
  margin: 26px 0;
  border: 0;
  border-top: 1px solid white;
  background: transparent;
  width: 25%;
  opacity: 0.1;
}

code {
  color: #ae94c0;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 0.9em;
}

.solar-syst {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  position: relative;
}
.solar-syst:after {
  content: "";
  position: absolute;
  height: 2px;
  width: 2px;
  top: -2px;
  background: white;
  box-shadow: 1373px 74px 0 0px rgba(255, 255, 255, 0.252) , 98px 242px 0 0px rgba(255,255,255, 0.601) , 1309px 298px 0 0px rgba(255,255,255, 0.387) , 1438px 1787px 0 0px rgba(255,255,255, 0.462) , 1468px 1682px 0 0px rgba(255,255,255, 0.004) , 1728px 1605px 0 0px rgba(255,255,255, 0.654) , 464px 1655px 0 0px rgba(255,255,255, 0.938) , 878px 906px 0 0px rgba(255,255,255, 0.731) , 1171px 678px 0 0px rgba(255,255,255, 0.509) , 679px 898px 0 0px rgba(255,255,255, 0.134) , 1336px 1403px 0 0px rgba(255,255,255, 0.954) , 388px 1689px 0 0px rgba(255,255,255, 0.848) , 779px 490px 0 0px rgba(255,255,255, 0.715) , 14px 617px 0 0px rgba(255,255,255, 0.081) , 464px 1317px 0 0px rgba(255,255,255, 0.765) , 499px 1731px 0 0px rgba(255,255,255, 0.543) , 109px 1272px 0 0px rgba(255,255,255, 0.585) , 864px 426px 0 0px rgba(255,255,255, 0.312) , 1456px 119px 0 0px rgba(255,255,255, 0.529) , 1191px 748px 0 0px rgba(255,255,255, 0.17) , 141px 870px 0 0px rgba(255,255,255, 0.762) , 509px 44px 0 0px rgba(255,255,255, 0.883) , 630px 1299px 0 0px rgba(255,255,255, 0.214) , 580px 677px 0 0px rgba(255,255,255, 0.174) , 367px 527px 0 0px rgba(255,255,255, 0.388) , 797px 411px 0 0px rgba(255,255,255, 0.761) , 1731px 1126px 0 0px rgba(255,255,255, 0.833) , 455px 1159px 0 0px rgba(255,255,255, 0.29) , 556px 454px 0 0px rgba(255,255,255, 0.538) , 236px 348px 0 0px rgba(255,255,255, 0.709) , 1016px 9px 0 0px rgba(255,255,255, 0.371) , 784px 1025px 0 0px rgba(255,255,255, 0.782) , 299px 1762px 0 0px rgba(255,255,255, 0.707) , 1750px 1789px 0 0px rgba(255,255,255, 0.773) , 249px 223px 0 0px rgba(255,255,255, 0.039) , 1135px 891px 0 0px rgba(255,255,255, 0.328) , 1619px 17px 0 0px rgba(255,255,255, 0.051) , 1213px 1167px 0 0px rgba(255,255,255, 0.898) , 1346px 658px 0 0px rgba(255,255,255, 0.819) , 656px 1105px 0 0px rgba(255,255,255, 0.572) , 120px 547px 0 0px rgba(255,255,255, 0.065) , 1196px 217px 0 0px rgba(255,255,255, 0.353) , 515px 1550px 0 0px rgba(255,255,255, 0.968) , 599px 29px 0 0px rgba(255,255,255, 0.1) , 724px 1084px 0 0px rgba(255,255,255, 0.169) , 1507px 1038px 0 0px rgba(255,255,255, 0.665) , 974px 506px 0 0px rgba(255,255,255, 0.15) , 1744px 1436px 0 0px rgba(255,255,255, 0.682) , 50px 1442px 0 0px rgba(255,255,255, 0.118) , 1301px 308px 0 0px rgba(255,255,255, 0.553) , 1321px 681px 0 0px rgba(255,255,255, 0.487) , 1657px 856px 0 0px rgba(255,255,255, 0.951) , 1395px 1671px 0 0px rgba(255,255,255, 0.458) , 666px 177px 0 0px rgba(255,255,255, 0.819) , 898px 1145px 0 0px rgba(255,255,255, 0.914) , 593px 1055px 0 0px rgba(255,255,255, 0.279) , 675px 788px 0 0px rgba(255,255,255, 0.738) , 481px 1521px 0 0px rgba(255,255,255, 0.776) , 25px 1163px 0 0px rgba(255,255,255, 0.196) , 212px 495px 0 0px rgba(255,255,255, 0.804) , 990px 1659px 0 0px rgba(255,255,255, 0.514) , 1363px 540px 0 0px rgba(255,255,255, 0.99) , 1557px 298px 0 0px rgba(255,255,255, 0.567) , 1390px 814px 0 0px rgba(255,255,255, 0.566) , 600px 912px 0 0px rgba(255,255,255, 0.197) , 543px 1030px 0 0px rgba(255,255,255, 0.613) , 1149px 694px 0 0px rgba(255,255,255, 0.843) , 137px 1387px 0 0px rgba(255,255,255, 0.227) , 640px 971px 0 0px rgba(255,255,255, 0.869) , 995px 1168px 0 0px rgba(255,255,255, 0.175) , 981px 432px 0 0px rgba(255,255,255, 0.472) , 882px 1586px 0 0px rgba(255,255,255, 0.204) , 693px 1045px 0 0px rgba(255,255,255, 0.619) , 415px 1345px 0 0px rgba(255,255,255, 0.187) , 1791px 720px 0 0px rgba(255,255,255, 0.146) , 637px 760px 0 0px rgba(255,255,255, 0.746) , 923px 1472px 0 0px rgba(255,255,255, 0.932) , 20px 1081px 0 0px rgba(255,255,255, 0.53) , 1285px 1788px 0 0px rgba(255,255,255, 0.84) , 470px 1025px 0 0px rgba(255,255,255, 0.23) , 900px 1568px 0 0px rgba(255,255,255, 0.741) , 1297px 504px 0 0px rgba(255,255,255, 0.327) , 84px 508px 0 0px rgba(255,255,255, 0.769) , 1192px 157px 0 0px rgba(255,255,255, 0.656) , 739px 620px 0 0px rgba(255,255,255, 0.81) , 619px 468px 0 0px rgba(255,255,255, 0.293) , 570px 616px 0 0px rgba(255,255,255, 0.091) , 1276px 800px 0 0px rgba(255,255,255, 0.306) , 1205px 277px 0 0px rgba(255,255,255, 0.61) , 674px 1054px 0 0px rgba(255,255,255, 0.631) , 1333px 1087px 0 0px rgba(255,255,255, 0.56) , 1725px 1469px 0 0px rgba(255,255,255, 0.71) , 666px 1224px 0 0px rgba(255,255,255, 0.88) , 1073px 1582px 0 0px rgba(255,255,255, 0.531) , 1693px 800px 0 0px rgba(255,255,255, 0.278) , 1768px 1467px 0 0px rgba(255,255,255, 0.555) , 398px 1393px 0 0px rgba(255,255,255, 0.744) , 188px 369px 0 0px rgba(255,255,255, 0.973) , 1436px 1291px 0 0px rgba(255,255,255, 0.768) , 1686px 379px 0 0px rgba(255,255,255, 0.755) , 22px 1185px 0 0px rgba(255,255,255, 0.015) , 974px 461px 0 0px rgba(255,255,255, 1) , 837px 452px 0 0px rgba(255,255,255, 0.968) , 1751px 564px 0 0px rgba(255,255,255, 0.332) , 1270px 1490px 0 0px rgba(255,255,255, 0.284) , 58px 1631px 0 0px rgba(255,255,255, 0.394) , 1395px 1243px 0 0px rgba(255,255,255, 0.405) , 1027px 1435px 0 0px rgba(255,255,255, 0.677) , 445px 874px 0 0px rgba(255,255,255, 0.298) , 246px 1157px 0 0px rgba(255,255,255, 0.018) , 144px 288px 0 0px rgba(255,255,255, 0.48) , 349px 400px 0 0px rgba(255,255,255, 0.88) , 1351px 383px 0 0px rgba(255,255,255, 0.375) , 782px 897px 0 0px rgba(255,255,255, 0.398) , 149px 1534px 0 0px rgba(255,255,255, 0.027) , 1563px 1281px 0 0px rgba(255,255,255, 0.371) , 1599px 1471px 0 0px rgba(255,255,255, 0.312) , 568px 1784px 0 0px rgba(255,255,255, 0.963) , 1081px 5px 0 0px rgba(255,255,255, 0.079) , 781px 1337px 0 0px rgba(255,255,255, 0.103) , 815px 6px 0 0px rgba(255,255,255, 0.698) , 1442px 1408px 0 0px rgba(255,255,255, 0.439) , 233px 209px 0 0px rgba(255,255,255, 0.431) , 728px 922px 0 0px rgba(255,255,255, 0.322) , 471px 1394px 0 0px rgba(255,255,255, 0.807) , 977px 45px 0 0px rgba(255,255,255, 0.576) , 1645px 340px 0 0px rgba(255,255,255, 0.525) , 894px 1234px 0 0px rgba(255,255,255, 0.283) , 440px 1143px 0 0px rgba(255,255,255, 0.543) , 753px 1556px 0 0px rgba(255,255,255, 0.396) , 1331px 75px 0 0px rgba(255,255,255, 0.295) , 1554px 794px 0 0px rgba(255,255,255, 0.604) , 722px 843px 0 0px rgba(255,255,255, 0.499) , 424px 1420px 0 0px rgba(255,255,255, 0.247) , 1772px 55px 0 0px rgba(255,255,255, 0.806) , 1336px 94px 0 0px rgba(255,255,255, 0.988) , 1444px 56px 0 0px rgba(255,255,255, 0.002) , 1404px 1405px 0 0px rgba(255,255,255, 0.928) , 290px 1797px 0 0px rgba(255,255,255, 0.886) , 1195px 815px 0 0px rgba(255,255,255, 0.236) , 1250px 831px 0 0px rgba(255,255,255, 0.262) , 1169px 604px 0 0px rgba(255,255,255, 0.072) , 1317px 814px 0 0px rgba(255,255,255, 0.83) , 1130px 511px 0 0px rgba(255,255,255, 0.805) , 957px 860px 0 0px rgba(255,255,255, 0.791) , 986px 1371px 0 0px rgba(255,255,255, 0.648) , 662px 1427px 0 0px rgba(255,255,255, 0.898) , 858px 933px 0 0px rgba(255,255,255, 0.661) , 717px 1193px 0 0px rgba(255,255,255, 0.611) , 879px 149px 0 0px rgba(255,255,255, 0.022) , 664px 911px 0 0px rgba(255,255,255, 0.416) , 593px 487px 0 0px rgba(255,255,255, 0.272) , 267px 904px 0 0px rgba(255,255,255, 0.687) , 1204px 1671px 0 0px rgba(255,255,255, 0.177) , 920px 1165px 0 0px rgba(255,255,255, 0.757) , 230px 1709px 0 0px rgba(255,255,255, 0.628) , 50px 776px 0 0px rgba(255,255,255, 0.734) , 596px 5px 0 0px rgba(255,255,255, 0.044) , 1472px 1032px 0 0px rgba(255,255,255, 0.19) , 1407px 1752px 0 0px rgba(255,255,255, 0.387) , 1192px 496px 0 0px rgba(255,255,255, 0.076) , 1117px 1102px 0 0px rgba(255,255,255, 0.998) , 683px 1052px 0 0px rgba(255,255,255, 0.947) , 833px 837px 0 0px rgba(255,255,255, 0.349) , 1486px 1241px 0 0px rgba(255,255,255, 0.04) , 11px 1681px 0 0px rgba(255,255,255, 0.124) , 923px 1040px 0 0px rgba(255,255,255, 0.822) , 1576px 357px 0 0px rgba(255,255,255, 0.004) , 1319px 159px 0 0px rgba(255,255,255, 0.878) , 275px 835px 0 0px rgba(255,255,255, 0.62) , 1000px 1384px 0 0px rgba(255,255,255, 0.666) , 1242px 1602px 0 0px rgba(255,255,255, 0.627) , 1054px 702px 0 0px rgba(255,255,255, 0.441) , 39px 310px 0 0px rgba(255,255,255, 0.549) , 1285px 236px 0 0px rgba(255,255,255, 0.503) , 676px 1030px 0 0px rgba(255,255,255, 0.55) , 38px 374px 0 0px rgba(255,255,255, 0.045) , 419px 1309px 0 0px rgba(255,255,255, 1) , 1016px 91px 0 0px rgba(255,255,255, 0.315) , 713px 1684px 0 0px rgba(255,255,255, 0.871) , 1668px 9px 0 0px rgba(255,255,255, 0.904) , 170px 1496px 0 0px rgba(255,255,255, 0.798) , 484px 1445px 0 0px rgba(255,255,255, 0.125) , 1620px 1699px 0 0px rgba(255,255,255, 0.683) , 836px 1561px 0 0px rgba(255,255,255, 0.28) , 1797px 739px 0 0px rgba(255,255,255, 0.929) , 1014px 848px 0 0px rgba(255,255,255, 0.589) , 936px 1610px 0 0px rgba(255,255,255, 0.097) , 108px 248px 0 0px rgba(255,255,255, 0.509) , 516px 854px 0 0px rgba(255,255,255, 0.5) , 180px 1613px 0 0px rgba(255,255,255, 0.515) , 552px 959px 0 0px rgba(255,255,255, 0.946) , 231px 436px 0 0px rgba(255,255,255, 0.025) , 1786px 92px 0 0px rgba(255,255,255, 0.995) , 1304px 113px 0 0px rgba(255,255,255, 0.2) , 1507px 711px 0 0px rgba(255,255,255, 0.122) , 403px 1332px 0 0px rgba(255,255,255, 0.772) , 837px 43px 0 0px rgba(255,255,255, 0.819) , 985px 1451px 0 0px rgba(255,255,255, 0.195) , 181px 435px 0 0px rgba(255,255,255, 0.789) , 1761px 1359px 0 0px rgba(255,255,255, 0.504) , 124px 100px 0 0px rgba(255,255,255, 0.117) , 1359px 567px 0 0px rgba(255,255,255, 0.885) , 420px 1109px 0 0px rgba(255,255,255, 0.95) , 25px 1146px 0 0px rgba(255,255,255, 0.555) , 1627px 1404px 0 0px rgba(255,255,255, 0.506) , 1098px 1359px 0 0px rgba(255,255,255, 0.461) , 1319px 304px 0 0px rgba(255,255,255, 0.006) , 941px 908px 0 0px rgba(255,255,255, 0.721) , 1365px 332px 0 0px rgba(255,255,255, 0.224) , 941px 1528px 0 0px rgba(255,255,255, 0.56) , 1797px 1511px 0 0px rgba(255,255,255, 0.451) , 965px 655px 0 0px rgba(255,255,255, 0.266) , 1797px 1267px 0 0px rgba(255,255,255, 0.775) , 680px 1102px 0 0px rgba(255,255,255, 0.063) , 200px 1025px 0 0px rgba(255,255,255, 0.098) , 1498px 1383px 0 0px rgba(255,255,255, 0.032) , 207px 1237px 0 0px rgba(255,255,255, 0.988) , 1176px 30px 0 0px rgba(255,255,255, 0.149) , 1670px 807px 0 0px rgba(255,255,255, 0.644) , 1194px 526px 0 0px rgba(255,255,255, 0.456) , 1622px 321px 0 0px rgba(255,255,255, 0.128) , 1309px 144px 0 0px rgba(255,255,255, 0.297) , 847px 222px 0 0px rgba(255,255,255, 0.175) , 574px 91px 0 0px rgba(255,255,255, 0.273) , 215px 293px 0 0px rgba(255,255,255, 0.258) , 1473px 385px 0 0px rgba(255,255,255, 0.73) , 1661px 742px 0 0px rgba(255,255,255, 0.329) , 1631px 183px 0 0px rgba(255,255,255, 0.216) , 220px 733px 0 0px rgba(255,255,255, 0.642) , 1279px 141px 0 0px rgba(255,255,255, 0.003) , 1528px 1231px 0 0px rgba(255,255,255, 0.044) , 805px 1561px 0 0px rgba(255,255,255, 0.221) , 992px 1592px 0 0px rgba(255,255,255, 0.402) , 272px 985px 0 0px rgba(255,255,255, 0.508) , 356px 1438px 0 0px rgba(255,255,255, 0.855) , 1730px 956px 0 0px rgba(255,255,255, 0.389) , 1730px 647px 0 0px rgba(255,255,255, 0.22) , 1753px 1725px 0 0px rgba(255,255,255, 0.705) , 1040px 182px 0 0px rgba(255,255,255, 0.503) , 1243px 294px 0 0px rgba(255,255,255, 0.497) , 1750px 463px 0 0px rgba(255,255,255, 0.395) , 254px 1499px 0 0px rgba(255,255,255, 0.36) , 660px 180px 0 0px rgba(255,255,255, 0.001) , 1329px 883px 0 0px rgba(255,255,255, 0.926) , 739px 1729px 0 0px rgba(255,255,255, 0.506) , 1143px 836px 0 0px rgba(255,255,255, 0.764) , 538px 354px 0 0px rgba(255,255,255, 0.22) , 728px 1385px 0 0px rgba(255,255,255, 0.816) , 1712px 605px 0 0px rgba(255,255,255, 1) , 1298px 1413px 0 0px rgba(255,255,255, 0.231) , 500px 103px 0 0px rgba(255,255,255, 0.725) , 1340px 603px 0 0px rgba(255,255,255, 0.78) , 1120px 770px 0 0px rgba(255,255,255, 0.374) , 1394px 1122px 0 0px rgba(255,255,255, 0.799) , 874px 1716px 0 0px rgba(255,255,255, 0.28) , 1561px 1305px 0 0px rgba(255,255,255, 0.646) , 399px 133px 0 0px rgba(255,255,255, 0.024) , 30px 1173px 0 0px rgba(255,255,255, 0.963) , 1455px 1018px 0 0px rgba(255,255,255, 0.616) , 1090px 1271px 0 0px rgba(255,255,255, 0.5) , 619px 1px 0 0px rgba(255,255,255, 0.097) , 1363px 1287px 0 0px rgba(255,255,255, 0.243) , 689px 1374px 0 0px rgba(255,255,255, 0.717) , 1168px 817px 0 0px rgba(255,255,255, 0.492) , 627px 1358px 0 0px rgba(255,255,255, 0.588) , 1774px 1154px 0 0px rgba(255,255,255, 0.395) , 461px 1301px 0 0px rgba(255,255,255, 0.147) , 436px 1438px 0 0px rgba(255,255,255, 0.144) , 1322px 184px 0 0px rgba(255,255,255, 0.975) , 760px 1330px 0 0px rgba(255,255,255, 0.007) , 669px 62px 0 0px rgba(255,255,255, 0.62) , 547px 238px 0 0px rgba(255,255,255, 0.947) , 547px 980px 0 0px rgba(255,255,255, 0.901) , 542px 1703px 0 0px rgba(255,255,255, 0.093) , 781px 660px 0 0px rgba(255,255,255, 0.988) , 258px 601px 0 0px rgba(255,255,255, 0.965) , 939px 216px 0 0px rgba(255,255,255, 0.298) , 1257px 5px 0 0px rgba(255,255,255, 0.948) , 339px 1033px 0 0px rgba(255,255,255, 0.375) , 1219px 623px 0 0px rgba(255,255,255, 0.753) , 582px 523px 0 0px rgba(255,255,255, 0.55) , 114px 1568px 0 0px rgba(255,255,255, 0.32) , 635px 748px 0 0px rgba(255,255,255, 0.112) , 1262px 340px 0 0px rgba(255,255,255, 0.462) , 207px 1437px 0 0px rgba(255,255,255, 0.998) , 1225px 173px 0 0px rgba(255,255,255, 0.277) , 1142px 1570px 0 0px rgba(255,255,255, 0.842) , 50px 478px 0 0px rgba(255,255,255, 0.077) , 1288px 1074px 0 0px rgba(255,255,255, 0.53) , 1496px 239px 0 0px rgba(255,255,255, 0.578) , 1169px 948px 0 0px rgba(255,255,255, 0.732) , 191px 1194px 0 0px rgba(255,255,255, 0.059) , 1217px 808px 0 0px rgba(255,255,255, 0.872) , 677px 408px 0 0px rgba(255,255,255, 0.491) , 941px 470px 0 0px rgba(255,255,255, 0.392) , 1173px 698px 0 0px rgba(255,255,255, 0.397) , 32px 1711px 0 0px rgba(255,255,255, 0.23) , 1303px 1101px 0 0px rgba(255,255,255, 0.853) , 409px 1689px 0 0px rgba(255,255,255, 0.768) , 1266px 1454px 0 0px rgba(255,255,255, 0.61) , 1730px 428px 0 0px rgba(255,255,255, 0.863) , 911px 927px 0 0px rgba(255,255,255, 0.904) , 735px 646px 0 0px rgba(255,255,255, 0.795) , 1517px 882px 0 0px rgba(255,255,255, 0.114) , 1629px 1660px 0 0px rgba(255,255,255, 0.749) , 1140px 1189px 0 0px rgba(255,255,255, 0.345) , 1068px 1760px 0 0px rgba(255,255,255, 0.868) , 774px 1262px 0 0px rgba(255,255,255, 0.74) , 1133px 5px 0 0px rgba(255,255,255, 0.319) , 194px 1647px 0 0px rgba(255,255,255, 0.441) , 1063px 531px 0 0px rgba(255,255,255, 0.734) , 1688px 1743px 0 0px rgba(255,255,255, 0.305) , 728px 1047px 0 0px rgba(255,255,255, 0.681) , 721px 1468px 0 0px rgba(255,255,255, 0.522) , 1465px 325px 0 0px rgba(255,255,255, 0.302) , 960px 703px 0 0px rgba(255,255,255, 0.658) , 1764px 1291px 0 0px rgba(255,255,255, 0.155) , 1065px 852px 0 0px rgba(255,255,255, 0.005) , 1759px 759px 0 0px rgba(255,255,255, 0.528) , 1291px 103px 0 0px rgba(255,255,255, 0.972) , 971px 103px 0 0px rgba(255,255,255, 0.199) , 380px 1463px 0 0px rgba(255,255,255, 0.704) , 654px 631px 0 0px rgba(255,255,255, 0.776) , 1087px 36px 0 0px rgba(255,255,255, 0.544) , 437px 1111px 0 0px rgba(255,255,255, 0.846) , 1220px 75px 0 0px rgba(255,255,255, 0.73) , 1681px 32px 0 0px rgba(255,255,255, 0.875) , 1071px 1106px 0 0px rgba(255,255,255, 0.494) , 380px 1098px 0 0px rgba(255,255,255, 0.294) , 1620px 935px 0 0px rgba(255,255,255, 0.132) , 650px 564px 0 0px rgba(255,255,255, 0.947) , 842px 920px 0 0px rgba(255,255,255, 0.611) , 78px 185px 0 0px rgba(255,255,255, 0.842) , 135px 249px 0 0px rgba(255,255,255, 0.021) , 73px 989px 0 0px rgba(255,255,255, 0.182) , 1085px 406px 0 0px rgba(255,255,255, 0.585) , 404px 1673px 0 0px rgba(255,255,255, 0.988) , 1256px 435px 0 0px rgba(255,255,255, 0.539) , 1337px 1283px 0 0px rgba(255,255,255, 0.806) , 43px 1325px 0 0px rgba(255,255,255, 0.761) , 1278px 539px 0 0px rgba(255,255,255, 0.504) , 1713px 61px 0 0px rgba(255,255,255, 0.398) , 1635px 1589px 0 0px rgba(255,255,255, 0.521) , 987px 89px 0 0px rgba(255,255,255, 0.269) , 1661px 229px 0 0px rgba(255,255,255, 0.95) , 940px 453px 0 0px rgba(255,255,255, 0.963) , 708px 1149px 0 0px rgba(255,255,255, 0.136) , 1485px 853px 0 0px rgba(255,255,255, 0.616) , 1142px 1329px 0 0px rgba(255,255,255, 0.431) , 1637px 1643px 0 0px rgba(255,255,255, 0.229) , 43px 400px 0 0px rgba(255,255,255, 0.439) , 258px 480px 0 0px rgba(255,255,255, 0.859) , 897px 689px 0 0px rgba(255,255,255, 0.887) , 1759px 90px 0 0px rgba(255,255,255, 0.997) , 1787px 1771px 0 0px rgba(255,255,255, 0.401) , 1716px 1375px 0 0px rgba(255,255,255, 0.055) , 603px 522px 0 0px rgba(255,255,255, 0.573) , 1678px 795px 0 0px rgba(255,255,255, 0.917) , 221px 1516px 0 0px rgba(255,255,255, 0.757) , 1464px 1046px 0 0px rgba(255,255,255, 0.065) , 1511px 1747px 0 0px rgba(255,255,255, 0.507) , 907px 377px 0 0px rgba(255,255,255, 0.762) , 275px 1384px 0 0px rgba(255,255,255, 0.488) , 451px 1301px 0 0px rgba(255,255,255, 0.562) , 534px 900px 0 0px rgba(255,255,255, 0.323) , 1390px 792px 0 0px rgba(255,255,255, 0.062) , 1308px 673px 0 0px rgba(255,255,255, 0.319) , 1752px 119px 0 0px rgba(255,255,255, 0.187) , 460px 1760px 0 0px rgba(255,255,255, 0.714) , 1211px 903px 0 0px rgba(255,255,255, 0.276) , 1489px 845px 0 0px rgba(255,255,255, 0.628) , 1479px 1601px 0 0px rgba(255,255,255, 0.008) , 408px 1431px 0 0px rgba(255,255,255, 0.712) , 726px 538px 0 0px rgba(255,255,255, 0.904) , 1799px 1505px 0 0px rgba(255,255,255, 0.457) , 678px 803px 0 0px rgba(255,255,255, 0.889) , 1450px 802px 0 0px rgba(255,255,255, 0.26) , 1419px 335px 0 0px rgba(255,255,255, 0.17) , 336px 424px 0 0px rgba(255,255,255, 0.007) , 214px 1404px 0 0px rgba(255,255,255, 0.638) , 205px 399px 0 0px rgba(255,255,255, 0.968) , 268px 65px 0 0px rgba(255,255,255, 0.78) , 22px 1480px 0 0px rgba(255,255,255, 0.6) , 616px 745px 0 0px rgba(255,255,255, 0.037) , 1777px 922px 0 0px rgba(255,255,255, 0.814) , 1450px 920px 0 0px rgba(255,255,255, 0.384) , 872px 678px 0 0px rgba(255,255,255, 0.853) , 105px 1491px 0 0px rgba(255,255,255, 0.78) , 1577px 324px 0 0px rgba(255,255,255, 0.861) , 999px 546px 0 0px rgba(255,255,255, 0.488) , 1137px 80px 0 0px rgba(255,255,255, 0.588) , 161px 141px 0 0px rgba(255,255,255, 0.465) , 782px 559px 0 0px rgba(255,255,255, 0.608) , 377px 1143px 0 0px rgba(255,255,255, 0.213) , 141px 1698px 0 0px rgba(255,255,255, 0.144) , 729px 1757px 0 0px rgba(255,255,255, 0.229) , 1337px 746px 0 0px rgba(255,255,255, 0.943) , 878px 1193px 0 0px rgba(255,255,255, 0.964) , 530px 641px 0 0px rgba(255,255,255, 0.279) , 24px 914px 0 0px rgba(255,255,255, 0.418) , 1539px 874px 0 0px rgba(255,255,255, 0.955) , 930px 297px 0 0px rgba(255,255,255, 0.179) , 1188px 484px 0 0px rgba(255,255,255, 0.153) , 487px 1238px 0 0px rgba(255,255,255, 0.865) , 1559px 101px 0 0px rgba(255,255,255, 0.671) , 1297px 1774px 0 0px rgba(255,255,255, 0.522) , 1781px 502px 0 0px rgba(255,255,255, 0.175) , 1328px 697px 0 0px rgba(255,255,255, 0.859) , 1314px 1515px 0 0px rgba(255,255,255, 0.259) , 1153px 209px 0 0px rgba(255,255,255, 0.301) , 1704px 1205px 0 0px rgba(255,255,255, 0.199) , 1575px 261px 0 0px rgba(255,255,255, 0.734) , 726px 561px 0 0px rgba(255,255,255, 0.98) , 1208px 384px 0 0px rgba(255,255,255, 0.208) , 209px 111px 0 0px rgba(255,255,255, 0.57) , 1352px 1782px 0 0px rgba(255,255,255, 0.937) , 1412px 1382px 0 0px rgba(255,255,255, 0.069) , 1513px 220px 0 0px rgba(255,255,255, 0.626) , 547px 115px 0 0px rgba(255,255,255, 0.092) , 1195px 1368px 0 0px rgba(255,255,255, 0.986) , 314px 417px 0 0px rgba(255,255,255, 0.246) , 1239px 1120px 0 0px rgba(255,255,255, 0.098) , 1558px 284px 0 0px rgba(255,255,255, 0.567) , 50px 606px 0 0px rgba(255,255,255, 0.594) , 638px 812px 0 0px rgba(255,255,255, 0.905) , 369px 1287px 0 0px rgba(255,255,255, 0.934) , 296px 973px 0 0px rgba(255,255,255, 0.632) , 910px 1089px 0 0px rgba(255,255,255, 0.657) , 346px 782px 0 0px rgba(255,255,255, 0.267) , 914px 269px 0 0px rgba(255,255,255, 0.912) , 424px 1377px 0 0px rgba(255,255,255, 0.015) , 1278px 229px 0 0px rgba(255,255,255, 0.982) , 1045px 803px 0 0px rgba(255,255,255, 0.959) , 1272px 503px 0 0px rgba(255,255,255, 0.503) , 699px 1653px 0 0px rgba(255,255,255, 0.045) , 1305px 1555px 0 0px rgba(255,255,255, 0.063) , 705px 431px 0 0px rgba(255,255,255, 0.857) , 1003px 1043px 0 0px rgba(255,255,255, 0.916) , 394px 748px 0 0px rgba(255,255,255, 0.784) , 1287px 745px 0 0px rgba(255,255,255, 0.229) , 187px 1236px 0 0px rgba(255,255,255, 0.871) , 122px 752px 0 0px rgba(255,255,255, 0.147) , 769px 1663px 0 0px rgba(255,255,255, 0.293) , 1563px 811px 0 0px rgba(255,255,255, 0.638) , 1754px 1119px 0 0px rgba(255,255,255, 0.061) , 1269px 705px 0 0px rgba(255,255,255, 0.51) , 1173px 1785px 0 0px rgba(255,255,255, 0.541) , 1238px 36px 0 0px rgba(255,255,255, 0.37) , 846px 1429px 0 0px rgba(255,255,255, 0.39) , 426px 1640px 0 0px rgba(255,255,255, 0.126) , 276px 1197px 0 0px rgba(255,255,255, 0.76) , 1112px 725px 0 0px rgba(255,255,255, 0.336) , 780px 1187px 0 0px rgba(255,255,255, 0.864) , 650px 1738px 0 0px rgba(255,255,255, 0.706) , 405px 1064px 0 0px rgba(255,255,255, 0.663) , 1388px 1188px 0 0px rgba(255,255,255, 0.653) , 330px 17px 0 0px rgba(255,255,255, 0.87) , 942px 1100px 0 0px rgba(255,255,255, 0.153) , 1198px 21px 0 0px rgba(255,255,255, 0.197) , 751px 1523px 0 0px rgba(255,255,255, 0.733) , 690px 756px 0 0px rgba(255,255,255, 0.684) , 850px 1055px 0 0px rgba(255,255,255, 0.032) , 173px 1796px 0 0px rgba(255,255,255, 0.855) , 1052px 683px 0 0px rgba(255,255,255, 0.815) , 1761px 1452px 0 0px rgba(255,255,255, 0.981) , 998px 1360px 0 0px rgba(255,255,255, 0.948) , 1502px 711px 0 0px rgba(255,255,255, 0.18) , 689px 1549px 0 0px rgba(255,255,255, 0.133) , 63px 1492px 0 0px rgba(255,255,255, 0.908) , 232px 1080px 0 0px rgba(255,255,255, 0.845) , 894px 1616px 0 0px rgba(255,255,255, 0.594) , 210px 1067px 0 0px rgba(255,255,255, 0.632) , 674px 865px 0 0px rgba(255,255,255, 0.039) , 140px 1448px 0 0px rgba(255,255,255, 0.739) , 1382px 1510px 0 0px rgba(255,255,255, 0.889) , 279px 1766px 0 0px rgba(255,255,255, 0.642) , 599px 1701px 0 0px rgba(255,255,255, 0.984) , 1615px 697px 0 0px rgba(255,255,255, 0.63) , 1775px 1433px 0 0px rgba(255,255,255, 0.027) , 1771px 684px 0 0px rgba(255,255,255, 0.555) , 345px 600px 0 0px rgba(255,255,255, 0.959) , 821px 236px 0 0px rgba(255,255,255, 0.704) , 691px 1005px 0 0px rgba(255,255,255, 0.371) , 1367px 802px 0 0px rgba(255,255,255, 0.533) , 1708px 1338px 0 0px rgba(255,255,255, 0.999) , 863px 177px 0 0px rgba(255,255,255, 0.249) , 1129px 1480px 0 0px rgba(255,255,255, 0.007) , 430px 776px 0 0px rgba(255,255,255, 0.277) , 525px 1088px 0 0px rgba(255,255,255, 0.51) , 407px 246px 0 0px rgba(255,255,255, 0.912) , 1192px 307px 0 0px rgba(255,255,255, 0.077) , 163px 1070px 0 0px rgba(255,255,255, 0.788) , 713px 1010px 0 0px rgba(255,255,255, 0.672) , 388px 1783px 0 0px rgba(255,255,255, 0.252) , 981px 8px 0 0px rgba(255,255,255, 0.394) , 148px 1541px 0 0px rgba(255,255,255, 0.537) , 1359px 1727px 0 0px rgba(255,255,255, 0.039) , 1333px 1112px 0 0px rgba(255,255,255, 0.883) , 972px 979px 0 0px rgba(255,255,255, 0.93);
  border-radius: 100px;
}
.solar-syst div {
  border-radius: 1000px;
  top: 50%;
  left: 50%;
  position: absolute;
  z-index: 999;
}
.solar-syst div:not(.sun) {
  border: 1px solid rgba(102, 166, 229, 0.12);
}
.solar-syst div:not(.sun):before {
  left: 50%;
  border-radius: 100px;
  content: "";
  position: absolute;
}
.solar-syst div:not(.asteroids-belt):before {
  box-shadow: inset 0 6px 0 -2px rgba(0, 0, 0, 0.25);
}

.sun {
  background: radial-gradient(ellipse at center, #ffd000 1%, #f9b700 39%, #f9b700 39%, #e06317 100%);
  height: 40px;
  width: 40px;
  margin-top: -20px;
  margin-left: -20px;
  background-clip: padding-box;
  border: 0 !important;
  background-position: -28px -103px;
  background-size: 175%;
  box-shadow: 0 0 10px 2px rgba(255, 107, 0, 0.4), 0 0 22px 11px rgba(255, 203, 0, 0.13);
}

.mercury {
  height: 70px;
  width: 70px;
  margin-top: -35px;
  margin-left: -35px;
  -webkit-animation: orb 7.1867343561s linear infinite;
          animation: orb 7.1867343561s linear infinite;
}
.mercury:before {
  height: 4px;
  width: 4px;
  background: #9f5e26;
  margin-top: -2px;
  margin-left: -2px;
}

.venus {
  height: 100px;
  width: 100px;
  margin-top: -50px;
  margin-left: -50px;
  -webkit-animation: orb 18.4555338265s linear infinite;
          animation: orb 18.4555338265s linear infinite;
}
.venus:before {
  height: 8px;
  width: 8px;
  background: #beb768;
  margin-top: -4px;
  margin-left: -4px;
}

.earth {
  height: 145px;
  width: 145px;
  margin-top: -72.5px;
  margin-left: -72.5px;
  -webkit-animation: orb 30s linear infinite;
          animation: orb 30s linear infinite;
}
.earth:before {
  height: 6px;
  width: 6px;
  background: #11abe9;
  margin-top: -3px;
  margin-left: -3px;
}
.earth:after {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 50%;
  top: 0px;
  margin-left: -9px;
  margin-top: -9px;
  border-radius: 100px;
  box-shadow: 0 -10px 0 -8px grey;
  -webkit-animation: orb 2.2440352158s linear infinite;
          animation: orb 2.2440352158s linear infinite;
}

.mars {
  height: 190px;
  width: 190px;
  margin-top: -95px;
  margin-left: -95px;
  -webkit-animation: orb 56.4261314589s linear infinite;
          animation: orb 56.4261314589s linear infinite;
}
.mars:before {
  height: 6px;
  width: 6px;
  background: #cf3921;
  margin-top: -3px;
  margin-left: -3px;
}

.jupiter {
  height: 340px;
  width: 340px;
  margin-top: -170px;
  margin-left: -170px;
  -webkit-animation: orb 355.7228171013s linear infinite;
          animation: orb 355.7228171013s linear infinite;
}
.jupiter:before {
  height: 18px;
  width: 18px;
  background: #c76e2a;
  margin-top: -9px;
  margin-left: -9px;
}

.saturn {
  height: 440px;
  width: 440px;
  margin-top: -220px;
  margin-left: -220px;
  -webkit-animation: orb 882.6952471456s linear infinite;
          animation: orb 882.6952471456s linear infinite;
}
.saturn:before {
  height: 12px;
  width: 12px;
  background: #e7c194;
  margin-top: -6px;
  margin-left: -6px;
}
.saturn:after {
  position: absolute;
  content: "";
  height: 2.34%;
  width: 4.676%;
  left: 50%;
  top: 0px;
  transform: rotateZ(-52deg);
  margin-left: -2.3%;
  margin-top: -1.2%;
  border-radius: 50% 50% 50% 50%;
  box-shadow: 0 1px 0 1px #987641, 3px 1px 0 #987641, -3px 1px 0 #987641;
  -webkit-animation: orb 882.6952471456s linear infinite;
          animation: orb 882.6952471456s linear infinite;
  animation-direction: reverse;
  transform-origin: 52% 60%;
}

.uranus {
  height: 520px;
  width: 520px;
  margin-top: -260px;
  margin-left: -260px;
  -webkit-animation: orb 2512.4001967933s linear infinite;
          animation: orb 2512.4001967933s linear infinite;
}
.uranus:before {
  height: 10px;
  width: 10px;
  background: #b5e3e3;
  margin-top: -5px;
  margin-left: -5px;
}

.neptune {
  height: 630px;
  width: 630px;
  margin-top: -315px;
  margin-left: -315px;
  -webkit-animation: orb 4911.7838624549s linear infinite;
          animation: orb 4911.7838624549s linear infinite;
}
.neptune:before {
  height: 10px;
  width: 10px;
  background: #175e9e;
  margin-top: -5px;
  margin-left: -5px;
}

.asteroids-belt {
  opacity: 0.7;
  border-color: transparent !important;
  height: 300px;
  width: 300px;
  margin-top: -150px;
  margin-left: -150px;
  -webkit-animation: orb 179.9558282773s linear infinite;
          animation: orb 179.9558282773s linear infinite;
  overflow: hidden;
}
.asteroids-belt:before {
  top: 50%;
  height: 210px;
  width: 210px;
  margin-left: -105px;
  margin-top: -105px;
  background: transparent;
  border-radius: 140px !important;
  box-shadow: 83px -30px 0 -104px rgba(255, 255, 255, 0.721) , -13px 14px 0 -104px rgba(255,255,255, 0.628) , -70px -59px 0 -104px rgba(255,255,255, 0.356) , -45px -84px 0 -104px rgba(255,255,255, 0.49) , -52px 105px 0 -104px rgba(255,255,255, 0.31) , -121px 71px 0 -104px rgba(255,255,255, 0.911) , -22px 1px 0 -104px rgba(255,255,255, 0.717) , -24px 87px 0 -104px rgba(255,255,255, 0.237) , 142px -64px 0 -104px rgba(255,255,255, 0.507) , 116px -24px 0 -104px rgba(255,255,255, 0.916) , 115px 86px 0 -104px rgba(255,255,255, 0.727) , -95px 109px 0 -104px rgba(255,255,255, 0.539) , 52px 144px 0 -104px rgba(255,255,255, 0.852) , 50px -102px 0 -104px rgba(255,255,255, 0.17) , 68px 51px 0 -104px rgba(255,255,255, 0.117) , -41px 115px 0 -104px rgba(255,255,255, 0.019) , 46px -142px 0 -104px rgba(255,255,255, 0.507) , 134px 70px 0 -104px rgba(255,255,255, 0.56) , -71px -97px 0 -104px rgba(255,255,255, 0.057) , -83px 80px 0 -104px rgba(255,255,255, 0.885) , -13px 8px 0 -104px rgba(255,255,255, 0.737) , 66px -125px 0 -104px rgba(255,255,255, 0.11) , 93px 67px 0 -104px rgba(255,255,255, 0.938) , 74px -113px 0 -104px rgba(255,255,255, 0.723) , 105px 139px 0 -104px rgba(255,255,255, 0.352) , 23px 47px 0 -104px rgba(255,255,255, 0.008) , -57px -16px 0 -104px rgba(255,255,255, 0.084) , 84px -89px 0 -104px rgba(255,255,255, 0.34) , -44px -131px 0 -104px rgba(255,255,255, 0.009) , 69px -80px 0 -104px rgba(255,255,255, 0.445) , -112px -129px 0 -104px rgba(255,255,255, 0.259) , -140px -78px 0 -104px rgba(255,255,255, 0.161) , 108px -57px 0 -104px rgba(255,255,255, 0.657) , -65px -126px 0 -104px rgba(255,255,255, 0.626) , 38px 49px 0 -104px rgba(255,255,255, 0.644) , -109px 6px 0 -104px rgba(255,255,255, 0.84) , -103px 51px 0 -104px rgba(255,255,255, 0.331) , -111px 22px 0 -104px rgba(255,255,255, 0.641) , 68px 0px 0 -104px rgba(255,255,255, 0.241) , 77px 105px 0 -104px rgba(255,255,255, 0.445) , 67px 60px 0 -104px rgba(255,255,255, 0.388) , -108px -115px 0 -104px rgba(255,255,255, 0.028) , 134px -15px 0 -104px rgba(255,255,255, 0.61) , -68px -3px 0 -104px rgba(255,255,255, 0.087) , 83px 52px 0 -104px rgba(255,255,255, 0.647) , -16px -35px 0 -104px rgba(255,255,255, 0.255) , -95px 86px 0 -104px rgba(255,255,255, 0.361) , 75px -120px 0 -104px rgba(255,255,255, 0.899) , -17px -19px 0 -104px rgba(255,255,255, 0.468) , 88px 123px 0 -104px rgba(255,255,255, 0.771) , 81px -121px 0 -104px rgba(255,255,255, 0.419) , -56px -22px 0 -104px rgba(255,255,255, 0.498) , -19px 129px 0 -104px rgba(255,255,255, 0.169) , -113px -45px 0 -104px rgba(255,255,255, 0.72) , 37px 29px 0 -104px rgba(255,255,255, 0.554) , 23px -82px 0 -104px rgba(255,255,255, 0.632) , -22px -103px 0 -104px rgba(255,255,255, 0.846) , 106px 120px 0 -104px rgba(255,255,255, 0.311) , -109px 129px 0 -104px rgba(255,255,255, 0.229) , -134px -85px 0 -104px rgba(255,255,255, 0.027) , -126px 138px 0 -104px rgba(255,255,255, 0.458) , -120px -119px 0 -104px rgba(255,255,255, 0.235) , -24px -34px 0 -104px rgba(255,255,255, 0.047) , 39px -100px 0 -104px rgba(255,255,255, 0.22) , 4px -129px 0 -104px rgba(255,255,255, 0.903) , -57px -60px 0 -104px rgba(255,255,255, 0.751) , -139px 16px 0 -104px rgba(255,255,255, 0.012) , 75px 132px 0 -104px rgba(255,255,255, 0.03) , 128px -52px 0 -104px rgba(255,255,255, 0.436) , 39px -72px 0 -104px rgba(255,255,255, 0.727) , 15px 4px 0 -104px rgba(255,255,255, 0.301) , -32px -1px 0 -104px rgba(255,255,255, 0.817) , 119px -130px 0 -104px rgba(255,255,255, 0.039) , 102px -5px 0 -104px rgba(255,255,255, 0.339) , 41px -1px 0 -104px rgba(255,255,255, 0.519) , -23px -117px 0 -104px rgba(255,255,255, 0.962) , 1px -120px 0 -104px rgba(255,255,255, 0.226) , -144px 113px 0 -104px rgba(255,255,255, 0.887) , -46px 101px 0 -104px rgba(255,255,255, 0.017) , -143px 69px 0 -104px rgba(255,255,255, 0.799) , -114px 145px 0 -104px rgba(255,255,255, 0.15) , 75px -124px 0 -104px rgba(255,255,255, 0.831) , -134px 143px 0 -104px rgba(255,255,255, 0.194) , -102px 129px 0 -104px rgba(255,255,255, 0.316) , 135px -49px 0 -104px rgba(255,255,255, 0.173) , 102px 40px 0 -104px rgba(255,255,255, 0.868) , -17px 23px 0 -104px rgba(255,255,255, 0.064) , 139px -75px 0 -104px rgba(255,255,255, 0.729) , 66px 80px 0 -104px rgba(255,255,255, 0.486) , -110px 92px 0 -104px rgba(255,255,255, 0.916) , 4px -94px 0 -104px rgba(255,255,255, 0.366) , -116px 111px 0 -104px rgba(255,255,255, 0.823) , -111px -45px 0 -104px rgba(255,255,255, 0.626) , 69px -99px 0 -104px rgba(255,255,255, 0.024) , 57px 65px 0 -104px rgba(255,255,255, 0.498) , -69px -115px 0 -104px rgba(255,255,255, 0.54) , -55px 145px 0 -104px rgba(255,255,255, 0.492) , -8px -46px 0 -104px rgba(255,255,255, 0.517) , -98px 51px 0 -104px rgba(255,255,255, 0.018) , -16px -118px 0 -104px rgba(255,255,255, 0.865) , -109px 141px 0 -104px rgba(255,255,255, 0.024) , -81px 38px 0 -104px rgba(255,255,255, 0.465) , -120px -86px 0 -104px rgba(255,255,255, 0.618) , 0px 16px 0 -104px rgba(255,255,255, 0.444) , 40px 79px 0 -104px rgba(255,255,255, 0.339) , -114px 29px 0 -104px rgba(255,255,255, 0.014) , -45px 38px 0 -104px rgba(255,255,255, 0.921) , 123px -135px 0 -104px rgba(255,255,255, 0.235) , 72px 96px 0 -104px rgba(255,255,255, 0.565) , -84px 1px 0 -104px rgba(255,255,255, 0.893) , -61px 60px 0 -104px rgba(255,255,255, 0.69) , 23px 79px 0 -104px rgba(255,255,255, 0.779) , -96px 49px 0 -104px rgba(255,255,255, 0.783) , 20px -61px 0 -104px rgba(255,255,255, 0.7) , -11px -34px 0 -104px rgba(255,255,255, 0.955) , -52px -130px 0 -104px rgba(255,255,255, 0.066) , -99px 30px 0 -104px rgba(255,255,255, 0.879) , -10px -75px 0 -104px rgba(255,255,255, 0.354) , -115px 85px 0 -104px rgba(255,255,255, 0.029) , -121px 91px 0 -104px rgba(255,255,255, 0.937) , 10px -71px 0 -104px rgba(255,255,255, 0.895) , -87px 9px 0 -104px rgba(255,255,255, 0.771) , 9px 88px 0 -104px rgba(255,255,255, 0.721) , 42px -73px 0 -104px rgba(255,255,255, 0.638) , -87px 29px 0 -104px rgba(255,255,255, 0.973) , 44px -36px 0 -104px rgba(255,255,255, 0.579) , -139px -66px 0 -104px rgba(255,255,255, 0.297) , -98px -50px 0 -104px rgba(255,255,255, 0.816) , 102px 21px 0 -104px rgba(255,255,255, 0.635) , -7px 72px 0 -104px rgba(255,255,255, 0.955) , -80px 120px 0 -104px rgba(255,255,255, 0.067) , 74px -31px 0 -104px rgba(255,255,255, 0.368) , 7px 46px 0 -104px rgba(255,255,255, 0.898) , 42px -141px 0 -104px rgba(255,255,255, 0.275) , 134px -101px 0 -104px rgba(255,255,255, 0.411) , 99px -13px 0 -104px rgba(255,255,255, 0.3) , -36px -73px 0 -104px rgba(255,255,255, 0.209) , -78px 14px 0 -104px rgba(255,255,255, 0.488) , 35px -86px 0 -104px rgba(255,255,255, 0.45) , -38px 118px 0 -104px rgba(255,255,255, 0.497) , 36px -110px 0 -104px rgba(255,255,255, 0.631) , 44px -2px 0 -104px rgba(255,255,255, 0.16) , 10px -24px 0 -104px rgba(255,255,255, 0.413) , -12px -143px 0 -104px rgba(255,255,255, 0.578) , -88px 23px 0 -104px rgba(255,255,255, 0.938) , -88px -20px 0 -104px rgba(255,255,255, 0.773) , -39px -42px 0 -104px rgba(255,255,255, 0.988) , -133px 132px 0 -104px rgba(255,255,255, 0.378) , -31px -26px 0 -104px rgba(255,255,255, 0.237) , 43px -71px 0 -104px rgba(255,255,255, 0.222) , -98px 79px 0 -104px rgba(255,255,255, 0.261) , 82px 1px 0 -104px rgba(255,255,255, 0.856) , -56px -9px 0 -104px rgba(255,255,255, 0.731) , 111px -84px 0 -104px rgba(255,255,255, 0.148) , 88px -17px 0 -104px rgba(255,255,255, 0.751) , 46px -22px 0 -104px rgba(255,255,255, 0.729) , 33px 20px 0 -104px rgba(255,255,255, 0.018) , 60px -83px 0 -104px rgba(255,255,255, 0.31) , -85px 62px 0 -104px rgba(255,255,255, 0.87) , 17px -130px 0 -104px rgba(255,255,255, 0.794) , 55px 134px 0 -104px rgba(255,255,255, 0.224) , -20px -131px 0 -104px rgba(255,255,255, 0.178) , 17px 88px 0 -104px rgba(255,255,255, 0.25) , 90px 86px 0 -104px rgba(255,255,255, 0.265) , 143px 88px 0 -104px rgba(255,255,255, 0.492) , 145px -1px 0 -104px rgba(255,255,255, 0.225) , 138px 5px 0 -104px rgba(255,255,255, 0.976) , -133px -95px 0 -104px rgba(255,255,255, 0.815) , 126px 6px 0 -104px rgba(255,255,255, 0.886) , 20px 30px 0 -104px rgba(255,255,255, 0.803) , -35px 125px 0 -104px rgba(255,255,255, 0.431) , -41px 23px 0 -104px rgba(255,255,255, 0.753) , 127px -48px 0 -104px rgba(255,255,255, 0.877) , 61px 89px 0 -104px rgba(255,255,255, 0.265) , -80px 3px 0 -104px rgba(255,255,255, 0.754) , -57px 95px 0 -104px rgba(255,255,255, 0.898) , 45px -91px 0 -104px rgba(255,255,255, 0.849) , 51px 61px 0 -104px rgba(255,255,255, 0.156) , 34px 132px 0 -104px rgba(255,255,255, 0.244) , 111px -27px 0 -104px rgba(255,255,255, 0.173) , 50px -92px 0 -104px rgba(255,255,255, 0.69) , 18px 14px 0 -104px rgba(255,255,255, 0.187) , 52px 91px 0 -104px rgba(255,255,255, 0.609) , 23px -57px 0 -104px rgba(255,255,255, 0.87) , 142px -93px 0 -104px rgba(255,255,255, 0.065) , 13px 15px 0 -104px rgba(255,255,255, 0.02) , -103px -114px 0 -104px rgba(255,255,255, 0.662) , 139px 71px 0 -104px rgba(255,255,255, 0.095) , -143px -100px 0 -104px rgba(255,255,255, 0.685) , 108px 100px 0 -104px rgba(255,255,255, 0.674) , 4px 14px 0 -104px rgba(255,255,255, 0.226) , -6px 28px 0 -104px rgba(255,255,255, 0.629) , -59px -86px 0 -104px rgba(255,255,255, 0.228) , 45px 84px 0 -104px rgba(255,255,255, 0.568) , 143px -104px 0 -104px rgba(255,255,255, 0.862) , -6px -121px 0 -104px rgba(255,255,255, 0.167) , -128px 37px 0 -104px rgba(255,255,255, 0.138) , 94px -77px 0 -104px rgba(255,255,255, 0.812) , -82px -53px 0 -104px rgba(255,255,255, 0.033) , -51px 103px 0 -104px rgba(255,255,255, 0.003) , 22px -122px 0 -104px rgba(255,255,255, 0.406) , -80px 81px 0 -104px rgba(255,255,255, 0.541) , -48px -115px 0 -104px rgba(255,255,255, 0.49) , 119px 97px 0 -104px rgba(255,255,255, 0.896) , 87px -96px 0 -104px rgba(255,255,255, 0.167) , 94px 27px 0 -104px rgba(255,255,255, 0.317) , 135px 50px 0 -104px rgba(255,255,255, 0.152) , -104px -32px 0 -104px rgba(255,255,255, 0.402) , -55px -144px 0 -104px rgba(255,255,255, 0.663) , 100px 57px 0 -104px rgba(255,255,255, 0.01) , 85px 74px 0 -104px rgba(255,255,255, 0.875) , -22px -123px 0 -104px rgba(255,255,255, 0.919) , -128px -23px 0 -104px rgba(255,255,255, 0.78) , 113px 133px 0 -104px rgba(255,255,255, 0.019) , -1px -96px 0 -104px rgba(255,255,255, 0.947) , -65px 114px 0 -104px rgba(255,255,255, 0.71) , -137px -121px 0 -104px rgba(255,255,255, 0.227) , -35px 80px 0 -104px rgba(255,255,255, 0.347) , -33px 118px 0 -104px rgba(255,255,255, 0.507) , -47px -68px 0 -104px rgba(255,255,255, 0.53) , -11px 135px 0 -104px rgba(255,255,255, 0.971) , -24px -18px 0 -104px rgba(255,255,255, 0.489) , -62px 143px 0 -104px rgba(255,255,255, 0.298) , 107px 60px 0 -104px rgba(255,255,255, 0.253) , 82px -17px 0 -104px rgba(255,255,255, 0.711) , 136px -7px 0 -104px rgba(255,255,255, 0.778) , -58px -92px 0 -104px rgba(255,255,255, 0.783) , -90px 24px 0 -104px rgba(255,255,255, 0.075) , -108px -21px 0 -104px rgba(255,255,255, 0.473) , 75px 104px 0 -104px rgba(255,255,255, 0.056) , 10px 24px 0 -104px rgba(255,255,255, 0.887) , 112px -137px 0 -104px rgba(255,255,255, 0.643) , -85px -69px 0 -104px rgba(255,255,255, 0.307) , -87px -55px 0 -104px rgba(255,255,255, 0.404) , 109px -56px 0 -104px rgba(255,255,255, 0.433) , -95px 74px 0 -104px rgba(255,255,255, 0.678) , 41px 65px 0 -104px rgba(255,255,255, 0.047) , 44px 28px 0 -104px rgba(255,255,255, 0.019) , 86px -130px 0 -104px rgba(255,255,255, 0.313) , -83px 24px 0 -104px rgba(255,255,255, 0.44) , -50px -78px 0 -104px rgba(255,255,255, 0.607) , 115px 26px 0 -104px rgba(255,255,255, 0.362) , -83px 98px 0 -104px rgba(255,255,255, 0.639) , 37px 8px 0 -104px rgba(255,255,255, 0.443) , 87px 12px 0 -104px rgba(255,255,255, 0.423) , -15px 62px 0 -104px rgba(255,255,255, 0.766) , -51px 145px 0 -104px rgba(255,255,255, 0.942) , -55px 14px 0 -104px rgba(255,255,255, 0.749) , 106px -102px 0 -104px rgba(255,255,255, 0.124) , -85px -41px 0 -104px rgba(255,255,255, 0.677) , -139px 124px 0 -104px rgba(255,255,255, 0.224) , -41px -132px 0 -104px rgba(255,255,255, 0.593) , -58px -86px 0 -104px rgba(255,255,255, 0.85) , 42px 95px 0 -104px rgba(255,255,255, 0.554) , -70px -74px 0 -104px rgba(255,255,255, 0.941) , -70px -82px 0 -104px rgba(255,255,255, 0.27) , 132px 43px 0 -104px rgba(255,255,255, 0.803) , -24px -81px 0 -104px rgba(255,255,255, 0.072) , -86px 101px 0 -104px rgba(255,255,255, 0.703) , 15px 37px 0 -104px rgba(255,255,255, 0.254) , -65px -141px 0 -104px rgba(255,255,255, 0.599) , -143px -82px 0 -104px rgba(255,255,255, 0.809) , 113px 25px 0 -104px rgba(255,255,255, 0.116) , -89px 39px 0 -104px rgba(255,255,255, 0.448) , 14px -40px 0 -104px rgba(255,255,255, 0.625) , 44px -67px 0 -104px rgba(255,255,255, 0.751) , 47px 108px 0 -104px rgba(255,255,255, 0.962) , -24px 140px 0 -104px rgba(255,255,255, 0.971) , 58px -5px 0 -104px rgba(255,255,255, 0.259) , 116px -134px 0 -104px rgba(255,255,255, 0.356) , -127px 125px 0 -104px rgba(255,255,255, 0.631) , 93px -137px 0 -104px rgba(255,255,255, 0.611) , -93px 33px 0 -104px rgba(255,255,255, 0.277) , -124px -90px 0 -104px rgba(255,255,255, 0.709) , -81px -122px 0 -104px rgba(255,255,255, 0.361) , 58px -144px 0 -104px rgba(255,255,255, 0.388) , -126px 4px 0 -104px rgba(255,255,255, 0.802) , 117px -106px 0 -104px rgba(255,255,255, 0.866) , 70px -118px 0 -104px rgba(255,255,255, 0.982) , -114px -65px 0 -104px rgba(255,255,255, 0.976) , 105px 72px 0 -104px rgba(255,255,255, 0.919) , -79px 65px 0 -104px rgba(255,255,255, 0.716) , 51px -26px 0 -104px rgba(255,255,255, 0.418) , 63px -47px 0 -104px rgba(255,255,255, 0.927) , 46px 90px 0 -104px rgba(255,255,255, 0.356) , -48px -21px 0 -104px rgba(255,255,255, 0.84) , 30px 41px 0 -104px rgba(255,255,255, 0.48) , 102px -18px 0 -104px rgba(255,255,255, 0.919) , 114px -136px 0 -104px rgba(255,255,255, 0.85) , 137px 11px 0 -104px rgba(255,255,255, 0.728) , -71px -45px 0 -104px rgba(255,255,255, 0.153) , -9px -45px 0 -104px rgba(255,255,255, 0.036) , -113px 87px 0 -104px rgba(255,255,255, 0.353) , -78px -141px 0 -104px rgba(255,255,255, 0.843) , 50px 6px 0 -104px rgba(255,255,255, 0.956) , 66px -44px 0 -104px rgba(255,255,255, 0.409) , -22px 115px 0 -104px rgba(255,255,255, 0.496) , -92px -40px 0 -104px rgba(255,255,255, 0.899) , 7px 100px 0 -104px rgba(255,255,255, 0.93) , -91px 5px 0 -104px rgba(255,255,255, 0.547) , 11px 74px 0 -104px rgba(255,255,255, 0.605) , 52px -44px 0 -104px rgba(255,255,255, 0.642) , 57px -115px 0 -104px rgba(255,255,255, 0.65) , -48px -38px 0 -104px rgba(255,255,255, 0.022) , 18px 59px 0 -104px rgba(255,255,255, 0.779) , -51px -47px 0 -104px rgba(255,255,255, 0.55) , -4px 94px 0 -104px rgba(255,255,255, 0.525) , 121px 101px 0 -104px rgba(255,255,255, 0.149) , 135px 79px 0 -104px rgba(255,255,255, 0.748) , -49px -33px 0 -104px rgba(255,255,255, 0.596) , -17px -143px 0 -104px rgba(255,255,255, 0.911) , 121px -108px 0 -104px rgba(255,255,255, 0.814) , -25px 134px 0 -104px rgba(255,255,255, 0.565) , -8px 37px 0 -104px rgba(255,255,255, 0.926) , -6px -136px 0 -104px rgba(255,255,255, 0.8) , 121px 83px 0 -104px rgba(255,255,255, 0.197) , 65px -17px 0 -104px rgba(255,255,255, 0.53) , -85px 87px 0 -104px rgba(255,255,255, 0.85) , 53px -91px 0 -104px rgba(255,255,255, 0.285) , 49px 103px 0 -104px rgba(255,255,255, 0.306) , 3px -50px 0 -104px rgba(255,255,255, 0.288) , 42px 106px 0 -104px rgba(255,255,255, 0.475) , 34px 25px 0 -104px rgba(255,255,255, 0.048) , -83px -62px 0 -104px rgba(255,255,255, 0.895) , -58px 29px 0 -104px rgba(255,255,255, 0.663) , 14px -25px 0 -104px rgba(255,255,255, 0.934) , 111px 8px 0 -104px rgba(255,255,255, 0.751) , -19px -95px 0 -104px rgba(255,255,255, 0.129) , -49px -79px 0 -104px rgba(255,255,255, 0.525) , -126px -30px 0 -104px rgba(255,255,255, 0.927) , 82px -61px 0 -104px rgba(255,255,255, 0.084) , 84px -87px 0 -104px rgba(255,255,255, 0.797) , 82px -66px 0 -104px rgba(255,255,255, 0.229) , 92px 35px 0 -104px rgba(255,255,255, 0.697) , 45px -7px 0 -104px rgba(255,255,255, 0.3) , -139px 60px 0 -104px rgba(255,255,255, 0.135) , -39px -129px 0 -104px rgba(255,255,255, 0.868) , 85px -62px 0 -104px rgba(255,255,255, 0.33) , -101px -79px 0 -104px rgba(255,255,255, 0.011) , 12px -104px 0 -104px rgba(255,255,255, 0.755) , 97px 62px 0 -104px rgba(255,255,255, 0.367) , -11px -104px 0 -104px rgba(255,255,255, 0.769) , 117px -76px 0 -104px rgba(255,255,255, 0.393) , -81px 128px 0 -104px rgba(255,255,255, 0.819) , 141px -34px 0 -104px rgba(255,255,255, 0.139) , -1px 145px 0 -104px rgba(255,255,255, 0.585) , 0px 38px 0 -104px rgba(255,255,255, 0.88) , -45px 27px 0 -104px rgba(255,255,255, 0.072) , 100px -9px 0 -104px rgba(255,255,255, 0.976) , 88px -131px 0 -104px rgba(255,255,255, 0.027) , 54px -69px 0 -104px rgba(255,255,255, 0.637) , 105px 12px 0 -104px rgba(255,255,255, 0.666) , 130px -32px 0 -104px rgba(255,255,255, 0.421) , -116px -52px 0 -104px rgba(255,255,255, 0.284) , 109px 29px 0 -104px rgba(255,255,255, 0.706) , 108px -42px 0 -104px rgba(255,255,255, 0.723) , -76px 13px 0 -104px rgba(255,255,255, 0.966) , -116px 5px 0 -104px rgba(255,255,255, 0.772) , -120px -140px 0 -104px rgba(255,255,255, 0.773) , 93px -103px 0 -104px rgba(255,255,255, 0.523) , 70px 73px 0 -104px rgba(255,255,255, 0.901) , 14px -144px 0 -104px rgba(255,255,255, 0.643) , 19px 80px 0 -104px rgba(255,255,255, 0.5) , 131px -40px 0 -104px rgba(255,255,255, 0.052) , -5px 114px 0 -104px rgba(255,255,255, 0.985) , 78px -89px 0 -104px rgba(255,255,255, 0.781) , -15px -29px 0 -104px rgba(255,255,255, 0.986) , -32px -91px 0 -104px rgba(255,255,255, 0.406) , 137px -106px 0 -104px rgba(255,255,255, 0.608) , 50px 116px 0 -104px rgba(255,255,255, 0.331) , -52px -108px 0 -104px rgba(255,255,255, 0.636) , -108px -55px 0 -104px rgba(255,255,255, 0.547) , -48px 10px 0 -104px rgba(255,255,255, 0.421) , 131px 81px 0 -104px rgba(255,255,255, 0.104) , 116px -127px 0 -104px rgba(255,255,255, 0.685) , -118px 138px 0 -104px rgba(255,255,255, 0.022) , -57px -45px 0 -104px rgba(255,255,255, 0.15) , -127px 37px 0 -104px rgba(255,255,255, 0.161) , 52px 13px 0 -104px rgba(255,255,255, 0.163) , 3px -112px 0 -104px rgba(255,255,255, 0.785) , -66px 90px 0 -104px rgba(255,255,255, 0.357) , 127px -33px 0 -104px rgba(255,255,255, 0.096) , 71px -125px 0 -104px rgba(255,255,255, 0.798) , -112px -143px 0 -104px rgba(255,255,255, 0.656) , 9px 118px 0 -104px rgba(255,255,255, 0.083) , 119px -56px 0 -104px rgba(255,255,255, 0.42) , -90px 94px 0 -104px rgba(255,255,255, 0.91) , 118px 6px 0 -104px rgba(255,255,255, 0.473) , -110px -130px 0 -104px rgba(255,255,255, 0.663) , 135px 61px 0 -104px rgba(255,255,255, 0.44);
}

.pluto {
  height: 780px;
  width: 780px;
  margin-top: -450px;
  margin-left: -320px;
  -webkit-animation: orb 7439.7074054575s linear infinite;
          animation: orb 7439.7074054575s linear infinite;
}
.pluto:before {
  height: 3px;
  width: 3px;
  background: #fff;
  margin-top: -1.5px;
  margin-left: -1.5px;
}

.hide {
  display: none;
}

.links {
  margin-top: 5px !important;
  font-size: 1em !important;
}

@-webkit-keyframes orb {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes orb {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

</style>
