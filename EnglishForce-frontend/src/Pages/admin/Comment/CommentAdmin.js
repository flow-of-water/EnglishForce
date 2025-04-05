import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Api/axiosInstance";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from "@mui/material";

const CommentAdmin = () => {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function Fetch() {
            try {
                // Send the page number as a query parameter to the backend
                const response = await axiosInstance.get(`/comments`, {
                    params: { page } // pass the page number as a query param
                });

                setComments(response.data.comments); // Assuming response has comments data
                setTotalPages(response.data.totalPages); // Assuming response includes total pages info
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        }
        Fetch();
    }, [page]);

    const handleDelete = async (commentId) => {
        try {
            await axiosInstance.delete(`/comments/${commentId}`);
            setComments(comments.filter(comment => comment.comment_id !== commentId)); // Update list after deletion
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Manage Comments</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Content</TableCell>
                            <TableCell>Create at</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {comments.map((comment) => (
                            <TableRow key={comment.comment_id}>
                                <TableCell>{comment.comment_id}</TableCell>
                                <TableCell>{comment.user_id}</TableCell>
                                <TableCell>{comment.content}</TableCell>
                                <TableCell>{new Date(comment.created_at).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleDelete(comment.comment_id)} color="error">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)} // Update page state on page change
                color="primary"
                style={{ marginTop: 20 }}
            />
        </Container>
    );
};

export default CommentAdmin;
