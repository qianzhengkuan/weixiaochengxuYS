// pages/auth/index.js

// 引入 用来发送请求的 方法 一定要把路径补全
import { request } from "../../request/index.js";
import {login} from "../../utils/asyncWx"

Page({

  // 获取授权
 async handleGetUserInfo(e){
    // console.log(e);
    //获取用户信息
    const {encryptedData,errMsg,iv,rawData}=e.detail;
    // 获取小程序登录成功后的code
   const {code} = await login();
   
    const loginParams = {encryptedData,errMsg,iv,rawData,code}
    // 发送请求 获取用户的token
    const res = await request({url:"/users/wxlogin",data:loginParams,method:"post"})
    console.log(res)
  
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

 
})