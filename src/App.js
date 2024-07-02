import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import TokenData from './components/TokenData';
import './App.css';

// Import the data from the json file
import exampleData from './example_data.json';

function App() {
  const [data, setData] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {

      if (Object.keys(exampleData).length === 0) {
        throw new Error('No data available in the environment variable');
      }

      setData(exampleData);
      setSelectedToken(Object.keys(exampleData)[0]);
    } catch (err) {
      console.error('Error parsing data:', err);
      setError(
        'Error loading data. Please check the console for more information.'
      );
    }
  }, []);

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
      cursor: 'pointer', // Remove the blinking cursor
      '&:hover': {
        borderColor: 'none',
      },
    }),
    option: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      position: 'absolute',
      left: '10px', // Position the arrow to the left
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
      marginLeft: '30px', // Adjust to prevent overlapping with the arrow
    }),
    input: (provided) => ({
      ...provided,
      caretColor: 'transparent', // Remove the blinking cursor
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
          key={selectedToken} // Ensuring unique key for each token
          token={selectedToken}
          data={data[selectedToken]}
          tokens={tokens}
        />
      )}
    </div>
  );
}

export default App;
