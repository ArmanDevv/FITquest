// First install required package:
// npm install @react-oauth/google

import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.body.read',
];

const useFitnessData = (accessToken) => {
  const [fitnessData, setFitnessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFitnessData = async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      // Get today's start and end timestamps
      const now = new Date();
      const startTime = new Date(now.setHours(0, 0, 0, 0)).getTime();
      const endTime = new Date(now.setHours(23, 59, 59, 999)).getTime();

      // Fetch steps data
      const stepsResponse = await fetch(
        `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aggregateBy: [{
              dataTypeName: "com.google.step_count.delta",
              dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
            }],
            bucketByTime: { durationMillis: 86400000 }, // 24 hours
            startTimeMillis: startTime,
            endTimeMillis: endTime,
          }),
        }
      );

      // Fetch calories data
      const caloriesResponse = await fetch(
        `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aggregateBy: [{
              dataTypeName: "com.google.calories.expended",
              dataSourceId: "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended"
            }],
            bucketByTime: { durationMillis: 86400000 },
            startTimeMillis: startTime,
            endTimeMillis: endTime,
          }),
        }
      );

      const stepsData = await stepsResponse.json();
      const caloriesData = await caloriesResponse.json();

      // Extract values from the response
      const steps = stepsData.bucket[0]?.dataset[0]?.point[0]?.value[0]?.intVal || 0;
      const calories = Math.round(caloriesData.bucket[0]?.dataset[0]?.point[0]?.value[0]?.fpVal || 0);

      setFitnessData({ steps, calories });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFitnessData();
  }, [accessToken]);

  return { fitnessData, loading, error, refetch: fetchFitnessData };
};

const GoogleFitComponent = () => {
  const [accessToken, setAccessToken] = useState(null);
  const { fitnessData, loading, error } = useFitnessData(accessToken);

  const login = useGoogleLogin({
    scope: GOOGLE_FIT_SCOPES.join(' '),
    onSuccess: async (response) => {
      setAccessToken(response.access_token);
    },
    onError: (error) => console.error('Login Failed:', error),
  });

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading fitness data: {error}
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex items-center justify-center h-full">
        <button
          onClick={() => login()}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.073,4.073v-3.536 c0-1.054-0.855-1.909-1.909-1.909h0c-1.054,0-1.909,0.855-1.909,1.909v3.536c-1.972-0.607-3.467-2.101-4.073-4.073h3.536 c1.054,0,1.909-0.855,1.909-1.909v0c0-1.054-0.855-1.909-1.909-1.909H5.016c0.607-1.972,2.101-3.467,4.073-4.073v3.536 c0,1.054,0.855,1.909,1.909,1.909h0c1.054,0,1.909-0.855,1.909-1.909V6.169c1.972,0.607,3.467,2.101,4.073,4.073h-3.536 C13.4,10.242,12.545,11.097,12.545,12.151z"/>
          </svg>
          Connect with Google Fit
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-2xl text-blue-700">
            {fitnessData?.steps.toLocaleString()}
          </h3>
          <p className="text-blue-600">Steps Today</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-bold text-2xl text-green-700">
            {fitnessData?.calories.toLocaleString()}
          </h3>
          <p className="text-green-600">Calories Burned</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleFitComponent;