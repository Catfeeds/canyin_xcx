// pages/events/events.js
Page({

  /**
   * 页面的初始数据
   */
  data: {


   ab:[
     {
     huo: false,
     id:0,
   },
     {
       huo: false,
        id: 1,
     }, {
       huo: false,
       id: 2,
     },
   
   ] 

  },
a:function(e){
  var data_id = e.currentTarget.dataset.id;
  console.log(e);

  var s=[];

  for (var i = 0; i < this.data.ab.length; i++) {
    var pl = {};
    pl.id = i + 0;
    s.push(pl);
  }
   if (data_id==0){
     s[data_id].id = 0;
     s[data_id].huo = true;
     this.setData({
       ab: s,
     })
  }
   if (data_id == 1) {
     s[data_id].id = 1;
     s[data_id].huo = true;
     this.setData({
       ab: s,
     })
   }
   if (data_id == 2) {
     s[data_id].id = 2;
     s[data_id].huo = true;
     this.setData({
       ab: s,
     })
   }
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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