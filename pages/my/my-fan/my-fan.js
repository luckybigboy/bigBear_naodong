// pages/my/my-fan/my-fan.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    FanData: [ ],
    user_id:"",
    type:0,
    self_id:0,
    "url": app.globalData.url,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.setData({
      self_id: wx.getStorageSync('userInfo').user_id
    })
    //接受参数用户id
    if(options.type){
      this.setData({
        user_id: options.id,
        type: options.type
      })
    }else{
      this.setData({
        user_id: options.id
      })
    }
    if(that.data.type == 1){
      //获取个人主页粉丝列表数据
      wx.request({
        url: app.globalData.url + '/user/User/getUserOther',
        data: {
          user_id: wx.getStorageSync('userInfo').user_id,
          type: 1
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          that.setData({
            FanData: res.data.data
          })
        }
      })
    }else{
      //获取他人主页粉丝列表数据
      wx.request({
        url: app.globalData.url + '/user/User/getOther',
        data: {
          user_id: wx.getStorageSync('userInfo').user_id,
          other_id: that.data.user_id,
          type: 1
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          that.setData({
            FanData: res.data.data
          })
        }
      })
    }
   
  },
  // 跳转页面
  toPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  // 获取点击按钮状态数据
  showedit: function (e) {
    var that = this;
    let i = e.target.dataset.index;
    var aa = 'FanData[' + i + '].status';
    let user_id = e.target.dataset.user;  //被动用户id
    wx.request({
      url: app.globalData.url + '/user/User/addUserOther',
      data: {
        active_user_id: wx.getStorageSync('userInfo').user_id,  //主动用户id
        passive_user_id:user_id,                                //被动用户id
        other_type: 1,                                          //类型
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          [aa]:res.data.data
        })
      }
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


