import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import {
  Box,
  Typography,
  Stack,
  Pagination,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  CardHeader,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QuizIcon from '@mui/icons-material/Quiz';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import CategoryIcon from '@mui/icons-material/Category';
import CircularLoading from '../../../Components/Loading';
import GradientTitle from '../../../Components/GradientTitle';

const ExamPage = () => {
  const [exams, setExams] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const debounceRef = useRef();

  const fetchExams = async (page, searchQuery = '') => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/exams?page=${page}&q=${searchQuery}`);
      setExams(res.data.exams);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch exams', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams(page, query);
  }, [page, query]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setQuery(searchInput);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput]);

  return (
    <Box
      sx={{
        py: 4,
        px: { xs: 2, md: 6 },
        minHeight: '100vh',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          inset: -120,
          zIndex: -1,
          background:
            'radial-gradient(700px 280px at 15% 0%, rgba(33,150,243,0.10), transparent 60%), radial-gradient(700px 240px at 85% 0%, rgba(156,39,176,0.10), transparent 60%)',
        },
      }}
    >
      <GradientTitle>Available Exams</GradientTitle>

      <Typography
        align="center"
        color="text.secondary"
        sx={{ maxWidth: 720, mx: 'auto', mb: 2.5 }}
      >
        Explore our curated list of mock exams designed to help you sharpen your English skills and prepare with confidence.
      </Typography>

      {/* 🔍 Thanh Tìm kiếm */}
      <Box sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search exam..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Loading */}
      {loading ? (
        <CircularLoading />
      ) : (
        <>
          <Grid container spacing={4}>
            {exams.length === 0 ? (
              <Grid item xs={12}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 5,
                    borderRadius: 4,
                    background: 'linear-gradient(180deg, #f8fbff, #f9f5ff)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <Typography variant="h6" fontWeight={800} gutterBottom>
                    No exams available
                  </Typography>
                  <Typography color="text.secondary">
                    Try a different keyword or check back later.
                  </Typography>
                </Box>
              </Grid>
            ) : (
              exams.map((exam) => (
                <Grid key={exam.public_id} item xs={12} sm={6} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 10px 26px rgba(2,24,43,0.06)',
                      transition:
                        'transform .45s cubic-bezier(0.22,1,0.36,1), box-shadow .45s',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.015)',
                        boxShadow: '0 20px 60px rgba(33,150,243,0.18)',
                      },
                      // gradient border
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 4,
                        padding: '1px',
                        background:
                          'linear-gradient(135deg, rgba(33,150,243,0.30), rgba(156,39,176,0.30))',
                        WebkitMask:
                          'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        pointerEvents: 'none',
                      },
                    }}
                  >
                    {/* Header với watermark icon & chips */}
                    <CardHeader
                      avatar={
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            display: 'grid',
                            placeItems: 'center',
                            background:
                              'linear-gradient(145deg, #e3f2fd, #ede7f6)',
                            boxShadow: 'inset 0 0 0 1px rgba(25,118,210,0.15)',
                          }}
                        >
                          <QuizIcon color="primary" />
                        </Box>
                      }
                      title={
                        <Typography
                          variant="h6"
                          fontWeight={800}
                        >
                          {exam.name}
                        </Typography>
                      }
                      subheader={
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} useFlexGap flexWrap="wrap">
                          {/* type */}
                          {exam.type && (
                            <Chip
                              icon={<CategoryIcon />}
                              label={exam.type}
                              size="small"
                              variant="outlined"
                              sx={{
                                borderColor: 'divider',
                                textTransform: 'capitalize',
                                backgroundColor: 'rgba(25,118,210,0.06)',
                              }}
                            />
                          )}
                          {/* duration */}
                          {typeof exam.duration === 'number' && (
                            <Chip
                              icon={<AvTimerIcon />}
                              label={`${exam.duration} min`}
                              size="small"
                              color="info"
                              variant="soft"
                              sx={{
                                bgcolor: 'info.light',
                                color: 'info.dark',
                              }}
                            />
                          )}
                        </Stack>
                      }
                      sx={{
                        pb: 0.5,
                        '& .MuiCardHeader-subheader': { mt: 0.5 },
                      }}
                    />

                    <CardActionArea
                      component={Link}
                      to={`/exams/${exam.public_id}`}
                      sx={{ display: 'block', height: '100%' }}
                    >
                      <CardContent sx={{ pt: 1.5 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            opacity: 0.9,
                          }}
                        >
                          {exam.description || 'No description provided.'}
                        </Typography>

                        <Divider sx={{ my: 1.25, borderColor: 'rgba(0,0,0,0.06)' }} />

                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Chip
                            label="Start Exam"
                            color="primary"
                            variant="outlined"
                            sx={{
                              borderRadius: 999,
                              px: 1.25,
                              fontWeight: 700,
                              letterSpacing: 0.25,
                              transition: 'all .25s',
                              backdropFilter: 'blur(6px)',
                              borderColor: 'primary.main',
                              '&:hover': {
                                boxShadow: '0 10px 24px rgba(33,150,243,0.25)',
                              },
                            }}
                          />
                          {/* light sweep on hover */}
                          <Box
                            sx={{
                              position: 'relative',
                              width: 90,
                              height: 8,
                              borderRadius: 999,
                              background: 'rgba(2,24,43,0.06)',
                              overflow: 'hidden',
                              '&:before': {
                                content: '""',
                                position: 'absolute',
                                inset: 0,
                                transform: 'translateX(-120%)',
                                background:
                                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                                transition: 'transform .8s ease',
                              },
                              '.MuiCard-root:hover &::before': {
                                transform: 'translateX(120%)',
                              },
                            }}
                          />
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </>
      )}

      {totalPages > 1 && !loading && (
        <Stack alignItems="center" mt={6}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Stack>
      )}
    </Box>
  );
};

export default ExamPage;
