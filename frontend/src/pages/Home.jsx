import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Replace with your Render backend URL
    axios.get('https://your-backend-url.onrender.com')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Failed to connect to backend');
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Ayanna Kiyann Sinhala Institute</h1>
      <p className="text-xl">{message}</p>
      {/* Add more content here */}
    </div>
  );
};

export default Home;