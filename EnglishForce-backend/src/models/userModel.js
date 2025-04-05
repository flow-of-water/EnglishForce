import db from "../config/db.js";

export const createUser = async (username, hashedPassword) => {
  const result = await db.query(
    "INSERT INTO users (username, password,role) VALUES ($1, $2, $3) RETURNING *",
    [username, hashedPassword,"user"]
  );
  return result.rows[0];
};

export const getUserByUsername = async (username) => {
  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

export const getAllUsers = async () => {
  const result = await db.query('SELECT * FROM users ORDER BY id ASC;');
  return result.rows;
};

export const getNumberOfUsers = async() => {
  const result = await db.query("SELECT COUNT(*) FROM users") ;
  return result.rows[0].count ;
}

export const getUserById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1;';
  const values = [id];
  const result = await db.query(query, values);
  return result.rows[0];
};


// Xóa người dùng
export const deleteUserById = async (id) => {
  const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
  const values = [id];
  const result = await db.query(query, values);
  return result.rows[0];
};


export const updateUser = async (id, name, password, role) => {
  const query = `
    UPDATE users
    SET name = $1, password = $2, role = $3
    WHERE id = $4
    RETURNING *;
  `;
  const values = [name, password, role, id];
  const result = await db.query(query, values);
  return result.rows[0];
};

export const updateUserPassword = async (userId, hashedPassword) => {
  return db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
};

export const updateUserRole = async (id, role) => {
  const query = `
    UPDATE users
    SET role = $1
    WHERE id = $2
    RETURNING *;
  `;
  const values = [role, id];
  const result = await db.query(query, values);
  return result.rows[0];
};


// OAuth serve
export async function findOrCreateUser(profile) {
  const email = profile.email;
  const name = profile.username;

  let user = await db.query('SELECT * FROM users WHERE username = $1', [email]);
  if (user.rows.length > 0) return user.rows[0];

  const newUser = await db.query(
    'INSERT INTO users(username, password, role) VALUES($1, $2, $3) RETURNING *',
    [email, email, 'user']
  );
  return newUser.rows[0];
}