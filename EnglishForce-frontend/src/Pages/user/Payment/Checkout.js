import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import PaymentForm from './paymentForm';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [courseIds, setCourseIds] = useState([]);

  useEffect(() => {
    const items = localStorage.getItem('cartItems');
    if (items) {
      const parsedItems = JSON.parse(items);
      setCartItems(parsedItems);
      const total = parsedItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + price;
      }, 0);
      setTotalAmount(total);
      setCourseIds(parsedItems.map((item) => item.id));
    }
  }, []);

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        {cartItems.length === 0 ? (
          <Typography variant="body1">Your cart is empty.</Typography>
        ) : (
          <>
            <Paper elevation={3} sx={{ padding: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Items in your cart
              </Typography>
              <List>
                {cartItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={item.name}
                        secondary={`Price: $${item.price || 0}`}
                      />
                    </ListItem>
                    {index < cartItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              <Box mt={2}>
                <Typography variant="h6">Total: ${totalAmount}</Typography>
              </Box>
            </Paper>
            <Paper elevation={3} sx={{ padding: 2 }}>
              <PaymentForm totalAmount={totalAmount} courseIds={courseIds} />
            </Paper>
          </>
        )}
      </Box>
    </Container>
  );
};

export default CheckoutPage;