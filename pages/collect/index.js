// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab栏数据
    tabs: [{
        id: 0,
        value: "商品收藏",
        isActive: true,
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false,
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false,
      },
      {
        id: 3,
        value: "浏览足迹",
        isActive: false,
      },
    ],
    // 缓存中收藏的数据
    collect:[],
  },

 onShow:function(){
  const collect = wx.getStorageSync('collect')||[];
  this.setData({
    collect
  })
 },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    //2 修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    //3 赋值到data中
    this.setData({
      tabs,
    });
  },

  // 标题的点击事件  从子组件传递过来的
  handleTabsItemChange(e) {
    // console.log(e)
    //1 获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 调用方法
    this.changeTitleByIndex(index);
  },

})