import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
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
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={4}>
        Unit not found
      </Typography>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>{unit.name}</Typography>
      <Typography variant="subtitle1" gutterBottom>{unit.description}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>Lessons</Typography>
      {unit.Lessons && unit.Lessons.length > 0 ? (
        <List>
          {unit.Lessons
            .sort((a, b) => a.order_index - b.order_index)
            .map((lesson, idx) => (
              <React.Fragment key={lesson.public_id}>
                <ListItem
                  component={Link}
                  to={`/units/${unitPublicId}/lessons/${lesson.public_id}/start`}
                  button
                >
                  <ListItemText
                    primary={`${lesson.order_index + 1}. ${lesson.name}`}
                    secondary={lesson.description}
                  />
                  {lesson.UserProgresses && lesson.UserProgresses.length > 0 && (
                    <Chip label="✅ Completed" color="success" size="small" />
                  ) }
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
        </List>
      ) : (
        <Typography variant="body1" color="text.secondary">
          Không có bài học nào trong unit này.
        </Typography>
      )}
    </Box>
  );
};

export default UnitDetailPage;
