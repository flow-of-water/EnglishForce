import React, { useEffect, useState, useContext } from 'react';
import { Alert, Snackbar } from '@mui/material';

export default function MyAlert({ severity = 'info', message = '', open, onClose }) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={3000}
			onClose={onClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
		>
			<Alert severity={severity}>{message}</Alert>
		</Snackbar>
	);
}
