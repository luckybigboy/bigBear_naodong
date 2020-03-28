// pages/my-edit-profile/my-edit-profile.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    min: 1,
    max: 30,
    wordScore: 0, //  字数,
    titleValue: '', //  输入的内容
    isbool: true, //  按钮开始不可用
    user_id: ''
  },
  //   字数限制
  inputs(e) {
    // 获取输入框的内容
    var value = e.detail.value;
    this.data.titleValue = value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);

    //  根据输入内容长度判断按钮是否可点击
    if (len == 0 || len > 30) {
      this.setData({
        isbool: true
      })
    } else {
      this.setData({
        isbool: false
      })
    }

    this.setData({
      wordScore: len
    })
  },
  //  确定提交
  submit() {
    wx.request({
      url: app.globalData.url + '/user/User/saveUserInfo',
      data: {
        user_id: this.data.user_id,
        user_introduce: this.data.titleValue
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.code == 200) {
          //   设置成功弹框
          wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 2000,
            success() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
        //  获取用户id
        this.setData({
          user_id: options.id
        })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})