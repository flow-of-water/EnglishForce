import {
	getAllUsers,
	getUserById,
	updateUserRole,
	findUserIdByPublicId,
	getUserProfileWithStats,
	getPagingUsers,
	updateAvatar,
	updateUserEmail,
} from '../services/user.service.js';
import { verifyOtp } from '../services/otp/otp.service.js';

export const getAllUsersController = async (req, res) => {
	try {
		const users = await getAllUsers();
		res.status(200).json(users);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ message: 'Error fetching users' });
	}
};

export const getPagingUsersController = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = 6;

		const data = await getPagingUsers(page, limit);
		res.status(200).json(data);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ message: 'Error fetching users' });
	}
};

export const getMyUserAccountController = async (req, res) => {
	try {
		const userId = req.user.id;
		const userWithStats = await getUserProfileWithStats(userId);
		res.status(200).json(userWithStats);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ message: 'Error fetching user by username' });
	}
};

export const getUserByIdController = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await getUserById(userId);
		res.status(200).json(user);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ message: 'Error fetching user by username' });
	}
};

export const updateAvatarController = async (req, res) => {
	try {
		const userId = req.user.id;
		const file = req.file;

		const result = await updateAvatar(userId, file);

		res.json({
			message: 'Avatar updated successfully',
			...result,
		});
	} catch (error) {
		if (error.message == 'No file provided') return res.status(400).json({ error: error.message });
		else if (error.message == 'User not found') return res.status(404).json({ error: error.message });
		res.status(500).json({ error: 'Failed to update avatar' });
	}
};

export const updateEmailController = async (req, res) => {
	try {
		const userId = req.user.id;
		const { email, code } = req.body;

		if (!email || !code) {
			return res.status(400).json({ error: 'email and code are required.' });
		}

		await verifyOtp({ email, code, purpose: 'verify_email' });
		const result = await updateUserEmail(userId, email);

		res.json({ message: 'Email updated successfully.', ...result });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const updateUserRoleController = async (req, res) => {
	try {
		const { publicId } = req.params;
		const id = await findUserIdByPublicId(publicId);

		const { role } = req.body;
		var updatedRole = 'admin';
		if (role == 'admin') updatedRole = 'user';

		if (!id) {
			return res.status(400).json({ error: 'Missing userId' });
		}
		const userRole = await updateUserRole(id, updatedRole);
		res.status(200).json(userRole);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
};
