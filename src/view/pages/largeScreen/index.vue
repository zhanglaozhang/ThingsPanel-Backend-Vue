<template>
  <dv-full-screen-container class="dv-fullscreen">
    <div style="width: 100%; height: 100%; position: relative">
      <div class="header1">
        <div class="font">物联网中台大屏</div>
      </div>
      <!-- 地图 -->
      <div id="map" class="map"></div>
      <div class="contentOne">
        <div class="contentLeft">
          <div class="title">设备统计</div>
          <div class="ds" id="ds" ref="echarts1Left"></div>
        </div>
      </div>
      <div class="contentOne">
        <div class="contentLeft">
          <div class="title">消息数量统计</div>
          <div class="numMessage" ref="echarts2Left"></div>
        </div>
      </div>
      <div class="contentOne">
        <div class="contentLeft">
          <div class="title">产品统计</div>
          <dv-scroll-board
            :config="config"
            style="margin-top: 15px; height: 230px"
          />
        </div>
      </div>
      <div class="rightContent">
        <div class="rightOne">
          <div class="titleRight">状态统计</div>
          <div class="status" id="ds" ref="echarts3Left"></div>
        </div>
      </div>
      <div class="rightContent">
        <div class="rightOne">
          <div class="titleRight">设备统计</div>
          <dv-scroll-board
            :config="deviceStatisticsInfo"
            style="margin-top: 15px; height: 230px"
          />
        </div>
      </div>
      <div class="rightContent">
        <div class="rightOne">
          <div class="titleRight">预警日志</div>
          <div class="tabel">
            <dv-scroll-board
              :config="config"
              style="margin-top: 15px; height: 230px"
            />
          </div>
        </div>
      </div>
      <div class="bottom">
        <div style="margin: -5px 26px 0 0px; cursor: pointer">
          <img
            src="../../../../public/media/largeScreen/lastPage.png"
            alt=""
            srcset=""
          />
        </div>

        <div
          class="one"
          :class="{ two: index === number }"
          @click="handlerClick(index)"
          v-for="(item, index) in trees"
          :key="index"
        >
          <p class="text">{{ item.model_name }}</p>
        </div>
        <div style="margin: -5px 0px 0 26px; cursor: pointer">
          <img
            src="../../../../public/media/largeScreen/nextPage.png"
            alt=""
            srcset=""
          />
        </div>
      </div>
      <div class="Legend">
        <div
        @click="handlerClickTree(item)"
          v-for="(item, index) in data"
          :key="index"
          style="
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            margin-top: 16px;
            width: 100px;
            height: 12px;
          "
        >
          <div class="oneLegend"></div>
          <p class="equipment1">{{ item.name }}</p>
        </div>
      </div>
    </div>
  </dv-full-screen-container>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.pm";
import "leaflet.pm/dist/leaflet.pm.css";
import largeScreenApi from "@/api/largeScreen/largeScreen.js";
import "@/core/mixins/common";

