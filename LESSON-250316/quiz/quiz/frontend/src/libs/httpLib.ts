import axios, { type AxiosRequestConfig } from "axios";
import cookieLib from "./cookieLib";

const http = axios.create();

http.interceptors.request.use(
  (config) => {
    const token = cookieLib.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response; // 정상 응답 그대로 반환
  },
  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 리프레시 토큰으로 액세스 토큰을 재요청
          // 다시 axios를 통해 HTTP 요청
          break;

        default:
          window.alert(
            error.response.message ||
              "エラーが発生しました。管理者にお問い合わせください。"
          );
          break;
      }
    }

    return error.response;
  }
);

export default {
  get(url: string, args?: Record<string, any>) {
    const config: AxiosRequestConfig = {};

    if (args) {
      config.params = args;
    }

    return http.get(url, config);
  },
  post(url: string, args?: Record<string, any>) {
    return http.post(url, args);
  },
  put(url: string, args: Record<string, any>) {
    return http.put(url, args);
  },
  delete(url: string) {
    return http.delete(url);
  },
};
