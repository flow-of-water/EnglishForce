import React, { useState, useEffect } from 'react';
import {
	Container,
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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	IconButton,
	Box,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axiosInstance from '../../../Api/axiosInstance';
import CircularLoading from '../../../Components/Loading';
import GradientTitle from '../../../Components/GradientTitle';

const BlogCategoryAdmin = () => {
	const [categories, setCategories] = useState([]);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(1);
	const [loading, setLoading] = useState(true);

	// Dialog states
	const [openDialog, setOpenDialog] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [currentCategory, setCurrentCategory] = useState({
		name: '',
		description: '',
		color: '#007BFF',
		allowed_roles: '',
	});

	useEffect(() => {
		fetchCategories();
	}, [page]);

	const fetchCategories = async () => {
		try {
			setLoading(true);
			const response = await axiosInstance.get(`/blog-categories?page=${page}`);
			setCategories(response.data.categories);
			setPageCount(response.data.totalPages);
		} catch (error) {
			console.error('Error fetching blog categories:', error);
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const handleOpenDialog = (category = null) => {
		if (category) {
			setEditMode(true);
			setCurrentCategory(category);
		} else {
			setEditMode(false);
			setCurrentCategory({ name: '', description: '', color: '#007BFF', allowed_roles: '' });
		}
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setCurrentCategory({ name: '', description: '', color: '#007BFF', allowed_roles: '' });
	};

	const handleSave = async () => {
		try {
			if (editMode) {
				// Update existing category
				await axiosInstance.put(`/blog-categories/${currentCategory.public_id}`, {
					name: currentCategory.name,
					description: currentCategory.description,
					color: currentCategory.color,
					allowed_roles: currentCategory.allowed_roles,
				});
			} else {
				// Create new category
				await axiosInstance.post('/blog-categories', {
					name: currentCategory.name,
					description: currentCategory.description,
					color: currentCategory.color,
					allowed_roles: currentCategory.allowed_roles,
				});
			}
			handleCloseDialog();
			fetchCategories();
		} catch (error) {
			console.error('Error saving category:', error);
			alert(error?.response?.data?.error || 'Failed to save category');
		}
	};

	const handleDelete = async publicId => {
		if (
			window.confirm(
				'Are you sure you want to delete this category? This will remove it from all associated blogs.'
			)
		) {
			try {
				await axiosInstance.delete(`/blog-categories/${publicId}`);
				setCategories(categories.filter(cat => cat.public_id !== publicId));
			} catch (error) {
				console.error('Error deleting category:', error);
				alert('Failed to delete category');
			}
		}
	};

	if (loading) return <CircularLoading />;

	return (
		<Container sx={{ mt: 4 }}>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
				<GradientTitle align="left">Blog Categories Management</GradientTitle>
				<Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
					Create Category
				</Button>
			</Stack>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>#</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Color</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Allowed Roles</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{categories.map((category, index) => (
							<TableRow key={category.public_id}>
								<TableCell>{(page - 1) * 10 + index + 1}</TableCell>
								<TableCell>
									<span>{category.name}</span>
								</TableCell>
								<TableCell>
									<Stack direction="row" alignItems="center" spacing={1}>
										<Box
											sx={{
												width: 20,
												height: 20,
												borderRadius: '4px',
												backgroundColor: category.color || '#007BFF',
												border: '1px solid #ddd',
											}}
										/>
										<span>{category.color}</span>
									</Stack>
								</TableCell>
								<TableCell>{category.description || 'No description'}</TableCell>
								<TableCell>{category.allowed_roles || 'All roles'}</TableCell>
								<TableCell>
									<Stack direction="row" spacing={1}>
										<IconButton
											color="primary"
											size="small"
											onClick={() => handleOpenDialog(category)}
										>
											<Edit />
										</IconButton>
										<IconButton
											color="error"
											size="small"
											onClick={() => handleDelete(category.public_id)}
										>
											<Delete />
										</IconButton>
									</Stack>
								</TableCell>
							</TableRow>
						))}
						{categories.length === 0 && (
							<TableRow>
								<TableCell colSpan={5} align="center">
									No categories found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{categories.length !== 0 && (
				<Pagination
					count={pageCount}
					page={page}
					onChange={handlePageChange}
					color="primary"
					sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
				/>
			)}

			{/* Create/Edit Dialog */}
			<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
				<DialogTitle>{editMode ? 'Edit Category' : 'Create Category'}</DialogTitle>
				<DialogContent>
					<Stack spacing={2} sx={{ mt: 1 }}>
						<TextField
							label="Category Name"
							fullWidth
							required
							value={currentCategory.name}
							onChange={e => setCurrentCategory({ ...currentCategory, name: e.target.value })}
						/>
						<TextField
							label="Description"
							fullWidth
							multiline
							rows={3}
							value={currentCategory.description}
							onChange={e => setCurrentCategory({ ...currentCategory, description: e.target.value })}
						/>

						{/* Color Picker */}
						<Box>
							<Typography variant="subtitle2" gutterBottom>
								Category Color
							</Typography>
							<Stack direction="row" spacing={2} alignItems="center">
								<input
									type="color"
									value={currentCategory.color}
									onChange={e => setCurrentCategory({ ...currentCategory, color: e.target.value })}
									style={{
										width: '60px',
										height: '40px',
										border: '1px solid #ccc',
										borderRadius: '4px',
										cursor: 'pointer',
									}}
								/>
								<TextField
									value={currentCategory.color}
									onChange={e => setCurrentCategory({ ...currentCategory, color: e.target.value })}
									placeholder="#007BFF"
									size="small"
									sx={{ width: '120px' }}
									inputProps={{
										style: { fontFamily: 'monospace' },
									}}
								/>
							</Stack>
						</Box>

						{/* Allowed Roles */}
						<FormControl fullWidth>
							<InputLabel>Allowed Roles</InputLabel>
							<Select
								label="Allowed Roles"
								value={currentCategory.allowed_roles || ''}
								onChange={e =>
									setCurrentCategory({ ...currentCategory, allowed_roles: e.target.value })
								}
							>
								<MenuItem value="">All roles</MenuItem>
								<MenuItem value="user">User</MenuItem>
								<MenuItem value="admin">Admin</MenuItem>
							</Select>
						</FormControl>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button onClick={handleSave} variant="contained" disabled={!currentCategory.name.trim()}>
						{editMode ? 'Update' : 'Create'}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default BlogCategoryAdmin;
