// pages/search/index.js

// 引入 用来发送请求的 方法 一定要把路径补全
import { request } from '../../request/index.js';
/** 
 1 输入框绑定值的改变事件 input事件
   1 获取到输入框的值
   2 合法性判断
   3 检验通过 把输入框的值 发送到后台
   4 返回的数据打印到页面上

2 防抖（防止抖动）  定时器 节流
  0 防抖 一般是 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面上拉和下拉
 1定义全局的定时器id 
 * 
*/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],//搜索到的商品数据
   
    isFocus:false, // 取消按钮是否 显示
    inpValue:"",//输入框的值
  },
  Timeid:-1,
  // 输入框的值改变 就会触发的事件
  handleInput(e){
    // 1 获取输入框的值
    const {value} = e.detail;
    // 2 检测合法性
    if(!value.trim()){
      // 值不合法
      this.setData({
        goods:[],
        isFocus:false ,//当输入框没值 清空数组 隐藏取消按钮
      })
      return;
    }

    // 输入框有值 显示取消按钮
    this.setData({
      isFocus:true
    })
    //3 准备发送请求获取数据
    clearTimeout(this.Timeid);//先清除定时器
    this.Timeid=setTimeout(()=>{
      this.qsearch(value);
    },1000)
 
  },
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    console.log(res);
    this.setData({
      goods:res.data.message
    })
  },

  // 点击取消
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }
  
  
})