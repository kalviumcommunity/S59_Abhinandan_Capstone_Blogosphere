import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';
import robo from '../assets/Cartoon Style Robot.png';
import '../Css/AIChat.css';
import { useSnackbar } from 'notistack';
import BarLoader from 'react-spinners/BarLoader'

function AIChat() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("");

  const greetingMessages = [
    "Hi, how can I assist you today?",
    "Hello! What can I help you with today?",
    "Greetings! How may I be of service today?",
    "Hey there! Need any help?",
    "Hi, what can I do for you today?",
    "Hello, how can I help you?",
    "Hi, feel free to ask me anything!",
    "Hey! How can I assist you?"
  ];

  const randomGreet = () => {
    const randomIndex = Math.floor(Math.random() * greetingMessages.length);
    return greetingMessages[randomIndex];
  };

  useEffect(() => {
    setGreeting(randomGreet());
  }, []);


  const handleQuestionsResponse = async (e) => {
    e.preventDefault();
    setError("");
    setResponse("");
    setCopied(false);
    setLoading(true)

    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Authorization token not found.');
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND}/genAI`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setResponse(data.response);
    } 
    catch (error) {
      console.error('Error asking Question', error);
      setError(error.message);
    }
    finally{
      setLoading(false)
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response)
        .then(() => {
          setCopied(true);
          enqueueSnackbar('Copied successfully!', { variant: 'success' });
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy text: ', err));
    }
  };

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gray-100'>
      <div className='bg-white p-6 rounded-lg shadow-lg h-5/6 w-5/6'>
        <form onSubmit={handleQuestionsResponse}>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-4xl font-bold text-center flex-grow'>AI Chat Bot</h2>
          </div>
          <input
            type="text"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className='border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          {loading ? (
            <div className='flex justify-center '>
              <BarLoader width= "100vw" color="#3b82f6" loading={loading} />
            </div>
          ) : (
            <button type='submit' className='bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition'>
              Submit
            </button>
          )}
        </form>
        {error && <p className='text-red-500 mt-4 text-center'>{error}</p>}
        {response && (
          <div className='mt-4 bg-gray-100 p-4 rounded h-auto max-h-96 overflow-y-auto'>
            <ReactMarkdown className='text-lg'>{response}</ReactMarkdown>
            <button
              onClick={handleCopy}
              className='mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition'
            >
              Copy to Clipboard
            </button>
            {copied && <p className='text-green-500 mt-2 text-center'>Copied!</p>}
          </div>
        )}
        {/* <div className='flex justify-center items-center h-4/6 bg-gray-100 mt-4'> */}
          {response === "" && !error && (
            <div className='flex justify-center items-center h-4/6 bg-gray-100 mt-4'>
              <div className='text-center'>
                <img className='h-48 animate-move' src={robo} alt="Robot" />
                <p className='mt-4 text-gray-700'>{greeting}</p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default AIChat;
