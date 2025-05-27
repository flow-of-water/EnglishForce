import React, { useEffect, useState } from 'react';
import { Grid, Pagination, Typography } from '@mui/material';
import axiosInstance from '../../Api/axiosInstance';
import CourseCard from './CourseCard';
import CircularLoading from '../Loading';

const ITEMS_PER_PAGE = 6;

const RecommendedCourses = ({ active }) => {
  const [allCourses, setAllCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axiosInstance.post('/AI/recommendations', {
          n_recommendations: 18
        });
        const courses = res.data?.recommendations || [];
        setAllCourses(courses);
        setCurrentPage(1); // Reset về trang đầu
        setLoading(false);
      } catch (err) {
        console.error('Failed to load recommended courses:', err);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [active]);

  useEffect(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    setDisplayedCourses(allCourses.slice(start, start + ITEMS_PER_PAGE));
  }, [currentPage, allCourses]);

  const handlePageChange = (e, value) => {
    setCurrentPage(value);
  };

  if (loading) return <CircularLoading />;

  return (
    <>
      {allCourses.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          No recommended courses available.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {displayedCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>

          <Pagination
            count={Math.ceil(allCourses.length / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
          />
        </>
      )}
    </>
  );
};

export default RecommendedCourses;
