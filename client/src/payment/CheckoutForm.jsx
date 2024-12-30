import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements,
  } from '@stripe/react-stripe-js';
import axios from 'axios';
import useAuthStore from '../store/AuthStore';
const CheckoutForm = ({total, cart, shippingDetails}) => {
  const { token } = useAuthStore();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState(null);
  const [processing, setProcessing] = React.useState(false);

  const handleSubmit = async (event) => {
    console.log("the value is == ")
    event.preventDefault();
    event.stopPropagation();
    if (!stripe || !elements) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/completion-page',
          payment_method_data: {
            billing_details: {
              email: shippingDetails.email,
              name: `${shippingDetails.address}, ${shippingDetails.city}`
            }
          }
        },
        redirect: 'if_required'
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Create order
        await axios.post('http://localhost:5000/create-order', {
          items: cart.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: total,
          status: 'pending',
          shippingAddress: shippingDetails,
          stripePaymentId: paymentIntent.id,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Redirect or show success message
        setProcessing(false);
      }
    } catch (err) {
      setError("Payment failed");
      console.log(err);
      setProcessing(false);
    }
  };

  return (
    <form className=" mx-auto mt-8">
      <div className="mb-4">
        <PaymentElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <button 
        id="stripe-button"
        onClick={handleSubmit}
        disabled={!stripe || processing}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default CheckoutForm;