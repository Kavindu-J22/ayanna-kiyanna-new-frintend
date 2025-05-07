import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const About = () => {
  const [instituteInfo, setInstituteInfo] = useState({
    name: 'Ayanna Kiyann Sinhala Institute',
    description: '',
    established: '',
    students: 0,
    teachers: 0,
    loading: true
  });

  useEffect(() => {
    // Replace with your actual API endpoint
    const API_URL = import.meta.env.PROD 
      ? 'https://your-backend-url.onrender.com/api/about' 
      : '/api/about';

    axios.get(API_URL)
      .then(response => {
        setInstituteInfo({
          ...response.data,
          loading: false
        });
      })
      .catch(error => {
        console.error('Error fetching about data:', error);
        setInstituteInfo(prev => ({
          ...prev,
          loading: false,
          description: 'Error loading information. Please try again later.'
        }));
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">About Our Institute</h1>
      
      {instituteInfo.loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">{instituteInfo.name}</h2>
            <p className="text-gray-600 mb-4">{instituteInfo.description || 'Loading description...'}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-blue-700">Established</h3>
                <p className="text-gray-700">{instituteInfo.established || '2000'}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-700">Students</h3>
                <p className="text-gray-700">{instituteInfo.students || '500+'}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-bold text-purple-700">Teachers</h3>
                <p className="text-gray-700">{instituteInfo.teachers || '20+'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h2>
            <p className="text-gray-600">
              To provide high-quality Sinhala language education while preserving and promoting 
              Sri Lankan cultural heritage through innovative teaching methods.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Vision</h2>
            <p className="text-gray-600">
              To become the premier institution for Sinhala language learning worldwide, 
              fostering cultural understanding and linguistic excellence.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;