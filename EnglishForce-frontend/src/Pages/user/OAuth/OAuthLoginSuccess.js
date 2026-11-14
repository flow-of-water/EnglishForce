// src/pages/LoginSuccess.js
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Constants from '../../../Constants/index.js';

export default function GoogleLoginSuccess() {
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const username = params.get('username');
		const userid = params.get('userid');
		const userPublicId = params.get('userPublicId');
		const role = params.get('role');

		// Backend đã set cookie refreshToken ở OAuth callback → dùng nó để lấy accessToken
		axios
			.post(process.env.REACT_APP_BACKEND_URL + '/api/auth/refresh-token', {}, { withCredentials: true })
			.then(res => {
				localStorage.setItem(Constants.LOCAL_STORAGE.ACCESS_TOKEN, res.data.accessToken);
				localStorage.setItem(Constants.LOCAL_STORAGE.USERNAME, username);
				localStorage.setItem(Constants.LOCAL_STORAGE.USER_ID, userid);
				localStorage.setItem(Constants.LOCAL_STORAGE.USER_ROLE, role);
				localStorage.setItem(Constants.LOCAL_STORAGE.USER_PUBLIC_ID, userPublicId);
				// navigate('/');   // Điều hướng kiểu này có thể không re-render lại Header -> hiển thị chưa login
				// Lúc đó lại phải thêm location vào useEffect của Header
				window.location.href = '/'; // Reload toàn bộ trang web
			})
			.catch(() => navigate('/login'));
	}, []);

	return <div>Login...</div>;
}
