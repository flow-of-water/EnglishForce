import React, { useState, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import axiosInstance from '../../../Api/axiosInstance';
import { CartContext } from "../../../Context/CartContext.js"

const PaymentForm = ({ totalAmount, courseIds }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useContext(CartContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);
    setMessage('');

    try {
      // Chuyển đổi tổng tiền từ USD sang cents
      const amountCents = Math.round(totalAmount * 100);

      // Gọi backend để tạo PaymentIntent
      const response = await axiosInstance.post('/payments/create-payment-intent', {
        amount: amountCents, courseIds
      });

      const data = response.data;

      // Xử lý đơn hàng miễn phí
      if (data.freeOrder) {
        setMessage('Order processed as free. Payment succeeded!');
        localStorage.removeItem('cartItems');
        setIsProcessing(false);
        clearCart();
        return;
      }

      const { clientSecret } = data;
      console.log('Received Data:', data);
      console.log('Received clientSecret:', clientSecret);

      // Xác nhận thanh toán qua Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        setMessage('Payment succeeded!');
        localStorage.removeItem('cartItems');
        console.log(result.paymentIntent);
        clearCart();
      }
    } catch (error) {
      setMessage('Payment failed. Please try again.');
      console.error('Payment error:', error);
    }

    setIsProcessing(false);
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Payment Form
        </Typography>
        <Typography variant="h6" gutterBottom>
          Total: ${totalAmount}
        </Typography>
        <form onSubmit={handleSubmit}>
          {totalAmount > 0 && <Box mb={2} p={2}
            sx={{ border: '1px solid #ccc', borderRadius: 1 }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                  invalid: { color: '#9e2146' },
                },
              }}
            />
          </Box>}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!stripe || isProcessing}
            fullWidth
          >
            {isProcessing ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : `Pay $${totalAmount}`}
          </Button>
        </form>
        {message && (
          <Typography variant="body1" color={message.includes('succeeded') ? 'success' : 'error'} mt={2}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default PaymentForm;