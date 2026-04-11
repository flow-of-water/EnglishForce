import React, { useState, useEffect } from 'react';
import {
	Container,
	Typography,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Pagination,
	Stack,
	Avatar,
	Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../Api/axiosInstance';
import { Add } from '@mui/icons-material';
import CircularLoading from '../../../Components/Loading';
import GradientTitle from '../../../Components/GradientTitle';

const BlogAdmin = () => {
	const [blogs, setBlogs] = useState([]);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchBlogs() {
			try {
				setLoading(true);
				const response = await axiosInstance.get(`/blogs/?page=${page}`);
				setBlogs(response.data.blogs);
				setPageCount(response.data.totalPages);
			} catch (error) {
				console.error('Error fetching blogs:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchBlogs();
	}, [page]);

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const handleDelete = async publicId => {
		if (window.confirm('Are you sure you want to delete this blog?')) {
			try {
				await axiosInstance.delete(`/blogs/${publicId}`);
				setBlogs(blogs.filter(blog => blog.public_id !== publicId));
			} catch (error) {
				console.error('Error deleting blog:', error);
				alert('Failed to delete blog');
			}
		}
	};

	if (loading) return <CircularLoading />;

	return (
		<Container sx={{ mt: 4 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
				<GradientTitle align="left">Blog Management</GradientTitle>
				<Button variant="contained" startIcon={<Add />} href="/blogs/create">
					Create Blog
				</Button>
			</Stack>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>#</TableCell>
							<TableCell>Thumbnail</TableCell>
							<TableCell>Title</TableCell>
							<TableCell>Author</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Categories</TableCell>
							<TableCell>Created At</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{blogs.map((blog, index) => (
							<TableRow key={blog.public_id}>
								<TableCell>{(page - 1) * 6 + index + 1}</TableCell>
								<TableCell>
									<Avatar
										src={blog.thumbnail}
										alt={blog.name}
										variant="rounded"
										sx={{ width: 60, height: 60 }}
									/>
								</TableCell>
								<TableCell>{blog.name}</TableCell>
								<TableCell>{blog.User?.username || 'Unknown'}</TableCell>
								<TableCell>
									{blog.description?.substring(0, 50)}
									{blog.description?.length > 50 && '...'}
								</TableCell>
								<TableCell>
									<Stack direction="row" spacing={0.5} flexWrap="wrap">
										{blog.BlogCategories?.slice(0, 2).map(category => (
											<Chip
												key={category.id}
												label={category.name}
												size="small"
												sx={{ mb: 0.5, backgroundColor: category.color }}
											/>
										))}
										{blog.BlogCategories?.length > 2 && (
											<Chip label={`+${blog.BlogCategories.length - 2}`} size="small" />
										)}
									</Stack>
								</TableCell>
								<TableCell>{new Date(blog.created_at).toLocaleDateString()}</TableCell>
								<TableCell>
									<Stack direction="row" spacing={1}>
										<Button
											color="primary"
											component={Link}
											to={`/admin/blogs/${blog.public_id}`}
											size="small"
										>
											Detail
										</Button>
										<Button color="error" onClick={() => handleDelete(blog.public_id)} size="small">
											Delete
										</Button>
									</Stack>
								</TableCell>
							</TableRow>
						))}
						{blogs.length === 0 && (
							<TableRow>
								<TableCell colSpan={8} align="center">
									No blogs found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{blogs.length !== 0 && (
				<Pagination
					count={pageCount}
					page={page}
					onChange={handlePageChange}
					color="primary"
					sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
				/>
			)}
		</Container>
	);
};

export default BlogAdmin;
