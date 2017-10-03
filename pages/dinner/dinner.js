var app = getApp();
Page({

data:{
  index: 0,
  date: '2017-01-01',
  time: '00:00',
  listArr: [],//时间段数组
  listId: [],//时间段id数组
  listIndex: 0,
  timeid:0,
  img: {},
  offtime: "2100-01-01",
},

//页面加载完成
onShow: function() {
  var that = this;
  //获取数据
  wx.request({
    url: app.d.ceshiUrl + '/Api/User/dinner',
    data: {},
    method: 'POST',
    success: function (res) {
      var img = res.data.img;
      var list = res.data.list;
      var nowtime = res.data.nowtime;
      var offtime = res.data.offtime;
      var sArr = [];
      var sId = [];
      sArr.push('请选择');
      sId.push('0');
      for (var i = 0; i < list.length; i++) {
        sArr.push(list[i].name);
        sId.push(list[i].id);
      }
      that.setData({
        listArr: sArr,
        listId: sId,
        date: nowtime,
        offtime: offtime,
        img: img,
      })
    },
    fail: function () {
      // fail
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    },
  })
},

// 表单
reg: function (e) {
  console.log(e.detail.value);
  //存储数据
  var that = this;
  var tel = e.detail.value.tel;
  var name = e.detail.value.name;
  var timeid = e.detail.value.timeid;
  if (!tel || !name) {
    wx.showToast({
      title: "请先完善预订信息!",
      duration: 2000
    });
    return false;
  }
  if(!timeid) {
    wx.showToast({
      title: "请先选择时间段!",
      duration: 2000
    });
    return false;
  }

  //创建订单
  wx.request({
    url: app.d.ceshiUrl + '/Api/User/book',
    method: 'post',
    data: {
      uid: app.d.userId,
      name: name,
      tel: tel,
      thetime: that.data.date, //用餐日期
      timeid: timeid,
      remark: e.detail.value.remark,//用户备注
      arrive: that.data.time, //预计到店时间
      people: e.detail.value.people,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      wx.hideToast();
      //--init data        
      var data = res.data;
      if (data.status == 1) {
        var bookId = data.bookid;
        wx.navigateTo({
          url: '../time_quantum/time_quantum?bookId=' + bookId,
        });
      } else {
        wx.showToast({
          title: res.data.err,
          duration: 2300
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
// 下一步
  showTopTips:function(){
wx.navigateTo({
  url: '../time_quantum/time_quantum',
  success: function(res) {},
  fail: function(res) {},
  complete: function(res) {},
})
  },

  calling:function(){
    wx.makePhoneCall({
      phoneNumber: '12345678900', //此号码并非真实电话号码，仅用于测试
      success:function(){
        console.log("拨打电话成功！")
      },
      fail:function(){
        console.log("拨打电话失败！")
      }
    })
  },

  //时间段change事件
  bindChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      timeid: e.detail.value,
      listIndex: e.detail.value,
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  }
})