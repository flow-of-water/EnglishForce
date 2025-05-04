import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Stack,
  Pagination
} from '@mui/material';

const ProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPrograms = async (page) => {
    try {
      const res = await axiosInstance.get(`/programs?page=${page}`);
      setPrograms(res.data.programs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch programs', err);
    }
  };

  useEffect(() => {
    fetchPrograms(page);
  }, [page]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Learning Programs
      </Typography>

      <List>
        {programs.map((program) => (
          <ListItem
            key={program.public_id}
            button
            component={Link}
            to={`/programs/${program.public_id}`}
          >
            <ListItemText
              primary={program.name}
              secondary={program.description}
            />
          </ListItem>
        ))}
        {programs.length === 0 && (
          <ListItem>
            <ListItemText primary="No learning programs available." />
          </ListItem>
        )}
      </List>

      {/* Pagination */}
      {/* <Stack alignItems="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Stack> */}
    </Box>
  );
};

export default ProgramPage;
