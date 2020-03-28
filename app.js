//app.js
App({
  onLaunch: function() {
    // 获取设备信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.statusBar = e.statusBarHeight; //状态栏高度
        let custom = wx.getMenuButtonBoundingClientRect(); //菜单按钮
        this.globalData.custom = custom;
        this.globalData.customBar = custom.bottom + custom.top - e.statusBarHeight; //计算得到定义的状态栏高度

      }
    })

    // 缓存中同步获取用户信息
    try {
      var value = wx.getStorageSync('userInfo')
      if (value) {
        this.globalData.userInfo = value;
      }
    } catch (e) {
      // Do something when catch error
    }
  },


  // 全局登陆方法
  loging() {
    let that = this;

    // 判断登陆状态是否过期
    wx.checkSession({
      success() {
        console.log('session_key 未过期')
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail() {
        console.log('session_key 已经失效，需要重新执行登录流程')
        // session_key 已经失效，需要重新执行登录流程
        wx.navigateTo({
          url: '/pages/login/login',
        })

      }
    })
  },

  //防止按钮多次出发
  throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
      gapTime = 1500
    }

    let _lastTime = null

    // 返回新的函数
    return function() {
      let _nowTime = +new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
        fn.apply(this, arguments) //将this和参数传给原函数
        _lastTime = _nowTime
      }
    }
  },


  // 全局变量
  globalData: {

    userInfo: null,
    url: "https://gy.erroy.cn", //测试环境域名
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    id: '',
    openid: '564e6e917a25c1cc8ce949b20931d5ef'
  }
})