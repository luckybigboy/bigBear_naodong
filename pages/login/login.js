// pages/login/login.js
//获取应用实例
const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数

  onLoad: function() {},

  // 获取用户授权
  getUserInfo: function(e) {
    let that = this;
    let user = e.detail.userInfo;
    wx.showLoading({
      title: '登录中',
    })
    if (user) {
      // 用户登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            //发起网络请求
            wx.request({
              url: app.globalData.url + '/user/Login/login',
              method: 'POST',
              data: {
                code: res.code
              },
              success(res) {
                that.register(user, res.data.data); // 用户登陆注册
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })


    } else {
      wx.hideLoading();
      wx.showToast({
        title: '获取失败',
        icon: 'none',
        duration: 2000
      })
    }
  },


  // 用户注册 
  register(user, obj) {
    // 头像上传
    wx.request({
      url: app.globalData.url + '/user/User/upload',
      method: 'POST',
      data: {
        user_image: user.avatarUrl
      },
      success(res) {
        console.log("我是返回的头像", res.data)
        // 用户注册
        wx.request({
          url: app.globalData.url + '/user/Login/register',
          method: 'POST',
          data: {
            openid: obj.openid,
            user_name: user.nickName,
            user_image: res.data.data
          },
          success(res) {
            wx.hideLoading();
            console.log("我是返回的", res.data)
            if (res.data.code == 200) {
              wx.setStorage({
                key: "userInfo",
                data: res.data.data
              })

              wx.navigateBack({
                delta: 1
              })
            }else{
              wx.showToast({
                title: '登陆失败',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
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