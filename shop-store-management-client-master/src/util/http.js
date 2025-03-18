﻿// 引入 axios
import axios from "axios";
import router from "@/router";

// 环境的切换
if (process.env.NODE_ENV == "development") {
  axios.defaults.baseURL = "/api";
} else {
  axios.defaults.baseURL = "/api";
}

// 超时时间
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;
// 响应拦截
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401: // 401 未登录 跳转登录界面
          var path = `/login?redirect=${router.currentRoute.fullPath}`; // 记录跳转登录前的页面
          setTimeout(() => {
            router.replace({
              path: path
            });
          }, 500);
          break;
        case 403:
          router.push({
            path: "/index/forbidden"
          });
      }
    }
    return Promise.reject(error.response);
  }
);

export function get(url, params, config) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      }, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function post(url, params, config) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
