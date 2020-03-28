// component/foot-nav/foot-nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    nav1: {
      type: Array,
      value: []
    },
    nav2: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    status: false,
    duration: 300,
  },

  attached: function() {
    // 在组件实例进入页面节点树时执行

    // 遮罩层动画初始化
    this.animation = wx.createAnimation({
      duration: this.data.duration,
      timingFunction: 'linear',
    });

    // 一级菜单动画初始化
    this.animationUp = wx.createAnimation({
      duration: this.data.duration,
      timingFunction: 'linear',
    });

    // 二级菜单动画初始化
    this.animationUp1 = wx.createAnimation({
      duration: this.data.duration,
      timingFunction: 'linear',
    });
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 遮罩层动画效果
    animationJs(i) {
      this.animation.opacity(i).step();
      this.setData({
        animation: this.animation.export()
      })
    },
    // 一级菜单动画效果
    animationUpJs(i) {
      this.animationUp.bottom(i).step();
      this.setData({
        animationUp: this.animationUp.export()
      })
    },
    // 二级菜单动画效果
    animationUpJs1(i) {
      this.animationUp1.bottom(i).step();
      this.setData({
        animationUp1: this.animationUp1.export()
      })
    },
    // 打开二级菜单
    openTwo() {
      this.animationUpJs("-100%");
      this.animationUpJs1(0);
    },
    // 关闭二级菜单
    closeTwo() {
      this.animationUpJs(0);
      this.animationUpJs1("-100%");
    },
    // 打开一级菜单  
    show(arr) {
      this.setData({
        status: true,
      })
      // 等组件创建完毕，开始加载动画渲染节点。
      setTimeout(() => {
        this.animationJs(1);
        this.animationUpJs(0);
      }, 50)
    },

    // 关闭
    hide() {
      // 还原动画状态
      this.animationJs(0);
      this.animationUpJs("-100%");
      this.animationUpJs1("-100%");
      setTimeout(() => {
        this.setData({
          status: false,
        })
      }, this.data.duration + 10)
    },

    // 取消按钮
    cancel() {
      this.hide();
      this.triggerEvent('cancel')
    },
    // 确定按钮
    clickOn(e) {
      this.hide();
      console.log(e.target.dataset);
      this.triggerEvent('clickOn',e.target.dataset)
    }

  }
})