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
    url: app.globalData.url,
    op: 0, //透明度
    headStatus: true,
    scrHeight: '',
    cur: 0,
    user: '',
    headTop: 0,
    navTop: 0,
    page_size: 10,
    user_id: '',
    page0: 1,
    page1: 1,
    page2: 1,
    total0: 0,
    total1: 0,
    total2: 0,
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
      name: "更换封面"
    }],
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
  // 获取页面滚动距离,产生过渡动画
  // onPageScroll: function(res) {
  //   let ops = res.scrollTop / 100;

  //   res.scrollTop <= 100 ? ops = res.scrollTop / 100 : ops = 1;
  //   res.scrollTop <= 60 ? this.data.headStatus = true : this.data.headStatus = false;

  //   this.setData({
  //     op: ops,
  //     headStatus: this.data.headStatus
  //   })

  // },

  // 上拉菜单
  changeImg: function() {
    //根据ID获取组件对象
    var showTwo = this.selectComponent('#footnav');
    //访问属性,使用data访问内部属性和组件属性
    console.info(showTwo.data);
    //执行操作
    showTwo.show();
  },

  // 菜单点击事件
  navClick(e) {
    wx.navigateTo({
      url: '/pages/edit/editor-choose-faces/editor-choose-faces?type=1',
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
    let that = this;

    that.setData({
      user_id: options.id
    })

    wx.showLoading({
      title: '加载中...',
    })
    // 从缓存中获取用户信息
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          user: res.data
        })
      }
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


  // 跳转页面
  toPage(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;

    wx.request({
      url: app.globalData.url + '/user/User/getUserHomepage',
      data: {
        user_id: that.data.user_id,
        type: 1,
        page: 1,
        page_size: that.data.page_size
      },
      success(res) {
        that.setData({
          user: res.data.data.user
        })
      }
    })
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