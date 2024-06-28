import React, { useState } from 'react';
import Cookies from 'js-cookie';

function AIChat() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleQuestionsResponse = async (e) => {
    e.preventDefault();
    setError("");
    setResponse("");

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
    } catch (error) {
      console.error('Error asking Question', error);
      setError(error.message);
    }
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-gray-100'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
        <form onSubmit={handleQuestionsResponse}>
          <h2 className='text-2xl font-bold mb-4 text-center'>AI Chat Bot</h2>
          <input 
            type="text"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)} 
            className='border p-2 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button type='submit' className='bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition'>
            Submit
          </button>
        </form>
        {error && <p className='text-red-500 mt-4 text-center'>{error}</p>}
        {response && (
          <div className='mt-4 max-h-40 overflow-y-auto bg-gray-100 p-4 rounded'>
            <p className='text-sm'>{response}</p>
          </div>
        )}
        {response === "" && !error && <p className='mt-4 text-center text-gray-500'>Waiting for response...</p>}
      </div>
    </div>
  );
}

export default AIChat;
