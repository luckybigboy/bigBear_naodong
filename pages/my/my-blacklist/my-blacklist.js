// pages/my/my-blacklist/my-blacklist.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {

    list: [{ txtStyle:""}],
    delBtnWidth: 144, //删除按钮宽度单位（rpx
    num: 0,
    user_id:"",
    "url": app.globalData.url,

  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    let that = this;
    //接受参数用户id
    this.setData({
      user_id: options.id
    })

    //获取数据
    wx.request({
      url: app.globalData.url + '/user/User/getUserOther',
      data: {
        user_id: that.data.user_id,
        type: 2
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          list: res.data.data
        })
      }
    })
    
  },
  // 跳转页面
  toPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /**
   * 是否确定移除弹窗
   */
  showDialogBtn: function(e) {
    this.setData({
      showModal: true,
      num: e.target.dataset.index,
      user_id: e.target.dataset.user //被动用户id
    });
  },

  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function() {

  },

  /**
   * 隐藏模态对话框
   */
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },

  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
  },

  /**
   * 对话框移除按钮点击事件
   */
  onConfirm: function() {
    //获取列表中要移除项的下标
    let that = this;
    var list = this.data.list;
    //移除列表中下标为index的项
    list.splice(that.data.num, 1);
    //更新列表的状态
    this.setData({
      list: list
    });

    //移除黑名单获取数据
    wx.request({
      url: app.globalData.url + '/user/User/addUserOther',
      data: {
        active_user_id: wx.getStorageSync('userInfo').user_id,    //主动用户id
        passive_user_id:that.data.user_id,              //被动用户id
        other_type: 2,                        //类型
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'    // 默认值
      },
      success(res) {
        console.log(res);
      }
    })
    this.hideModal();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    this.initEleWidth();  // 页面初始化 options为页面跳转所带来的参数

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

  },

  /**
   * 左滑移除效果
   */
  touchS: function(e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },

  touchM: function(e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为移除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },

  touchE: function(e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于移除按钮的1/2，不显示移除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" :           "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },

  //获取元素自适应后的实际宽度
  getEleWidth: function(w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
       //以宽度750px设计稿做宽度的自适应
      var scale = (750 / 2) / (w / 2); 
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
    }
  },

  initEleWidth: function() {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

  //点击移除按钮事件
  delItem: function(e) {
    this.setData({
      showModal: true,
      num: e.target.dataset.index,
      user_id: e.target.dataset.user //被动用户id
    });
  }
})