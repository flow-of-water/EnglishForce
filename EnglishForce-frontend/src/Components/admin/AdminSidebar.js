import React from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Divider } from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import CommentIcon from '@mui/icons-material/Comment';
import QuizIcon from '@mui/icons-material/Quiz';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import TaskIcon from '@mui/icons-material/Task';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology'; // cho Chatbot
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import FeedbackIcon from '@mui/icons-material/Feedback';

import { useTranslation } from 'react-i18next';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
	const { t } = useTranslation('common');

	return (
		<Drawer anchor="left" open={isOpen} onClose={toggleSidebar}>
			<div className="admin-sidebar p-3" style={{ width: 250, marginTop: '64px' }}>
				<h4 className="text-center">{t('navAdmin.title')}</h4>

				<List>
					<ListItem button component={Link} to="/admin">
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.dashboard')} />
					</ListItem>
				</List>

				<Divider />

				<List subheader={<ListSubheader component="div">{t('navAdmin.userManagement')}</ListSubheader>}>
					<ListItem button component={Link} to="/admin/users">
						<ListItemIcon>
							<PeopleIcon />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.users')} />
					</ListItem>
				</List>

				<Divider />

				<List subheader={<ListSubheader component="div">{t('navAdmin.courseManagement')}</ListSubheader>}>
					<ListItem button component={Link} to="/admin/courses">
						<ListItemIcon>
							<SchoolIcon />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.courses')} />
					</ListItem>
					<ListItem button component={Link} to="/admin/comments">
						<ListItemIcon>
							<CommentIcon />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.comments')} />
					</ListItem>
				</List>

				<Divider />

				<List subheader={<ListSubheader component="div">{t('navAdmin.examManagement')}</ListSubheader>}>
					<ListItem button component={Link} to="/admin/exams">
						<ListItemIcon>
							<QuizIcon />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.exams')} />
					</ListItem>
					<ListItem button component={Link} to="/admin/exam-attempts">
						<ListItemIcon>
							<TaskIcon />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.examAttempts')} />
					</ListItem>
				</List>

				<Divider />

				<List subheader={<ListSubheader component="div">{t('navAdmin.programManagement')}</ListSubheader>}>
					<ListItem button component={Link} to="/admin/programs">
						<ListItemIcon>
							<MenuBookIcon />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.programs')} />
					</ListItem>
					{/* <ListItem button component={Link} to="/admin/units">
            <ListItemIcon><ViewModuleIcon /></ListItemIcon>
            <ListItemText primary="Units" />
          </ListItem>
          <ListItem button component={Link} to="/admin/lessons">
            <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
            <ListItemText primary="Lessons" />
          </ListItem>
          <ListItem button component={Link} to="/admin/exercises">
            <ListItemIcon><CheckCircleIcon /></ListItemIcon>
            <ListItemText primary="Exercises" />
          </ListItem> */}
				</List>

				<Divider />

				<List subheader={<ListSubheader component="div">{t('navAdmin.blogManagement')}</ListSubheader>}>
					<ListItem button component={Link} to="/admin/blogs">
						<ListItemIcon>
							<ArticleIcon />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.blogs')} />
					</ListItem>
					<ListItem button component={Link} to="/admin/blog-categories">
						<ListItemIcon>
							<CategoryIcon />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.blogCategories')} />
					</ListItem>
				</List>

				<Divider />

				<List subheader={<ListSubheader component="div">{t('navAdmin.feedbackManagement')}</ListSubheader>}>
					<ListItem button component={Link} to="/admin/feedbacks">
						<ListItemIcon>
							<FeedbackIcon />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.feedbacks')} />
					</ListItem>
				</List>

				<Divider />

				<List subheader={<ListSubheader component="div">{t('navAdmin.aiManagement')}</ListSubheader>}>
					<ListItem button component={Link} to="/admin/ai">
						<ListItemIcon>
							<PsychologyIcon />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.chatbotAndRecommend')} />
					</ListItem>
				</List>

				<Divider />

				<List>
					<ListItem button component={Link} to="/">
						<ListItemIcon>
							<ExitToAppIcon sx={{ transform: 'rotate(180deg)' }} />
						</ListItemIcon>
						<ListItemText primary={t('navAdmin.backToHome')} />
					</ListItem>
				</List>
			</div>
		</Drawer>
	);
};

export default AdminSidebar;
