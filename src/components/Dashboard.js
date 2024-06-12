import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Dashboard() {
  const { authTokens, setAuthTokens } = useAuth();
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/dashboard/', {
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
      }
    })
    .then(response => {
      setMessage(response.data.message);
    })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        setAuthTokens(null);
        navigate('/login');
      } else {
        setMessage('Error fetching dashboard data');
      }
    });
  }, [authTokens, navigate, setAuthTokens]);

  const handleLogout = () => {
    axios.post('http://localhost:8000/api/logout/', {}, {
      headers: {
        Authorization: `Bearer ${authTokens.access}`,
      }
    })
    .then(() => {
      setAuthTokens(null);
      navigate('/login');
    })
    .catch(error => {
      console.error('Error logging out', error);
      setAuthTokens(null);
      navigate('/login');
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h2>
      <p className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-800">{message}</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
