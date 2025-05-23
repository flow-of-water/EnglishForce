import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosInstance";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from "@mui/material";

const CommentAdmin = () => {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    async function Fetch() {
        try {
            const response = await axiosInstance.get(`/comments`, {
                params: { page } // pass the page number as a query param
            });

            setComments(response.data.comments);
            setTotalPages(response.data.totalPages);

            if (response.data.comments.length == 0 && page > 1) setPage(page - 1);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }
    useEffect(() => {
        Fetch();
    }, [page]);

    const handleDelete = async (commentId) => {
        try {
            await axiosInstance.delete(`/comments/${commentId}`);
            Fetch();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Manage Comments</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Course</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Content</TableCell>
                            <TableCell>Create at</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {comments.map((comment) => (
                            <TableRow key={comment.id}>
                                <TableCell>{comment.Course.name}</TableCell>
                                <TableCell>{comment.User.username}</TableCell>
                                <TableCell>{comment.content}</TableCell>
                                <TableCell>{new Date(comment.created_at).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleDelete(comment.id)} color="error">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {comments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No comments found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {comments.length != 0 && <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)} // Update page state on page change
                color="primary"
                style={{ marginTop: 20 }}
            />}
        </Container>
    );
};

export default CommentAdmin;