export default {
  name: "ThingsPanelBackendVueIndex",

  data() {
    return {
      data: [],
      deviceStatisticsInfo: {
        rowNum: 0,
        header: [],
        headerBGC: "",
        evenRowBGC: "",
        oddRowBGC: "",
        data: [],
        align: ["center", "center", "center", "center"],
      },
      config: {
        rowNum: 0,
        header: [],
        headerBGC: "",
        evenRowBGC: "",
        oddRowBGC: "",
        data: [],
        align: [],
      },
      number: 0,
      trees: [],
      fScreen: 0,
    };
  },

  mounted() {
    setTimeout(() => {
      this.createMap();
    }, 10);
    this.devStatistics();
    this.warningTabel();
    this.numMessaes();
    this.status();
    this.handlerStatistics();
    // this.handlerFullscreen();
    this.handlerTree();
    this.handlerClickTree({});
  },

  methods: {
    createMap() {
      let map = L.map("map", {
        center: [35.25, 102.55], // 中心位置
        zoom: 4, // 缩放等级
        attributionControl: false, // 版权控件
        zoomControl: false, //缩放控件
      });
      this.map = map; // data上需要挂载
      L.tileLayer(
        "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China/zxyTileImage.png?z={z}&x={x}&y={y}"
      ).addTo(this.map); // 加载底图
    },
    // 设备统计echarts
    devStatistics() {
      largeScreenApi.list().then((res) => {
        const data = res.data.data;

        let datas = data.map((item) => {
          return { value: item.Gross, name: item.ModelName };
        });
        this.data = datas;
        const echartsContainer = document.getElementById("ds");
        var myChart = this.$echarts.init(echartsContainer);
        myChart.setOption({
          title: {
            text: `接入设备总数：${res.data.totalCount}`,
            top: 20,
            left: "center",
            textStyle: {
              color: "#fff",
              fontSize: "24",
            },
          },
          tooltip: {
            show: true,
          },
          legend: {
            itemGap: 23,
            orient: "vertical",
            right: "10%",
            top: "25%",
            itemHeight: 6,
            itemWidth: 16,
            textStyle: {
              color: "#fff",
            },
          },
          series: [
            {
              type: "pie",
              radius: ["30%", "50%"],
              center: ["20%", "50%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
              },
              emphasis: {
                label: {
                  show: false,
                  fontSize: 14,
                  textStyle: {
                    color: "#FFF",
                  },
                },
              },
              data: datas,
            },
          ],
        });
      });
    },
    // 消息数量统计
    numMessaes() {
      largeScreenApi.deviceMessage().then((res) => {
        console.log(res);
        const data = res.data.map((item) => {
          return {
            symbol: "none",
            name: item.ModelName,
            type: "line",
            stack: "Total",
            smooth: true,
            data: [
              item.Count3Days,
              item.Count6Days,
              item.Count9Days,
              item.Count12Days,
              item.Count15Days,
              item.Count18Days,
              item.Count21Days,
              item.Count24Days,
              item.Count27Days,
              item.Count30Days,
            ],
          };
        });
        console.log(data);
        var myChart = this.$echarts.init(this.$refs.echarts2Left);
        myChart.setOption({
          color: ["#009CF2", "#57EC64", "#E8D931", "#D4743C", "#095CCD"],
          tooltip: {
            trigger: "axis",
          },
          legend: {
            itemGap: 20,
            itemHeight: 6,
            itemWidth: 16,
            data: [
              { name: data[0].name, icon: "rect" },
              { name: data[1].name, icon: "rect" },
              { name: data[2].name, icon: "rect" },
              { name: data[3].name, icon: "rect" },
            ],
            textStyle: {
              color: "#fff",
            },
            left: "5%",
            top: 20,
          },
          xAxis: {
            type: "category",
            data: [
              "3日",
              "6日",
              "9日",
              "12日",
              "15日",
              "18日",
              "21日",
              "24日",
              "27日",
              "30日",
            ],
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                color: "#fff",
              },
            },
            axisLine: {
              lineStyle: {
                color: "#1a3d98",
              },
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: "value",
            boundaryGap: false,
            axisLabel: {
              textStyle: {
                color: "#fff",
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#1A3D98",
              },
            },
          },
          series: data,
        });
      });
    },
    // 状态统计
    status() {
      largeScreenApi.deviceStatus().then((res) => {
        let statusList = res.data.map((item) => {
          return {
            product: item.ModelName,
            在线: item.SysOnlineCount,
            离线: item.SysOfflineCount,
          };
        });
        var myChart = this.$echarts.init(this.$refs.echarts3Left);
        myChart.setOption({
          legend: {
            itemHeight: 6,
            itemWidth: 16,
            left: "center",
            top: "20",
            textStyle: {
              color: "#fff",
            },
          },
          tooltip: {},
          textStyle: {
            color: "#fff",
          },
          dataset: {
            dimensions: ["product", "在线", "离线"],
            source: statusList,
          },
          xAxis: {
            type: "category",
            axisLabel: {
              interval: 0,
            },
            axisLine: {
              lineStyle: {
                color: "#1a3d98",
              },
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            splitLine: {
              show: true,
              lineStyle: {
                color: "#1A3D98",
              },
            },
          },
          series: [
            {
              type: "bar",
              barWidth: "12",
              barGap: 1,
              itemStyle: {
                barBorderRadius: [10, 10, 0, 0],
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    //代表渐变色从正上方开始
                    offset: 0.1, //offset范围是0~1，用于表示位置，0是指0%处的颜色
                    color: "rgba(87, 236, 100, 1)",
                  }, //柱图渐变色
                  {
                    offset: 1, //指100%处的颜色
                    color: "rgba(87, 236, 100, 0.10)",
                  },
                ]),
              },
            },
            {
              type: "bar",
              barWidth: "12",
              itemStyle: {
                barBorderRadius: [10, 10, 0, 0],
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    //代表渐变色从正上方开始
                    offset: 0.1, //offset范围是0~1，用于表示位置，0是指0%处的颜色
                    color: "rgba(153, 153, 153,1)",
                  }, //柱图渐变色
                  {
                    offset: 1, //指100%处的颜色
                    color: "rgba(153, 153, 153, 0.10)",
                  },
                ]),
              },
            },
          ],
        });
      });
    },
    // 日期格式化
    formatDate(format) {
      var n = parseInt(format) * 1000;
      var D = new Date(n);
      var year = D.getFullYear(); //四位数年份

      var month = D.getMonth() + 1; //月份(0-11),0为一月份
      month = month < 10 ? "0" + month : month;

      var day = D.getDate(); //月的某一天(1-31)
      day = day < 10 ? "0" + day : day;

      var hours = D.getHours(); //小时(0-23)
      hours = hours < 10 ? "0" + hours : hours;

      var minutes = D.getMinutes(); //分钟(0-59)
      minutes = minutes < 10 ? "0" + minutes : minutes;

      var seconds = D.getSeconds(); //秒(0-59)
      seconds = seconds < 10 ? "0" + seconds : seconds;
      // var week = D.getDay();//周几(0-6),0为周日
      // var weekArr = ['周日','周一','周二','周三','周四','周五','周六'];

      var now_time =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
      return now_time;
    },
    // 预警日志
    warningTabel() {
      largeScreenApi.getWarnings().then((res) => {
        const data = res.data;
        const warnings = data.map((item) => {
          return [
            this.formatDate(item.created_at),
            item.warning_level,
            item.warning_description,
          ];
        });
        this.config = {
          rowNum: 8,
          header: ["时间", "设备编号", "描述"],
          headerBGC: "",
          headerHeight: 32,
          evenRowBGC: "#062656",
          oddRowBGC: "#001e40",
          align: ["center", "center", "center"],
          columnWidth: [150],
          data: warnings,
        };
        // 生成图例颜色
        setTimeout(() => {
          this.handlerLegend();
        });
      });
    },
    //点击变色
    handlerClick(index) {
      this.number = index;
    },
    // 图例颜色
    handlerLegend() {
      this.$nextTick(() => {
        const legends = document.querySelectorAll(".oneLegend");
        console.log(legends);
        legends.forEach((legend, index) => {
          const colors = [
            "rgba(0, 225, 242, 1)",
            "rgba(87, 236, 100, 1)",
            "rgba(232, 217, 49, 1)",
            "rgba(212, 116, 60, 1)",
            "rgba(9, 92, 205, 1)",
          ];

          legend.style.backgroundColor = colors[index % colors.length];
        });
      });
    },
    // 设备统计tabel
    handlerStatistics() {
      largeScreenApi.deviceStatistics().then((res) => {
        const data = res.data;
        const warnings = data.map((item) => {
          if (item.WarningLevel == 0) {
            item.WarningLevel = `<span >未设置</span>`;
          } else if (item.WarningLevel == 1) {
            item.WarningLevel = `<span style="color:#00E1F2">低</span>`;
          } else if (item.WarningLevel == 2) {
            item.WarningLevel = `<span style="color:#E8D931">中</span>`;
          } else if (item.WarningLevel == 3) {
            item.WarningLevel = `<span style="color:#FF4C4B">高</span>`;
          }
          return [
            item.Name,
            item.Status == 1 ? "在线" : "离线",
            item.Value,
            item.WarningLevel,
          ];
        });
        this.deviceStatisticsInfo = {
          rowNum: 8,
          header: ["设备名称", "状态", "上报数值", "报警状态"],
          headerBGC: "",
          headerHeight: 32,
          evenRowBGC: "#062656",
          oddRowBGC: "#001e40",
          align: ["center", "center", "center", "center"],
          columnWidth: [150],
          data: warnings,
        };
      });
    },
    // tree
    handlerTree() {
      largeScreenApi.getTree().then((res) => {
        res.data.unshift({ model_name: "总览" });
        this.trees = res.data;
      });
    },
    //
    handlerClickTree(item){
      largeScreenApi.deviceMap(item).then(res=>{
        console.log(res,'爱仕达雷克萨还得来卡萨');
      })
    }
  },
};
</script>
<style>
.leaflet-control-zoom {
  position: absolute;
  left: 1000px;
  top: 120px;
  z-index: 9999999999999999;
}
</style>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100vh;
}
.header1 {
  height: 100%;
  height: 72px;
  background: url("../../../.././public/media/largeScreen/title.png") no-repeat;
  background-size: cover;
  position: relative;
  z-index: 9999999;
  .font {
    width: 224px;
    height: 32px;
    font-size: 32px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;
    line-height: 112px;
    margin: 0 auto;
    line-height: 58px;
  }
}
.contentOne {
  width: 456px;
  padding: 0px 16px 13px 16px;
  position: relative;
  z-index: 99999;
  .contentLeft {
    background: url("../../../.././public/media/largeScreen/biao.png") no-repeat;
    width: 456px;
    height: 30vh;
    .title {
      width: 108px;
      height: 18px;
      font-size: 18px;
      font-family: Source Han Sans CN-Bold, Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      margin-left: 24px;
    }
    .ds {
      width: 100%;
      height: 100%;
    }
    .numMessage {
      width: 100%;
      height: 100%;
    }
  }
}
.rightContent {
  width: 456px;
  padding: 0px 16px 13px 16px;
  position: relative;
  z-index: 99999;
  bottom: 94vh;
  left: 1435px;
  .rightOne{
    background: url("../../../.././public/media/largeScreen/biao.png") no-repeat;
    width: 456px;
    height: 30vh;
    .titleRight{
      width: 108px;
      height: 18px;
      font-size: 18px;
      font-family: Source Han Sans CN-Bold, Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      margin-left: 24px;
    }
    .status {
      width: 100%;
      height: 100%;
    }
  }
}
.contentTwo {
  width: 456px;
  padding: 0px 16px 13px 16px;
  position: absolute;
  right: 0;
  top: 72px;
  z-index: 99999;
  .contentRight {
    background: url("../../../.././public/media/largeScreen/biao.png") no-repeat;
    width: 456px;
    height: 30vh;
    float: right;
    .titleRight {
      width: 108px;
      height: 18px;
      font-size: 18px;
      font-family: Source Han Sans CN-Bold, Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      margin-left: 24px;
    }
    .status {
      width: 100%;
      height: 100%;
    }
  }
}
.contentTwo1 {
  width: 456px;
  padding: 0px 16px 13px 16px;
  position: absolute;
  right: 0;
  top: 353px;
  z-index: 9999;
  .contentRight {
    background: url("../../../.././public/media/largeScreen/biao.png") no-repeat;
    width: 456px;
    height: 267px;
    float: right;
    .titleRight {
      width: 108px;
      height: 18px;
      font-size: 18px;
      font-family: Source Han Sans CN-Bold, Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      margin-left: 24px;
    }
    .status {
      width: 100%;
      height: 100%;
    }
  }
}
.contentTwo2 {
  width: 456px;
  padding: 0px 16px 13px 16px;
  position: absolute;
  right: 0;
  top: 633px;
  z-index: 999999;
  .contentRight {
    background: url("../../../.././public/media/largeScreen/biao.png") no-repeat;
    width: 456px;
    height: 267px;
    float: right;
    .titleRight {
      width: 108px;
      height: 18px;
      font-size: 18px;
      font-family: Source Han Sans CN-Bold, Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      margin-left: 24px;
    }
    .status {
      width: 100%;
      height: 100%;
    }
  }
}
.bottom {
  width: 100%;
  display: flex;
  position: relative;
  bottom: 103vh;
  justify-content: center;
  z-index: 99999;
  .one {
    width: 96px;
    height: 32px;
    background: linear-gradient(
      180deg,
      rgba(9, 92, 205, 0.7) 0%,
      rgba(9, 92, 205, 0) 100%
    );
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    border: 1px solid #095ccd;
    border-right: none;
    cursor: pointer;
    &:nth-last-child(1) {
      border-right: 1px solid #095ccd;
    }
    .text {
      width: 100%;
      height: 100%;
      font-size: 14px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #67a3f5;
      line-height: 32px;
      text-align: center;
    }
  }
  .two {
    width: 96px;
    height: 32px;
    background: linear-gradient(
      180deg,
      rgba(214, 136, 0, 0.6) 0%,
      rgba(214, 136, 0, 0.3) 100%
    );
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    border: 1px solid #d68800;

    .text {
      width: 100%;
      height: 100%;
      font-size: 14px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #d68800;
      line-height: 32px;
      text-align: center;
    }
  }
  .three {
    background: url("../../../.././public/media/largeScreen/bottomThree.png")
      no-repeat;
    width: 123.91px;
    height: 32.8px;
    position: absolute;
    left: 845px;
    bottom: 21px;
    cursor: pointer;

    .text2 {
      width: 100%;
      height: 100%;
      font-size: 14px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #67a3f5;
      line-height: 32px;
      text-align: center;
    }
  }
  .four {
    background: url("../../../.././public/media/largeScreen/bottomFour.png")
      no-repeat;
    width: 123.91px;
    height: 32.8px;
    position: absolute;
    left: 960px;
    bottom: 21px;
    cursor: pointer;

    .text3 {
      width: 100%;
      height: 100%;
      font-size: 14px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #67a3f5;
      line-height: 32px;
      text-align: center;
    }
  }
  .five {
    background: url("../../../.././public/media/largeScreen/bottomFive.png")
      no-repeat;
    width: 123.91px;
    height: 32.8px;
    position: absolute;
    left: 1058px;
    bottom: 21px;
    cursor: pointer;

    .text4 {
      width: 100%;
      height: 100%;
      font-size: 14px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #67a3f5;
      line-height: 32px;
      text-align: center;
    }
  }
  .six {
    background: url("../../../.././public/media/largeScreen/bottomSix.png")
      no-repeat;
    width: 123.91px;
    height: 32.8px;
    position: absolute;
    left: 1164px;
    bottom: 21px;
    cursor: pointer;
    .text5 {
      width: 100%;
      height: 100%;
      font-size: 14px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #67a3f5;
      line-height: 32px;
      text-align: center;
    }
  }
}
.map {
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
}
.Legend {
  width: 96px;
  background: #002855;
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  border: 1px solid #104684;
  position: absolute;
  right: 497px;
  top: 76vh;
  z-index: 999;
  padding-bottom: 16px;
  .oneLegend {
    width: 16px;
    height: 6px;
    background: #00e1f2;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    display: flex;
    margin-top: 4px;
  }
  .equipment1 {
    width: 36px;
    height: 12px;
    font-size: 12px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #cfdcff;
    line-height: 12px;
    white-space: nowrap; /* 禁止换行 */
    overflow: hidden; /* 超出隐藏 */
    text-overflow: ellipsis; /* 超出内容显示省略号 */
  }
}
.text {
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #ffa70d;
  line-height: 32px;
  text-align: center;
}
.tabel {
  width: 100%;
  height: 100%;
}
</style>
<style scoped>
::v-deep .header {
  height: 32px;
}
</style>