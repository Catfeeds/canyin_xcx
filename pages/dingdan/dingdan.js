// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
// var common = require("../../utils/common.js");
Page({  
  data: { 
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    }, 
    winWidth: 0,  
    winHeight: 900,  
    // tab切换  
    currentTab: 0,  
    isStatus:'pay',//10待付款，20待发货，30待收货 40、50已完成
    page: 2,
    repage: 2,
    orderList: [],
    orderReList: [],
    orderId:0
  },  

  // tab切换
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.currentTarget.dataset.id;
    var otype = e.currentTarget.dataset.otype;
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj,
      isStatus: otype,
    });
    if (_datasetId==4) {
      this.loadReturnOrderList();
    } else {
      this.loadOrderList();
    }
  },
  onLoad: function(options) {
    var _datasetId = parseInt(options.currentTab);
    var otype = options.otype;
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj,
      isStatus: otype,
    });
  },  

  onShow: function () {
    if (this.data.currentTab == 4) {
      this.loadReturnOrderList();
    } else {
      this.loadOrderList();
    }
  },

//取消订单
removeOrder:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    wx.showModal({
      title: '提示',
      content: '你确定要取消订单吗？',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/orders_edit',
          method:'post',
          data: {
            id: orderId,
            type:'cancel',
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if(status == 1){
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
            }else{
              wx.showToast({
                title: res.data.err,
                duration: 2000
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });
      }
    });
  },

  //确认收货
recOrder:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderId;
    var orderType = e.currentTarget.dataset.otype;
    if (orderType=='1') {
      var content = "您确认已经送达？";
    } else {
      var content = "您确认已经到店消费？";
    }
    wx.showModal({
      title: '提示',
      content: content,
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.ceshiUrl + '/Api/Order/orders_edit',
          method:'post',
          data: {
            id: orderId,
            type:'receive',
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var status = res.data.status;
            if(status == 1){
              wx.showToast({
                title: '操作成功！',
                duration: 2000
              });
              that.loadOrderList();
            }else{
              wx.showToast({
                title: res.data.err,
                duration: 2000
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          }
        });

      }
    });
  },

  loadOrderList: function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/index',
      method:'post',
      data: {
        uid:app.d.userId,
        order_type:that.data.isStatus,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        var list = res.data.ord;
        if (status==1) {
          that.setData({
            orderList: list,
          });
        }else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

loadReturnOrderList:function(){
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Order/order_refund',
      method:'post',
      data: {
        uid:app.d.userId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data.ord;
        var status = res.data.status;
        if(status==1){
          that.setData({
            orderReList: data,
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

//跳转退款退货页面
goback:function(e){
  var orderId = e.currentTarget.dataset.orderId;
  wx.navigateTo({
    url: '../tuihuo/tuihuo?orderId=' + orderId,
  })
},

//页面触底事件
onReachBottom: function() {
  var otype = this.data.isStatus;
  if (otype=='raback') {
    this.getMore();
  } else {
    this.getMore2();
  }
},

//获取更多
getMore: function (e) {
  var that = this;
  var page = that.data.page;
  wx.request({
    url: app.d.ceshiUrl + '/Api/Order/index',
    method: 'post',
    data: {
      uid: app.d.userId,
      order_type: that.data.isStatus,
      page: page,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      //--init data        
      var status = res.data.status;
      var list = res.data.ord;
      if (status == 1) {
        if (list == '') {
          return false;
        }
        that.setData({
          orderList: that.data.orderList.concat(list),
          page: parseInt(page)+1,
        });
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
        title: '网络异常！',
        duration: 2000
      });
    }
  });
},

//退款获取更多
getMore2: function (e) {
  var that = this;
  var page = that.data.repage;
  var that = this;
  wx.request({
    url: app.d.ceshiUrl + '/Api/Order/order_refund',
    method: 'post',
    data: {
      uid: app.d.userId,
      page: page,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {     
      var data = res.data.ord;
      var status = res.data.status;
      if (status == 1) {
        if (data=='') {
          return false;
        }

        that.setData({
          orderReList: that.data.orderReList.concat(data),
          repage: parseInt(page)+1,
        });
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
        title: '网络异常！',
        duration: 2000
      });
    }
  });
},
  
  bindChange: function(e) {  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
  }, 

  payOrderByWechat: function (e) {
    var that = this;
    var order_id = e.currentTarget.dataset.orderid;
    var order_sn = e.currentTarget.dataset.ordersn;

    if (!order_sn || !order_id){
      wx.showToast({
        title: "订单异常!",
        duration: 2000,
      });
      return false;
    }
    that.setData({
      orderId: order_id
    });
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
      data: {
        order_id: order_id,
        order_sn: order_sn,
        uid: app.d.userId,
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
                title: '支付成功！',
                duration: 2000
              });
              setTimeout(function(){
                wx.navigateTo({
                  url: '../dingdan/dingdan?currentTab=1&otype=deliver',
                });
              },2300);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
              });
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function (e) {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

})