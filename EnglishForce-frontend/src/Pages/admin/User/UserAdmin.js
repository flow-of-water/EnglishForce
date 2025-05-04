// UserTable.js
import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, Button, Typography , 
    TableHead, TableRow, Paper, IconButton,
    Container
} from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';

const UserTable = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch danh sách người dùng từ API
        axiosInstance.get('/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleEdit = async (user) => {
        const response = await axiosInstance.patch(`/users/${user.public_id}`,{
            role: user.role
        })
        setUsers(prevUsers => prevUsers.map(u => u.public_id === user.public_id ? response.data : u));
    };

    const handleDelete = (id) => {
        // Xử lý xóa người dùng
        if (window.confirm('Are you sure you want to delete this user?')) {
            axiosInstance.delete(`/users/${id}`)
                .then(() => {
                    setUsers(users.filter(user => user.id !== id));
                    alert('User deleted successfully.');
                })
                .catch(error => console.error('Error deleting user:', error));
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Manage Users</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={() => handleEdit(user)}>Change role</Button>
                                    {/* <Button onClick={() => handleDelete(user.id)} color="error">Delete</Button> */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default UserTable;
