// App.js
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './paymentForm.js';
import CheckoutPage from './Checkout.js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_TEST_KEY);

const App = () => {
  const courseId = 'course_123';
  const courseName = 'Khóa học Node.js';
  const coursePrice = 100; // Giá tính bằng USD

  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage
        courseId={courseId}
        courseName={courseName}
        coursePrice={coursePrice}
      />
    </Elements>
  );
};

export default App;
