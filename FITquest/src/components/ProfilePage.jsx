import React, { useState,useEffect } from 'react';
const ProfilePage = () => {
  const [tokens, setTokens] = useState({ today: 0, total: 0 });
  const [stepsGoal, setStepsGoal] = useState(() => {
    return parseInt(localStorage.getItem('stepsGoal')) || 5000;
  });
  const [challengeRequests] = useState([]);
  const [pastChallenges] = useState([]);

  useEffect(() => {
    const fetchTokens = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await fetch(`http://localhost:5000/user-tokens/${email}`);
          if (response.ok) {
            const data = await response.json();
            setTokens({
              today: data.todayTokens,
              total: data.totalTokens
            });
          }
        } catch (error) {
          console.error('Error fetching tokens:', error);
        }
      }
    };

    fetchTokens();
    // Fetch tokens every minute to keep them updated
    const interval = setInterval(fetchTokens, 60000);
    return () => clearInterval(interval);
  }, []);

  // Custom Card component
  const Card = ({ children, className = '' }) => (
    <div className={`bg-[#1a1b23] rounded-xl p-6 shadow-lg border border-gray-800 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tokens Card */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Tokens Earned</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-16 w-16 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-3xl font-bold">{tokens.today}</span>
                    <p className="text-gray-400">Today's Tokens</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Tokens Earned</span>
                  <span className="text-2xl font-bold">{tokens.total}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>• Earn 10 tokens per 1,000 steps</p>
                <p>• Earn 10 tokens per 500 calories burned</p>
              </div>
            </div>
          </Card>

          {/* Steps Goal Card */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Daily Steps Goal</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Current Goal: {stepsGoal.toLocaleString()} steps</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={stepsGoal}
                onChange={(e) => setStepsGoal(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400">
                <span>500</span>
                <span>7,500</span>
                <span>10,000</span>
              </div>
            </div>
          </Card>

          {/* Challenge Requests Card */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Incoming Challenges</h2>
            {challengeRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <span className="text-4xl mb-4 block">🤝</span>
                <p>No incoming challenges</p>
              </div>
            ) : (
              <div className="space-y-4">
                {challengeRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between">
                    <div>{request.challenger}</div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-purple-600 rounded-lg">Accept</button>
                      <button className="px-4 py-2 bg-gray-700 rounded-lg">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Past Challenges Card */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Challenge History</h2>
            {pastChallenges.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <span className="text-4xl mb-4 block">📜</span>
                <p>No past or ongoing challenges</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastChallenges.map((challenge) => (
                  <div key={challenge.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <p className="text-sm text-gray-400">{challenge.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        challenge.status === 'completed' ? 'bg-green-900 text-green-300' : 
                        challenge.status === 'ongoing' ? 'bg-blue-900 text-blue-300' : 
                        'bg-red-900 text-red-300'
                      }`}>
                        {challenge.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;