import axios, { type AxiosRequestConfig } from "axios";
import cookieLib from "./cookieLib";

// 환경 변수에서 API URL 가져오기 (Vercel 배포 시 환경 변수 설정 필요)
// 끝의 슬래시 제거하여 정확한 URL 생성
const rawUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8090";
const API_BASE_URL = rawUrl.replace(/\/+$/, ""); // 끝의 슬래시 제거

// 디버깅: 환경 변수 확인 (프로덕션에서도 확인 가능하도록)
console.log("🔍 API_BASE_URL:", API_BASE_URL);
console.log("🔍 VITE_API_BASE_URL env:", import.meta.env.VITE_API_BASE_URL);
console.log("🔍 Mode:", import.meta.env.MODE);

const http = axios.create({
    baseURL: API_BASE_URL,
});

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
                    window.alert(error.response.message || "오류가 있습니다. 관리자에게 문의해주세요.");
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
    }
};