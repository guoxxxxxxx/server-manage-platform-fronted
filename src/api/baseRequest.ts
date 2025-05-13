const baseURL = "http://127.0.0.1:31500/api/"
export const baseWebsocketUrl = "ws://127.0.0.1:31500/api/websocket/";

import router from "@/router";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useStore } from "@/stores";

// 创建axios实例
const baseRequest = axios.create({
  baseURL,
  timeout: 1000 * 10,
  headers: {
    "Content-Type": "application/json",
  },
});


// 请求拦截器
baseRequest.interceptors.request.use((config) => {
    const store = useStore();
    const token = store.getToken(); // 获取token
    if (token && token.length > 0) {
        config.headers['token'] = token; // 设置请求头携带token
    }
    return config;
}, error => {
    return Promise.reject(error);
})


// 响应拦截器
baseRequest.interceptors.response.use(response => {
    if(response.data.status == 5500 || response.data.status == 5400){
        ElMessage.error(response.data.message)
    }
    else if(response.data.status == 5403){
        ElMessage.warning(response.data.message)
    }
    else if(response.data.status == 5503){
        router.push("/login")
        ElMessage.warning(response.data.message)
    }
    return response;
}, error => {
    return Promise.reject(error);
});

export default baseRequest;