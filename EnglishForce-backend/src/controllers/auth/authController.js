import { hashValue, verifyHash } from "../../utils/hashing.js";
import jwt from "jsonwebtoken";
import * as userService from "../../services/user.service.js"

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret";
const refreshSecret = process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    jwtSecret,
    { expiresIn: "20h" } 
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    refreshSecret,
    { expiresIn: "7d" } 
  );

  return { accessToken, refreshToken };
};


// Sign up - Đăng ký
export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await userService.getUserByUsername(username);
    if (existingUser) return res.status(409).json({ message: 'Username already taken' });

    const hashedPassword = await hashValue(password);
    const newUser = await userService.createUser(username, hashedPassword);
    res.status(201).json({ message: "User registered", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Sign in - Đăng nhập
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userService.getUserByUsername(username);
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await verifyHash(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({ accessToken, refreshToken , id: user.id , role:user.role  });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Change Password 
export const changePassword = async (req, res) => {
  const userId = req.user.id ;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User don't exists" });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await verifyHash(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedPassword = await hashValue(newPassword);

    await userService.updateUserPassword(userId, hashedPassword);

    res.status(200).json({ message: 'Password was changed' });
  } catch (error) {
    res.status(500).json({ message: 'Error when changing password', error });
  }
}

// refesh access token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body; // ✅ đổi tên rõ ràng, trùng với FE

  if (!refreshToken) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  try {
    // ✅ Xác thực refresh token
    const payload = jwt.verify(refreshToken, refreshSecret);

    // ✅ Lấy lại user từ DB
    const user = await userService.getUserById(payload.id);
    if (!user) {
      return res.status(403).json({ message: "User no longer exists" });
    }

    // ✅ Tạo access token mới
    const {accessToken} = generateTokens(user) ;

    res.json({ accessToken });

  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};





// ___ OAuth ___
// Google and Facebook
export const OAuthCallback = async (req, res) => {
  const user = await userService.findOrCreateUser(req.user); // req.user chính là Googleuser Hoặc Facebookuser
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '48h' }
  );

  res.redirect(process.env.FRONT_END_URL + `/login/success?token=${token}&username=${user.username}&userid=${user.id}&role=${user.role}`);
};
