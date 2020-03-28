// pages/my/my-mine/my-mine.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBar: app.globalData.statusBar,
    customBar: app.globalData.customBar,
    custom: app.globalData.custom,
    op: 0,
    user_title: '他人主页',
    headStatus: true,
    scrHeight: '',
    cur: 0,
    user: {},
    headTop: 0,
    navTop: 0,
    att: false,
    user_id: '',
    my_id: '',
    openid:'',
    page0: 1,
    page1: 1,
    page2: 1,
    total0: 0,
    total1: 0,
    total2: 0,
    status: {},
    nav: [{
        name: '参与'
      },
      {
        name: '点赞'
      },
      {
        name: '收藏'
      }
    ],
    footNav1: [{
        name: "举报",
        bind: true
      },
      {
        name: "加入黑名单"
      }
    ],
    footNav2: [{
        name: "嘲讽 / 不友善内容"
      },
      {
        name: "侮辱谩骂骚扰"
      },
      {
        name: "淫秽色情信息"
      },
      {
        name: "违法有害信息"
      },
      {
        name: "政治敏感"
      }
    ],
    list0: [],
    list1: [],
    list2: []
  },
  // 返回首页
  toIndex() {
    wx.switchTab({
      url: '/pages/index/home/home'
    })
  },

  // 关注事件
  attention() {
    this.deal(1)
  },

  // 1关注、2拉黑、3举报 处理事件
  deal(type, cont) {
    let that = this;
    let data = {};

    if (type == 3) {
      data = {
        other_type: type,
        active_user_id: that.data.my_id,
        passive_user_id: that.data.user_id,
        other_content: cont
      }
    } else {
      data = {
        other_type: type,
        active_user_id: that.data.my_id,
        passive_user_id: that.data.user_id
      }
    }


    wx.request({
      url: app.globalData.url + '/user/User/addUserOther',
      data: data,
      success(res) {
        // 根据类型判断提示信息
        if (type == 2) {
          if (res.data.code == 200) {
            wx.showToast({
              title:cont,
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: cont + '失败',
              icon: 'none'
            })
          }

        }

        if (type == 3) {
          if (res.data.code == 200) {
            wx.showToast({
              title: '举报成功',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '举报失败',
              icon: 'none'
            })
          }

        }
        that.selectInfo()
      }
    })
  },

  // 返回上级页面
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  // 导航切换
  navTab(e) {
    this.setData({
      cur: e.currentTarget.dataset.cur
    })
  },
  // 获取数据
  getData(type, page) {
    let that = this;

    wx.request({
      url: app.globalData.url + '/user/User/getUserHomepage',
      data: {
        user_id: that.data.user_id,
        type: type,
        page: page,
        page_size: that.data.page_size
      },
      success(res) {
        that.setData({
          user: res.data.data.user
        })
        that.processData(type, res.data.data.article, res.data.data.total)
      }
    })
  },

  // 数据处理

  processData(type, data, total) {
    let that = this;

    switch (type) {
      case 0:
        that.setData({
          list0: that.data.list0.concat(data),
          total0: total
        })
        break;
      case 1:
        that.setData({
          list1: that.data.list1.concat(data),
          total1: total
        })
        break;
      case 2:
        that.setData({
          list2: that.data.list2.concat(data),
          total2: total
        })
        break;
    }
  },

  // 页面滚动加载1
  lower0(e) {
    let that = this;
    if (that.data.total0 > that.data.list0.length) {
      var page = that.data.page0 + 1;
      that.setData({
        page0: page
      })
      that.getData(0, page)
    }

  },
  // 页面滚动加载2
  lower1(e) {
    let that = this;
    if (that.data.total1 > that.data.list1.length) {
      var page = that.data.page1 + 1;
      that.setData({
        page1: page
      })
      that.getData(1, page)
    }

  },
  // 页面滚动加载3
  lower2(e) {
    let that = this;
    if (that.data.total2 > that.data.list2.length) {
      var page = that.data.page2 + 1;
      that.setData({
        page2: page
      })
      that.getData(2, page)
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this;
    let value = wx.getStorageSync('userInfo')

    that.setData({
      user_id: options.id,
      my_id: value.user_id,
      openid: value.openid
    })

    that.getData(0, 1);
    that.getData(1, 1);
    that.getData(2, 1);

    // 获取顶部高度
    const query = wx.createSelectorQuery()
    query.select('.my-head').boundingClientRect()
    query.exec(function(res) {
      that.setData({
        headTop: res[0].height
      })
    })
    const query1 = wx.createSelectorQuery()
    query1.select('.head-nav').boundingClientRect()
    query1.exec(function(res) {
      that.setData({
        navTop: res[0].height
      })
    })
    // 需要页面加载完毕获取到高度再延时执行
    setTimeout(() => {
      wx.hideLoading({})
      wx.getSystemInfo({
        success(res) {
          that.setData({
            scrHeight: res.windowHeight - that.data.headTop - that.data.navTop
          })
        }
      })
    }, 500)


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  toast: function() {
    //根据ID获取组件对象
    var showTwo = this.selectComponent('#footnav');
    //访问属性,使用data访问内部属性和组件属性
    // console.info(showTwo.data);
    //执行操作
    showTwo.show();
  },

  // 弹窗取消按钮
  modalCancel(e) {
    console.log(e)
  },

  // 弹窗确定按钮
  modalConfirm(e) {
    console.log(e)
  },

  // 菜单点击事件
  navClick(e) {
    let obj = e.detail.name;
    let name = 'footNav1[1].name';

    if (obj != "加入黑名单" && obj != "移除黑名单") {
      this.deal(3, obj)
    } else {
      if (obj == "加入黑名单") {
        this.deal(2, obj)
        this.setData({
          [name]: '移除黑名单'
        })
      } else {
        this.deal(2, obj)
        this.setData({
          [name]: '加入黑名单'
        })
      }
    }
  },
  // 跳转页面
  toPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  // 查询关注与黑名单状态
  selectInfo() {
    let that = this;
    let name = 'footNav1[1].name';
    wx.request({
      url: app.globalData.url + '/user/User/followState',
      data: {
        active_user_id: that.data.my_id,
        passive_user_id: that.data.user_id
      },
      success(res) {
        that.setData({
          status: res.data.data
        })
        if (res.data.data.black_state == 1) {
          that.setData({
            [name]: '移除黑名单'
          })
        } else {
          that.setData({
            [name]: '加入黑名单'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.selectInfo()
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