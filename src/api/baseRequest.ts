const baseURL = "http://127.0.0.1:31500/api/"

import router from "@/router";
import axios from "axios";
import { ElMessage } from "element-plus";
import { ro } from "element-plus/es/locales.mjs";

// 创建axios实例
const baseRequest = axios.create({
  baseURL,
  timeout: 1000 * 3,
  headers: {
    "Content-Type": "application/json",
  },
});


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