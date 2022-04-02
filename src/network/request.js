import axios from 'axios';

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/hy66',
    timeout: 5000
  })

  //axios拦截器
  //请求拦截
  instance.interceptors.request.use(config => {
    // console.log(config);
    //显示请求图标
    //某些请求比如登录 需携带token
    return config
  }, error => {
    console.log(error)
  });

  //响应拦截
  instance.interceptors.response.use(res=>{
    // console.log(res)
    return res.data
  },error => {
    console.log(error)
  })
  //发送真正的网络请求
  //返回值类型Promise
  return  instance(config)
}

// export function request(config,success,failure) {
//   const instance = axios.create({
//     baseURL: 'http://123.207.32.32:8000',
//     timeout: 5000
//   })
//   //发送真正的网络请求
//   instance(config)
//       .then(res=>{
//         // console.log(res)
//         success(res)
//       })
//       .catch(err=>{
//         failure(err)
//       })
// }
