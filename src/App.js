import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import TokenData from './components/TokenData';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(getTimeLeftUntilThursday());
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_YBS_DATA_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        const data = result.data;
        const lastUpdate = result.last_update;

        if (Object.keys(data).length === 0) {
          throw new Error('No data available from the API');
        }

        setData(data);
        setSelectedToken(defaultToken);
        setLastUpdate(lastUpdate);

      } catch (err) {
        console.error('Error parsing data:', err);
        setError(
          'Error loading data. Please check the console for more information.'
        );
      }
    };

    fetchData();
  }, []);

  const defaultToken = '0xFCc5c47bE19d06BF83eB04298b026F81069ff65b'; // Set the default token here

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeftUntilThursday());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function getTimeLeftUntilThursday() {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();
    let daysUntilThursday = (4 - dayOfWeek + 7) % 7;

    if (daysUntilThursday === 0 && (hours > 0 || minutes > 0 || seconds > 0)) {
      daysUntilThursday = 7;
    }

    const nextThursday = new Date(now);
    nextThursday.setUTCDate(now.getUTCDate() + daysUntilThursday);
    nextThursday.setUTCHours(0, 0, 0, 0);

    const timeLeft = nextThursday - now;
    const totalSeconds = Math.floor(timeLeft / 1000);

    const remainingDays = Math.floor(totalSeconds / 86400);
    const remainingHours = Math.floor((totalSeconds % 86400) / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${remainingDays}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
  }

  function getHumanReadableTimeSinceUpdate(lastUpdate) {
    if (!lastUpdate) return '';

    const now = Date.now();
    const timeDifference = now - lastUpdate * 1000; // Convert to milliseconds
    const minutes = Math.floor(timeDifference / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
  } 

  if (error) return <div className="error">{error}</div>;
  if (!data) return <div>Loading...</div>;

  const tokens = Object.keys(data).reduce((acc, key) => {
    acc[key] = {
      symbol: data[key]['price_data'][key]?.symbol,
      logoURI: data[key]['price_data'][key]?.logoURI,
    };
    return acc;
  }, {});

  const tokenOptions = Object.entries(tokens).map(([address, tokenData]) => ({
    value: address,
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={tokenData.logoURI}
          alt={tokenData.symbol}
          style={{ width: '20px', height: '20px', marginRight: '8px' }}
        />
        {tokenData.symbol}
      </div>
    ),
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      position: 'relative',
      cursor: 'pointer',
      '&:hover': {
        borderColor: 'none',
      },
      '@media (max-width: 768px)': {
        padding: '10px 0',
        marginBottom: '10px',
      },
    }),
    option: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      position: 'absolute',
      left: '10px',
      right: 'auto',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      marginLeft: '30px',
    }),
    input: (provided) => ({
      ...provided,
      caretColor: 'transparent',
      inputMode: 'none', // Disable keyboard on mobile
    }),
  };

  return (
    <div className="App">
      <div className="header">
        <label htmlFor="token-select"></label>
        <Select
          id="token-select"
          value={tokenOptions.find((option) => option.value === selectedToken)}
          onChange={(option) => setSelectedToken(option.value)}
          options={tokenOptions}
          styles={customStyles}
        />
      </div>
      {selectedToken && (
        <TokenData
          key={selectedToken}
          token={selectedToken}
          data={data[selectedToken]}
          tokens={tokens}
          setToken={setSelectedToken}
        />
      )}
      <footer className="footer">
        <div className="countdown">
          {timeLeft}
        </div>
        {lastUpdate && (
          <div className="last-update">
            Data last updated {getHumanReadableTimeSinceUpdate(lastUpdate)}
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;
