import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Divider,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    CircularProgress,
    Box
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';

const DetailExamAdmin = () => {
    const { publicId } = useParams();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExamDetails = async () => {
            try {
                const resExam = await axiosInstance.get(`/exams/${publicId}`);
                // const resQuestions = await axiosInstance.get(`/exams/${publicId}/questions`);

                setExam(resExam.data);
                setQuestions(resExam.data.Questions || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching exam detail:', error);
                setLoading(false);
            }
        };

        fetchExamDetails();
    }, [publicId]);

    if (loading) {
        return (
            <Box mt={4} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    if (!exam) {
        return (
            <Box mt={4} textAlign="center">
                <Typography variant="h6" color="error">
                    Exam not found.
                </Typography>
            </Box>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Exam Detail
            </Typography>

            <Card variant="outlined" sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6">{exam.name}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        {exam.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Duration: {exam.duration} minutes
                    </Typography>
                </CardContent>
            </Card>

            <Typography variant="h5" gutterBottom>
                Questions
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Content</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Record</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions.map((q, index) => (
                            <TableRow key={q.public_id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{q.content}</TableCell>
                                <TableCell>{q.type}</TableCell>
                                <TableCell>
                                    {q.thumbnail && <img src={q.thumbnail} alt="thumb" style={{ width: 50 }} />}
                                </TableCell>
                                <TableCell>
                                    {q.record && (
                                        <audio controls style={{ marginLeft: 8 }}>
                                            <source src={q.record} type="audio/mpeg" />
                                        </audio>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {questions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    No questions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default DetailExamAdmin;
