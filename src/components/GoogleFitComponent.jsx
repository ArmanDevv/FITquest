import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleFitComponent = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [fitnessData, setFitnessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read',
    onSuccess: async (response) => {
      console.log('Login successful, token received:', response.access_token ? 'Yes' : 'No');
      setAccessToken(response.access_token);
      sessionStorage.setItem('accessToken', response.access_token);
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setError('Failed to login to Google Fit');
    },
  });

  const fetchFitnessData = async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const now = new Date();
      const endTime = now.getTime();
      const startTime = endTime - (24 * 60 * 60 * 1000); // Last 24 hours

      console.log('Fetching data for timerange:', {
        start: new Date(startTime).toISOString(),
        end: new Date(endTime).toISOString()
      });

      const stepsResponse = await fetch(
        'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aggregateBy: [{
              dataTypeName: "com.google.step_count.delta"
            }],
            bucketByTime: { durationMillis: 86400000 },
            startTimeMillis: startTime,
            endTimeMillis: endTime,
          }),
        }
      );

      const caloriesResponse = await fetch(
        'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aggregateBy: [{
              dataTypeName: "com.google.calories.expended"
            }],
            bucketByTime: { durationMillis: 86400000 },
            startTimeMillis: startTime,
            endTimeMillis: endTime,
          }),
        }
      );

      const stepsData = await stepsResponse.json();
      const caloriesData = await caloriesResponse.json();

      console.log('Raw Steps Data:', stepsData);
      console.log('Detailed Steps Data:', stepsData.bucket[0].dataset);

      console.log('Raw Calories Data:', caloriesData);

      // Modified data extraction
      let steps = 0;
      let calories = 0;

      // Sum up all step values from all buckets
      
if (stepsData.bucket) {
  stepsData.bucket.forEach(bucket => {
    bucket.dataset.forEach(dataset => {
      dataset.point.forEach(point => {
        point.value.forEach(value => {
          if (value.intVal) {
            steps += value.intVal; // Add the step count value here
          }
        });
      });
    });
  });
}

console.log('Processed Steps:', steps);
      // if (stepsData.bucket) {
      //   stepsData.bucket.forEach(bucket => {
      //     bucket.dataset.forEach(dataset => {
      //       dataset.point.forEach(point => {
      //         point.value.forEach(value => {
      //           if (value.intVal) {
      //             steps += value.intVal;
      //           }
      //         });
      //       });
      //     });
      //   });
      // }

      // Sum up all calorie values from all buckets
      if (caloriesData.bucket) {
        caloriesData.bucket.forEach(bucket => {
          bucket.dataset.forEach(dataset => {
            dataset.point.forEach(point => {
              point.value.forEach(value => {
                if (value.fpVal) {
                  calories += value.fpVal;
                }
              });
            });
          });
        });
      }

      console.log('Processed data:', { steps, calories });

      if (steps === 0 && calories === 0) {
        setError('No fitness data found for the last 24 hours. If you just set up Google Fit, please wait a few hours for data to sync.');
      } else {
        const fitnessDetails = {
          steps: steps,
          calories: Math.round(calories)
        };
      
        setFitnessData(fitnessDetails);
        sessionStorage.setItem('fitnessData', JSON.stringify(fitnessDetails)); // Save to session storage
        setError(null);
      }

    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Error fetching fitness data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    const storedToken = sessionStorage.getItem('accessToken');
    if(storedToken){
      setAccessToken(storedToken);
    }
  },[]);
  
  useEffect(() => {
    const storedData = sessionStorage.getItem('fitnessData');
    if (storedData) {
      setFitnessData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchFitnessData();
    }
  }, [accessToken]);

  if (!accessToken) {
    return (
      <div className="flex items-center justify-center h-full p-4">
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
      <div className="flex items-center justify-center h-full p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-yellow-800 font-medium mb-2">Unable to Load Fitness Data</h3>
          <p className="text-yellow-700">{error}</p>
          <button 
            onClick={() => {
              setAccessToken(null);
              setError(null);
            }}
            className="mt-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded hover:bg-yellow-200"
          >
            Disconnect and Try Again
          </button>
        </div>
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