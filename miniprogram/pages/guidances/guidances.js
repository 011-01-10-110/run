// pages/guidances/guidances.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图
    swiperList:[{
      img:'https://static1.keepcdn.com/cms_static/picture/2019/6/24/1561343512316_cGFvYnVqaS0x.jpg?imageMogr2/thumbnail/600x',
      title:'12分钟燃脂跑'
    },{
      img:'https://static1.keepcdn.com/cms_static/picture/2019/6/24/1561357297064_cGFvYnVqaS0y.jpg?imageMogr2/thumbnail/600x',
      title:'15 分钟燃脂跑'
    },{
      img:'https://static1.keepcdn.com/cms_static/picture/2019/6/24/1561357328477_cGFvYnVqaS0z.jpg?imageMogr2/thumbnail/600x',
      title:'20 分钟燃脂跑'
    }],
    // 课程分类
    classlist:[],
    // 课程推荐
    relist:[]

  },

  // 课程分类
  classitem:function(e){
    var that = this;
    let id = e.target.dataset.id;
    let title = that.data.classlist.find(function(item){
      return item._id == id
    },this).title;
    // console.log("title",title)
    // console.log(id)
    // 跳转列表页
    wx.navigateTo({
      url: '../items/items?id='+id+'&title='+title,
    })
  },
  // 推荐课程
  reitem:function(e){
    console.log("reitem:",e.target.dataset.reitem)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 读取数据库
    db.collection('classitem').get().then(res => {
      that.setData({
        classlist:res.data,
        relist:res.data[0].content
      })
      console.log(res.data)
    })
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