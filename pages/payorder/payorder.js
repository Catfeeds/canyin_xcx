var QQMapWX = require('../map/qqmap-wx-jssdk.js');

// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    kk:1,
    address:'',
    otype:'wm',
    pro: [],
    total: 0,
    vprice: 0,
    vou: [],
    addressInfo: {},
    addrId: 0,
    nowtime: '',
    yunfei: 0,
    ptime: 0,
    cartId: 0,
    vid: 0,
  },
  /**
   * 支付货款
   */
  payMoney: function payMoney() {
    // todo 付款流程
    // wx.requestPayment({
    //   'timeStamp': '',
    //   'nonceStr': '',
    //   'package': '',
    //   'signType': 'MD5',
    //   'paySign': '',
    //   'success':function(res){
    //   },
    //   'fail':function(res){
    //   }
    // })
  },


  an:function(){
    var that = this
    var qqmapsdk = new QQMapWX({
      key: '3F4BZ-6RBR6-Q3HSQ-ML5JH-KF22H-YTBRQ'
    });

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
        console.log(res.longitude + " " + res.latitude);

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            var a = res.result.address_component.district;
            var b = res.result.address_component.street_number;
            var c = res.result.address_component.city;
            console.log(a + b);
            that.setData({
              address: c+a + b
            });
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          },
        });
      }
    })
  
  },
  
  onLoad: function (options) {
    var otype = options.otype;
    if (otype != '' && otype != 'undefined') {
      this.setData({
        otype: otype,
      });
    }
  },

  // 创建订单，调起微信支付
  reg: function (e) {
    // wx.showModal({
    //   title: '注意',
    //   content: '此模版仅供展示，未开通微信支付，无法完成支付操作',
    //   showCancel:false
    // })
    // return false;
    wx.showToast({
      title: '订单生成中...',
      icon: 'loading',
    });
    //创建订单
    var that = this;
    var address = that.data.address;
    var otype = that.data.otype;
    if ((address == '' || address == "undefined") && otype=="wm") {
      wx.showToast({
        title: '请填写送餐地址!',
        duration: 2000,
      });
      return false;
    }
    //创建订单
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/payment',
      method: 'post',
      data: {
        uid: app.d.userId,
        cart_id: that.data.cartId,
        type: 'weixin',
        address: address,      //地址的id
        name: e.detail.value.name,
        tel: e.detail.value.tel,
        remark: e.detail.value.remark,//用户备注
        price: that.data.total,//总价
        vid: that.data.vid,//优惠券ID
        otype: otype,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideToast();
        //--init data        
        var data = res.data;
        if (data.status == 1) {
          //创建订单成功
          if (data.arr.pay_type == 'cash') {
            wx.showToast({
              title: "请自行联系商家进行配送!",
              duration: 3000
            });
            return false;
          }
          if (data.arr.pay_type == 'weixin') {
            //微信支付
            that.wxpay(data.arr);
          }
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2500
          });
        }
      },
      fail: function (e) {
        wx.hideToast();
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },

  //调起微信支付
  wxpay: function (order) {
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order.order_id,
        order_sn: order.order_sn,
        uid: this.data.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../dingdan/dingdan?currentTab=1&otype=deliver',
                });
              }, 2300);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 2000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！err:wxpay',
          duration: 2000
        });
      }
    })
  },

  address:function(){
      var cartId = this.data.cartId;
      wx.navigateTo({
        url: '../address/user-address/user-address?cartId=' + cartId,
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // TODO: onReady
    wx.hideToast();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // TODO: onShow
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
    });
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Payment/buy_cart',
      method: 'post',
      data: {
        uid: app.d.userId,
        cart_id: that.data.cartId,
        otype: that.data.otype,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var adds = res.data.adds;
        if (adds) {
          var addrId = adds.id;
          that.setData({
            addressInfo: adds,
            addrId: addrId,
            address: adds.quyuname+adds.address,
          });
        }
        that.setData({
          pro: res.data.pro,
          total: res.data.price,
          vprice: res.data.price,
          vou: res.data.vou,
          nowtime: res.data.nowtime,
          yunfei: res.data.yun,
          ptime: res.data.ptime,
          cartId: res.data.cartId,
        });
      },
    });
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // TODO: onHide
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});
//# sourceMappingURL=payorder.js.map
