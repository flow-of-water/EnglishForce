// src/Pages/user/Program/ProgramDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box, Typography, Card, CardContent, CardMedia, Divider, Grid, CircularProgress
} from '@mui/material';

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!program) {
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={4}>
        Program not found
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>{program.name}</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>{program.description}</Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>Units</Typography>
      <Grid container spacing={3}>
        {units.map((unit) => (
          <Grid item xs={12} md={6} key={unit.public_id}>
            <Card
              sx={{ display: 'flex', cursor: 'pointer', flexDirection: 'row' }}
              onClick={() => navigate(`/programs/${programPublicId}/units/${unit.public_id}`)}
            >
              <CardMedia
                component="img"
                sx={{ width: 140 }}
                image={unit.thumbnail || '/default-thumbnail.jpg'}
                alt={unit.name}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <CardContent>
                  <Typography variant="h6">{unit.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {unit.description}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProgramDetailPage;
