//index.js
const app = getApp()
const db = wx.cloud.database()
var amapFile = require('../../libs/amap-wx.js');//如：..­/..­/libs/amap-wx.js
Page({
  data: {
    longitude: '',          //中心经度
    latitude: '',           //中心纬度
    markers: [],            //标记点
    points: [],            //记录点
    polyline: [],           //路线
    getshu: 0,              //获取路线次数
    speed: 0,              //速度
    starttime: {},          //开始时间
    stoptime: {},           //结束时间 
    runtime: {},            //跑步时间   时分秒分别为timeh、timem、times
    hidden: 'now',         //显示哪个时间
    address: '',            //位置   
    distance: 0,           //距离
    scale: 16,             //缩放 
    traffic: false,       //是否开启实时路况
  },
  //初始化
  onLoad: function () {
    this.getlocation();
  },
  //监听页面显示
  onShow: function (e) {

  },
  // 初始位置
  getlocation: function (e) {
    var that = this;
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        // console.log(res)
        if (that.data.hidden != 'now') {
          var points = {
            longitude: res.longitude,
            latitude: res.latitude
          };
          that.setData({
            points: that.data.points.concat(points)
          })
        }
        if (that.data.hidden == 'stop') {
          var time = that.data.runtime.timeh * 60 * 60;
          time += that.data.runtime.timem * 60;
          time += that.data.runtime.times;
          console.log(time);
          var distance = that.latLng_calc_distance(that.data.points);
          var speed = Number((distance * 1000 / time).toFixed(2));
          that.setData({
            getshu: 0,
            polyline: [{
              points: that.data.points,
              color: "#409EFF",
              width: 4,
            }],
            distance: Number((distance * 1000).toFixed(2)),
            speed: speed,
            points: []
          })
          // console.log("speed:",that.data.speed)
          // 存储   ///小于1000米不记录
          if (that.data.distance < 1000) {
            wx.showModal({
              title: '提示',
              content: '跑步小于1000米不记录到成绩呦！',
              success(res) {
                if (res.confirm) {

                } else if (res.cancel) {

                }
              },
            })
          } else {
            db.collection('polyline').add({
              data: {
                distance: Number((distance * 1000).toFixed(2)),
                speed: that.data.speed,
                run: time,
                time: that.data.stoptime
              },
              success(res) {
                console.log(res)
              }
            })
          }
        }
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          // speed:res.speed
        });
        // 获取位置信息
        var myAmapFun = new amapFile.AMapWX({ key: 'd037fb602210934bd95dc55ee5b7c402' });
        myAmapFun.getRegeo({
          location: that.data.longitude + ',' + that.data.latitude,
          success: function (data) {
            //成功回调
            // console.log("高德逆地址解析",data);
            that.setData({
              address: data[0].regeocodeData.formatted_address
              // address:data[0].desc
            })
            // console.log(that.data.address)
          },
          fail: function (info) {
            //失败回调
            // console.log(info)

          }
        })
      },
      fail: (info) => {
        console.log("位置获取失败", info)
        wx.getSetting({
          success: function (res) {
            //成功调用授权窗口
            var statu = res.authSetting;
            if (!statu["scope.userLocation"]) {
              //如果设置中没有位置权限
              wx.showModal({
                //弹窗提示
                title: "是否授权当前位置",
                content:
                  "需要获取您的地理位置，请确认授权，否则地图功能将无法使用",
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      //点击确定则调其用户设置
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          //如果设置成功
                          wx.showToast({
                            //弹窗提示
                            title: "授权成功",
                            icon: "success",
                            duration: 1000
                          });
                          that.getlocation();
                        }
                      }
                    })
                  } else if (tip.cancel) {
                    console.log("取消")
                    wx.showToast({
                      //弹窗提示
                      title: "您可以点击开始按钮重新授权",
                      icon: "none",
                      duration: 3000
                    });
                  }
                }
              })
            }

          },
          fail: function (res) {

          }
        });
        wx.showModal({
          title: '提示',
          content: '请手动开启定位功能'
        })
      }
    })
  },

  // 开始跑步
  startrun: function (e) {
    var that = this
    if (that.data.getshu == 0 | that.data.hidden != 'start') {
      // 获取位置
      this.getlocation();
      // 实时位置
      var that = this;
      var starttime = that.gettime()
      that.setData({
        starttime: starttime,
        hidden: 'start'
      });
      console.log(that.data.starttime)
      wx.startLocationUpdate({
        success: (res) => {
          console.log("成功", res);
          wx.onLocationChange((res) => {
            // console.log("位置变化",res)
            // 每60次获取位置记录一次坐标
            if (that.data.getshu == 60) {
              var points = {
                longitude: res.longitude,
                latitude: res.latitude
              };
              that.setData({
                points: that.data.points.concat(points),
                getshu: 0
              })
              console.log("points：", that.data.points)
            } else {
              that.setData({
                longitude: res.longitude,
                latitude: res.latitude,
                getshu: that.data.getshu + 1
              })
              // console.log(that.data.getshu)
              // console.log(that.data.polyline)
            }
          })
        },
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '已经开始跑步是否停止',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            that.stoprun();
            wx.showToast({
              title: '已经停止',
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')

          }
        },
      })
    }

  },
  // 停止跑步
  stoprun: function (e) {
    var that = this;
    that.getlocation()
    if (that.data.hidden == 'start') {
      that.setData({
        hidden: 'stop',
      })
      wx.stopLocationUpdate({
        success: (res) => {
          wx.showToast({
            title: '停止了跑步',
          })

          // console.log("跑步时间：",that.data.runtime)
        },
      })
      // 结束时间
      var that = this;
      var stoptime = that.gettime();
      that.setData({
        stoptime: stoptime,
        getshu: 0,
      })
      console.log(that.data.stoptime)
      // 跑步时间
      var runtime = {
        timeh: that.data.stoptime.timeh - that.data.starttime.timeh,
        timem: that.data.stoptime.timem - that.data.starttime.timem,
        times: that.data.stoptime.times - that.data.starttime.times,
      };
      if (runtime.timem >= 0 & runtime.times >= 0 & runtime.timeh >= 0) {
        // console.log("paobu",runtime)
        that.setData({
          runtime: runtime
        })
      } else {
        if (runtime.times < 0) {
          runtime.times = that.data.stoptime.times - that.data.starttime.times + 60;
          runtime.timem = runtime.timem - 1;
        }
        if (runtime.timem < 0) {
          runtime.timem = that.data.stoptime.timem - that.data.starttime.timem + 60;
          runtime.timeh = runtime.timeh - 1;
        }
        that.setData({
          runtime: runtime,
        })


      }

    } else {
      wx.showToast({
        title: '请先开始跑步',
      })
    }

  },
  // 获取时间
  gettime: function (e) {
    var time = new Date();
    var timedata = {
      timeh: time.getHours().valueOf(),
      timem: time.getMinutes().valueOf(),
      times: time.getSeconds().valueOf()
    };
    console.log(timedata);
    
    return timedata;
  },
  // 获取距离
  latLng_calc_distance(arrs) { // 经纬度数据算距离
    let sum = 0
    const l = arrs.length
    function Rad(d) {
      return d * Math.PI / 180.0
    }
    for (let i = 0, le = l - 1; i < le; i++) {
      const radLat1 = Rad(arrs[i]['latitude'])
      const radLat2 = Rad(arrs[i + 1]['latitude'])
      const lats = radLat1 - radLat2
      const lngs = Rad(arrs[i]['longitude']) - Rad(arrs[i + 1]['longitude'])
      const s = [2 * Math.asin(Math.sqrt(Math.pow(Math.sin(lats / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(lngs / 2), 2)))] * 6378.137
      sum = sum + s
    }
    return sum
  },
  // 定位
  clearIcons: function (e) {
    this.getlocation()
  },
  // 路况
  traffic: function (e) {
    var that = this;
    that.setData({
      traffic: !that.data.traffic
    })
  },

  // 记录时间
  timeRecorder: function (e) {
    var timer = setInterval(() => {
      let time = new Date();
      let h = zeroFill(time.getHours());
      let m = zeroFill(time.getMinutes());
      let s = zeroFill(time.getSeconds());
      this.setData({

      })
    }, 1000);
  },


})
// 补零
function zeroFill(n) {
  if (n > 10) {
    return '' + n;
  } else {
    return '0' + n;
  }
}
