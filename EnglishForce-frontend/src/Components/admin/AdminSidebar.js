import React from "react";
import { Link } from "react-router-dom";
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Divider
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import CommentIcon from "@mui/icons-material/Comment";
import QuizIcon from '@mui/icons-material/Quiz';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TaskIcon from '@mui/icons-material/Task';
 
const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleSidebar}>
      <div className="admin-sidebar p-3" style={{ width: 250 }}>
        <h4 className="text-center">Admin Panel</h4>

        <List>
          <ListItem button component={Link} to="/admin">
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>

        <Divider />

        <List
          subheader={
            <ListSubheader component="div">User Management</ListSubheader>
          }
        >
          <ListItem button component={Link} to="/admin/users">
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
        </List>

        <Divider />

        <List
          subheader={
            <ListSubheader component="div">Course Management</ListSubheader>
          }
        >
          <ListItem button component={Link} to="/admin/courses">
            <ListItemIcon><SchoolIcon /></ListItemIcon>
            <ListItemText primary="Courses" />
          </ListItem>
          <ListItem button component={Link} to="/admin/comments">
            <ListItemIcon><CommentIcon /></ListItemIcon>
            <ListItemText primary="Comments" />
          </ListItem>
        </List>

        <Divider />

        <List
          subheader={
            <ListSubheader component="div">Exam Management</ListSubheader>
          }
        >
          <ListItem button component={Link} to="/admin/exams">
            <ListItemIcon><QuizIcon /></ListItemIcon>
            <ListItemText primary="Exams" />
          </ListItem>
          <ListItem button component={Link} to="/admin/exam-attempts">
            <ListItemIcon><TaskIcon /></ListItemIcon>
            <ListItemText primary="Exam Attempts" />
          </ListItem>
        </List>

        <Divider />

        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <ExitToAppIcon sx={{ transform: "rotate(180deg)" }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default AdminSidebar;
