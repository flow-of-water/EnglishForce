import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box, Typography, Card, CardContent, List, ListItem, ListItemText, Divider
} from '@mui/material';
import CircularLoading from '../../../Components/Loading'; 

const UnitDetailPage = () => {
  const { unitPublicId } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUnitDetail = async () => {
    try {
      const res = await axiosInstance.get(`/units/${unitPublicId}`);
      setUnit(res.data);
    } catch (err) {
      console.error("Error loading unit:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnitDetail();
  }, [unitPublicId]);

  if (loading) {
    return <CircularLoading />;
  }

  if (!unit) {
    return <Typography variant="h6" color="error" textAlign="center" mt={4}>Unit not found</Typography>;
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>{unit.name}</Typography>
      <Typography variant="subtitle1" gutterBottom>{unit.description}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>Lessons</Typography>
      <List>
        {unit.Lessons.map((lesson, idx) => (
          <React.Fragment key={lesson.public_id}>
            <ListItem
              component={Link}
              to={`/lessons/${lesson.public_id}/start`}
              button
            >
              <ListItemText
                primary={`Lesson ${lesson.order_index + 1}: ${lesson.name}`}
                secondary={lesson.description}
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default UnitDetailPage;
