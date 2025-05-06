import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Card,
    CardContent,
    Container,
    Box,
    CircularProgress,
    Button
} from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';

const DetailProgramAdmin = () => {
    const { publicProgramId } = useParams();
    const navigate = useNavigate();

    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgramDetail = async () => {
            try {
                const res = await axiosInstance.get(`/programs/${publicProgramId}`);
                setProgram(res.data);
            } catch (err) {
                console.error('Failed to fetch program detail:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgramDetail();
    }, [publicProgramId]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress />
            </Box>
        );
    }

    if (!program) {
        return (
            <Typography variant="h6" align="center" color="error" mt={5}>
                Program not found.
            </Typography>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">{program.name}</Typography>
                <Button
                    variant="outlined"
                    onClick={() => navigate(`/admin/programs/${program.public_id}/edit`)}
                >
                    Edit
                </Button>
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
                {program.description}
            </Typography>

            {program.Units?.map((unit, index) => (
                <Card
                    key={unit.public_id}
                    sx={{ mb: 3, cursor: 'pointer' }}
                    onClick={() =>
                        navigate(`/admin/programs/${publicProgramId}/units/${unit.public_id}`)
                    }
                >
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Unit {index + 1}: {unit.name}
                        </Typography>
                        {unit.description && (
                            <Typography variant="body2" color="text.secondary">
                                {unit.description}
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            ))}
        </Container>
    );
};

export default DetailProgramAdmin;
