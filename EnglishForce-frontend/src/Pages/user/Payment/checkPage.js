import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutPage from './Checkout.js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_TEST_KEY);

const App = () => {

  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage/>
    </Elements>
  );
};

export default App;
