// pages/login/index.js
Page({

  handleGetUserInfo(e){
    // console.log(e);
    const {userInfo}=e.detail;

    wx.setStorageSync('userinfo', userInfo);
    wx.navigateBack({
     detail:1
    })
  },

  /**
   * 页面的初始数据
   */
  data: {

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

  
})