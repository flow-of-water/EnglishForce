import db from '../sequelize/models/index.js'; // Sequelize instance
const { User } = db;

export const findUserIdByPublicId = async (publicId) => {
  const user = await User.findOne({ where: { public_id: publicId } });
  if (!user) throw new Error('User not found with that public_id');
  return user.id ;
}

// Tạo user mới
export const createUser = async (username, hashedPassword) => {
  return await User.create({
    username,
    password: hashedPassword,
    role: 'user'
  });
};

export const getAllUsers = async () => {
  const users = await User.findAll({
    order: [['id', 'ASC']],
  });
  return users;
};

export const getNumberOfUsers = async () => {
  const count = await User.count();
  return count;
};

// Tìm user theo username
export const getUserByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};


// Tìm user theo id
export const getUserById = async (id) => {
  return await User.findByPk(id);
};


export const updateUserPassword = async (id, hashedPassword) => {
  return await User.update(
    { password: hashedPassword },
    { where: { id: id } }
  );
};

export const deleteUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  await user.destroy();
  return user;
};

export const updateUserRole = async (id, role) => {
  const [updatedCount, [updatedUser]] = await User.update(
    { role },
    {
      where: { id },
      returning: true,
    }
  );

  return updatedUser || null;
};

// OAuth serve
export async function findOrCreateUser(profile) {
  const email = profile.email; // Set username = email if login with Google, facebook
  const name = profile.username;

  // Tìm hoặc tạo user
  const [user, created] = await User.findOrCreate({
    where: { username: email },
    defaults: {
      email:email,
      password: email,
      role: 'user'
    }
  });

  return user;
}