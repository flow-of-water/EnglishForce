// src/pages/LoginSuccess.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Constants from '../../../Constants/index.js';

export default function GoogleLoginSuccess() {
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const token = params.get('token');
		const username = params.get('username');
		const userid = params.get('userid');
		const userPublicId = params.get('userPublicId');
		const role = params.get('role');
		if (token) {
			localStorage.setItem(Constants.LOCAL_STORAGE.ACCESS_TOKEN, token);
			localStorage.setItem(Constants.LOCAL_STORAGE.USERNAME, username);
			localStorage.setItem(Constants.LOCAL_STORAGE.USER_ID, userid);
			localStorage.setItem(Constants.LOCAL_STORAGE.USER_ROLE, role);
			localStorage.setItem(Constants.LOCAL_STORAGE.USER_PUBLIC_ID, userPublicId);
			// navigate('/');   // Điều hướng kiểu này có thể không re-render lại Header -> hiển thị chưa login
			// Lúc đó lại phải thêm location vào useEffect của Header
			window.location.href = '/'; // Reload toàn bộ trang web
		}
	}, []);

	return <div>Login...</div>;
}
