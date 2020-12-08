// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: null,
    list: [{
      icon: "../../images/my.png",
      text: "我的信息"
    }, ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.userInfo){
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }else{
      app.callbackUser = (res)=>{
        this.setData({
          userInfo: res.userInfo
        })
      }
    }
  },

  /**
   * 获取用户信息
   */
  onGetUserInfo: function (e) {
    // 获取用户信息
    wx.getUserInfo({
      success: res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    })

  },

  //我的信息
  mymessage: function (e) {

  },
})