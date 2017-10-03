var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actId:0,
    info:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var actId = options.actId;
    this.setData({
      actId: actId,
    });
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
    var that = this;
    var actId = that.data.actId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Activity/detail',
      method: 'post',
      data: {
        id: actId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var status = res.data.status;
        if (status == 1) {
          var info = res.data.info;
          var content = info.content;
          WxParse.wxParse('content', 'html', content, that, 10);
          that.setData({
            info: info,
          });
        } else {
          wx.showToast({
            title: '没有找到相关信息.',
            duration: 2000,
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
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
    var title = this.data.info.name;
    var id = this.data.info.id;
    return {
      title: title,
      path: '/pages/particulars/particulars?actId='+id,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})