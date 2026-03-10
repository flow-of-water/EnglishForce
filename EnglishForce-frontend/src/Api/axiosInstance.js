// src/api/axiosInstance.js
import axios from 'axios';
import * as Constants from './../Constants/index.js';

const axiosInstance = axios.create({
	// baseURL: "http://localhost:5000/api",
	// baseURL: "https://elearning-be-water.onrender.com/api",
	baseURL: process.env.REACT_APP_BACKEND_URL + '/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

const COOKIE_ENDPOINTS = ['/auth/login', '/auth/logout', '/auth/refresh-token', '/otp/verify', '/auth/reset-password'];
// Tự động gắn token vào header của mỗi request
axiosInstance.interceptors.request.use(
	config => {
		const needsCookie = COOKIE_ENDPOINTS.some(e => config.url?.includes(e));
		if (needsCookie) config.withCredentials = true;

		const token = localStorage.getItem(Constants.LOCAL_STORAGE.TOKEN);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => Promise.reject(error)
);

// Flag để tránh vòng lặp vô hạn nếu refresh liên tục lỗi
let isRefreshing = false;
let refreshPromise = null;
let subscribers = []; // là array chứa các callback function ; Queue các request đang chờ token mới

function subscribeTokenRefresh(cb) {
	subscribers.push(cb);
}

function notifySubscribers(newToken) {
	// Thông báo token mới cho tất cả request đang chờ → Trigger retry
	subscribers.forEach(cb => cb(newToken));
	subscribers = [];
}

axiosInstance.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config;

		// Nếu token hết hạn và chưa từng thử refresh
		if (error.response && error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			// ---------------------------
			// Case 1: refresh đang chạy → request này CHỜ
			// ---------------------------
			if (isRefreshing) {
				return new Promise(resolve => {
					subscribeTokenRefresh(newToken => {
						originalRequest.headers.Authorization = `Bearer ${newToken}`;
						resolve(axiosInstance(originalRequest));
					});
				});
			}

			// ---------------------------
			// Case 2: chưa refresh → refresh ngay
			// ---------------------------
			else if (!isRefreshing) {
				isRefreshing = true;
				refreshPromise = axios.post(
					process.env.REACT_APP_BACKEND_URL + '/api/auth/refresh-token',
					{},
					{ withCredentials: true }
				);
				try {
					const res = await refreshPromise;
					const newAccessToken = res.data.accessToken;

					localStorage.setItem(Constants.LOCAL_STORAGE.TOKEN, newAccessToken);
					axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

					// thông báo cho những request đang chờ
					notifySubscribers(newAccessToken);
					isRefreshing = false;
					refreshPromise = null;

					console.log('I get access Token again bro');
					return axiosInstance(originalRequest);
				} catch (refreshError) {
					isRefreshing = false;
					refreshPromise = null;
					localStorage.removeItem(Constants.LOCAL_STORAGE.TOKEN);
					localStorage.removeItem(Constants.LOCAL_STORAGE.USERNAME);
					localStorage.removeItem(Constants.LOCAL_STORAGE.USER_ROLE);
					window.location.href = '/login';
					return Promise.reject(refreshError);
				}
			}
		}

		return Promise.reject(error);
	}
);
export default axiosInstance;
