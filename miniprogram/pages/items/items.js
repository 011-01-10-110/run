// pages/items/items.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemlist:[],            // 数据库读取列表
    title:'',               // 标题
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      title: options.title
    })
    // console.log(options.id)
    // 读取数据库课程列表
    db.collection('classitem').where({
      _id: options.id
    }).get().then(res => {
      console.log(res.data)
      that.setData({
        itemlist:res.data[0].content
      })
    })
  },

  // 详情页
  item:function(e){
    console.log(e.target.dataset.reitem)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})