export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
         timeoute:10000,
         success:(result)=>{
             resolve(result);
         },
         fail:(err)=>{
             reject(err);
         }
        })
    })
}