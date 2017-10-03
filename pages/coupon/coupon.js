// pages/coupon/coupon.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    }, 
    kk:false,
    vou: [],
    vouused:[],
    offvou:[],
  },
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    if (_datasetId=='0'){
      var len = this.data.vou.length;
    } else if (_datasetId=='1') {
      var len = this.data.vouused.length;
    } else if (_datasetId=='2') {
      var len = this.data.vouused.length;
    }

    if (len<=0) {
      this.setData({
        kk: true,
      });
    }else {
      this.setData({
        kk: false,
      });
    }

    this.setData({
      tabArr: _obj
    });
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideToast();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
    });
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/voucher',
      method: 'post',
      data: { uid: app.d.userId },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var vou = res.data.nouses;
        var vouused = res.data.useds;
        var offvou = res.data.offdates;
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            vou: vou,
            vouused: vouused,
            offvou: offvou,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

  //立即使用点击事件
  usevou: function() {
    wx.navigateTo({
      url: '../ordering/ordering',
    })
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