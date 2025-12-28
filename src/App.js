import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import TokenData from './components/TokenData';
import './App.css';

const STORAGE_KEY = 'lastViewedToken';

function App() {
  const { token: urlToken } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(getTimeLeftUntilThursday());
  const [lastUpdate, setLastUpdate] = useState(null);

  // Build tokens map from data (memoized)
  const tokens = useMemo(() => {
    if (!data) return {};
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = {
        symbol: data[key]['price_data']?.[key]?.symbol,
        logoURI: data[key]['price_data']?.[key]?.logoURI,
      };
      return acc;
    }, {});
  }, [data]);

  // Helper: Find address by symbol (case-insensitive)
  const getAddressBySymbol = useCallback((symbol) => {
    if (!symbol || !tokens || Object.keys(tokens).length === 0) return null;
    const lowerSymbol = symbol.toLowerCase();
    return Object.entries(tokens).find(
      ([, tokenData]) => tokenData.symbol?.toLowerCase() === lowerSymbol
    )?.[0];
  }, [tokens]);

  // Helper: Get symbol by address
  const getSymbolByAddress = useCallback((address) => {
    return tokens?.[address]?.symbol?.toLowerCase();
  }, [tokens]);

  // Get default token address (first available token)
  const getDefaultAddress = useCallback(() => {
    const addresses = Object.keys(tokens);
    return addresses.length > 0 ? addresses[0] : null;
  }, [tokens]);

  // Fetch data once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_YBS_DATA_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        const fetchedData = result.data;

        if (Object.keys(fetchedData).length === 0) {
          throw new Error('No data available from the API');
        }

        setData(fetchedData);
        setLastUpdate(result.last_update);
      } catch (err) {
        console.error('Error parsing data:', err);
        setError('Error loading data. Please check the console for more information.');
      }
    };

    fetchData();
  }, []); // Only run once on mount

  // Handle URL sync after data is loaded
  useEffect(() => {
    if (!data || Object.keys(tokens).length === 0) return;

    // Try to resolve URL symbol to address
    const resolvedAddress = urlToken ? getAddressBySymbol(urlToken) : null;

    if (resolvedAddress) {
      // Valid symbol in URL
      setSelectedToken(resolvedAddress);
      localStorage.setItem(STORAGE_KEY, urlToken.toLowerCase());
    } else {
      // Invalid or missing symbol - check localStorage or use first available token
      const lastViewed = localStorage.getItem(STORAGE_KEY);
      const fallbackAddress = lastViewed ? getAddressBySymbol(lastViewed) : null;
      const finalAddress = fallbackAddress || getDefaultAddress();
      const finalSymbol = getSymbolByAddress(finalAddress);

      if (finalAddress && finalSymbol) {
        setSelectedToken(finalAddress);
        navigate(`/${finalSymbol}`, { replace: true });
      }
    }
  }, [data, tokens, urlToken, navigate, getAddressBySymbol, getSymbolByAddress, getDefaultAddress]);

  // Handle token selection change - update URL with symbol
  const handleTokenChange = useCallback((tokenAddress) => {
    const symbol = getSymbolByAddress(tokenAddress);
    if (symbol) {
      localStorage.setItem(STORAGE_KEY, symbol);
      setSelectedToken(tokenAddress);
      navigate(`/${symbol}`);
    }
  }, [getSymbolByAddress, navigate]);

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
          onChange={(option) => handleTokenChange(option.value)}
          options={tokenOptions}
          styles={customStyles}
          isSearchable={false}
          inputProps={{ readOnly: true }}
        />
      </div>
      <div className="main-content">
        {selectedToken && (
          <TokenData
            key={selectedToken}
            token={selectedToken}
            data={data[selectedToken]}
            tokens={tokens}
            setToken={handleTokenChange}
          />
        )}
      </div>
      <footer className="footer">
        <div className="countdown">{timeLeft}</div>
        {lastUpdate && (
          <div className="last-update">
            Data last updated: {getHumanReadableTimeSinceUpdate(lastUpdate)}
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;
