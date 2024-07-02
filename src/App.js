import React, { useState, useEffect } from 'react';
import TokenData from './components/TokenData';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const localData = JSON.parse(process.env.REACT_APP_LOCAL_DATA || '{}');
      
      if (Object.keys(localData).length === 0) {
        throw new Error('No data available in the environment variable');
      }

      setData(localData);
      setSelectedToken(Object.keys(localData)[0]);
    } catch (err) {
      console.error('Error parsing data:', err);
      setError('Error loading data. Please check the console for more information.');
    }
  }, []);

  const truncateAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(-3)}`;
  };

  if (error) return <div className="error">{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="App">
      <div className="token-selector">
        <label htmlFor="token-select">Select Token: </label>
        <select
          id="token-select"
          value={selectedToken || ''}
          onChange={(e) => setSelectedToken(e.target.value)}
        >
          {Object.entries(data).map(([token, tokenData]) => (
            <option key={token} value={token}>
              {tokenData.symbol} ({truncateAddress(token)})
            </option>
          ))}
        </select>
      </div>
      {selectedToken && (
        <TokenData token={selectedToken} data={data[selectedToken]} />
      )}
    </div>
  );
}

export default App;