import db from "../config/db.js"

export const getMessages = async (senderId, receiverId) => {
    const query = `
            SELECT * FROM messages 
            WHERE (sender_id = $1 AND receiver_id = $2) 
            OR (sender_id = $2 AND receiver_id = $1) 
            ORDER BY timestamp ASC
        `;
    const result = await db.query(query, [senderId, receiverId]);
    return result.rows;
}

export const sendMessage = async (senderId, receiverId, content) => {
    const query = `
            INSERT INTO messages (sender_id, receiver_id, content) 
            VALUES ($1, $2, $3) RETURNING *
        `;
    const result = await db.query(query, [senderId, receiverId, content]);
    return result.rows[0];
}

