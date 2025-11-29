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
			localStorage.setItem('token', Constants.LOCAL_STORAGE.TOKEN);
			localStorage.setItem('username', Constants.LOCAL_STORAGE.USERNAME);
			localStorage.setItem('userId', Constants.LOCAL_STORAGE.USER_ID);
			localStorage.setItem('userRole', Constants.LOCAL_STORAGE.USER_ROLE);
			localStorage.setItem('userPublicId', Constants.LOCAL_STORAGE.USER_PUBLIC_ID);
			// navigate('/');   // Điều hướng kiểu này có thể không re-render lại Header -> hiển thị chưa login
			// Lúc đó lại phải thêm location vào useEffect của Header
			window.location.href = '/'; // Reload toàn bộ trang web
		}
	}, []);

	return <div>Login...</div>;
}
