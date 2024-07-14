import React, { useState } from 'react';
import { Blockquote } from 'flowbite-react';
import { Box, Button, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import me from '../assets/myImage.png';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function About() {
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay(amount) {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const result = await axios.post(`${import.meta.env.VITE_BACKEND}/payment/orders`, { amount: amount * 100 });

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }

    const { amount: orderAmount, id: order_id, currency } = result.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount: orderAmount.toString(),
      currency: currency,
      name: 'Abhinandan Gupta',
      description: 'Test Transaction',
      image: me,
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const result = await axios.post(`${import.meta.env.VITE_BACKEND}/payment/success`, data);

        alert(result.data.msg);
      },
      prefill: {
        name: 'Abhinandan Gupta',
        email: 'abhinandangupta1105@gmail.com',
        contact: '9882716924',
      },
      notes: {
        address: 'Abhinandan Gupta Chitkara University, Baddi',
      },
      theme: {
        color: '#61dafb',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate(-1)}
        sx={{ position: 'absolute', top: 20, left: 20 }}
      >
        Back
      </Button>

      <Blockquote className="my-4 border-l-4 border-gray-300 bg-gray-100 p-4 dark:border-gray-500 dark:bg-gray-800 mb-10 max-w-[50vw]">
        "At Blogosphere, we believe in the power of ideas to inspire change. Join us on a journey of discovery, empowerment, and innovation as we explore the world together with words!"
      </Blockquote>

      <Box display="flex" alignItems="center" justifyContent="center" height="50vh">
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={5} p={3} boxShadow={3} borderRadius={2} width={'50vw'}>
          <Box>
            <Typography variant="h5" gutterBottom fontSize={29}>
              Meet the creator of this app, <br />Abhinandan Gupta
            </Typography>
            <Typography variant="body2" fontSize={18} gutterBottom>
              Abhinandan is an aspiring full stack web developer with a passion for creating dynamic and responsive web applications.
            </Typography>
            <Typography variant="body1" fontSize={20} gutterBottom>
              Donate to support the creator! 💰
            </Typography>
            <Box display="flex" alignItems="center" gap={3}>
              <input
                type="number"
                value={amount}
                placeholder="Enter amount"
                onChange={(e) => setAmount(e.target.value)}
                className='rounded-full shadow mt-4 '
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => displayRazorpay(amount)}
              >
                Buy Now
              </Button>
            </Box>
          </Box>
          <Box>
            <Avatar src={me} alt="Abhinandan Gupta" sx={{ width: 160, height: 160, mb: 2 }} />
          </Box>
        </Box>
      </Box>
      <ToastContainer/>
    </div>
  );
}

export default About;
