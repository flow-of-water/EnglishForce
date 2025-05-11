import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import CircularLoading from '../../../Components/Loading';
import SchoolIcon from '@mui/icons-material/School';

const ProgramDetailPage = () => {
  const { programPublicId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProgramDetail = async () => {
    try {
      const res = await axiosInstance.get(`/programs/${programPublicId}`);
      setProgram(res.data);
      setUnits(res.data.Units || []);
    } catch (error) {
      console.error('❌ Failed to fetch program detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramDetail();
  }, [programPublicId]);

  if (loading) return <CircularLoading />;

  if (!program) {
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={4}>
        Program not found
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {program.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {program.description}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Units
      </Typography>

      <Grid container spacing={3}>
        {units.map((unit) => (
          <Grid item xs={12} md={6} key={unit.public_id}>
            <Card
              onClick={() =>
                navigate(`/programs/${programPublicId}/units/${unit.public_id}`)
              }
              sx={{
                cursor: 'pointer',
                transition: '0.2s',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">{unit.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {unit.description || 'No description'}
                </Typography>
                {unit.progressStatus && (
                  <Chip
                    label={
                      unit.progressStatus === 'completed'
                        ? '✅ Hoàn thành'
                        : unit.progressStatus === 'in_progress'
                        ? '⏳ Đang học'
                        : '📌 Chưa học'
                    }
                    color={
                      unit.progressStatus === 'completed'
                        ? 'success'
                        : unit.progressStatus === 'in_progress'
                        ? 'warning'
                        : 'default'
                    }
                    size="small"
                    sx={{ mt: 2 }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
        {units.length === 0 && (
          <Typography variant="body2" color="text.secondary" mt={2}>
            Chưa có unit nào trong chương trình này.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ProgramDetailPage;
