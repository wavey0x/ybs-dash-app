import React, { useState } from 'react';
import './TokenData.css';
import fieldConfig from './fieldConfig';

const CopyIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 1H1V10" stroke="currentColor" strokeWidth="1"/>
        <path d="M4 4H13V13H4V4Z" stroke="currentColor" strokeWidth="1"/>
    </svg>
);

const GenericERC20Icon = () => (
    <svg width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
    </svg>
  );

const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

    const TokenData = ({ token, data }) => {
      const [activeTab, setActiveTab] = useState('strategy_data');
      const [copiedAddress, setCopiedAddress] = useState(null);
    
      const formatValue = (value, config) => {
        if (typeof value === 'number') {
          let formattedNumber = Number(value).toLocaleString(undefined, {
            minimumFractionDigits: config.decimals,
            maximumFractionDigits: config.decimals,
          });
          if (config.isPct) {
            formattedNumber = (value * 100).toLocaleString(undefined, {
              minimumFractionDigits: config.decimals,
              maximumFractionDigits: config.decimals,
            }) + '%';
          } else if (config.isUSD) {
            formattedNumber = '$' + formattedNumber;
          }
          return formattedNumber;
        } else if (typeof value === 'boolean') {
          return value ? 'True' : 'False';
        }
        return value;
      };
    
      const truncateAddress = (address) => {
        return `${address.slice(0, 5)}...${address.slice(-3)}`;
      };
    
      const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
          setCopiedAddress(text);
          setTimeout(() => setCopiedAddress(null), 2000); // Reset after 2 seconds
        });
      };
    
      const renderData = (obj, section) => {
        if (section === 'price_data') {
          const config = fieldConfig.price_data;
          return (
            <div className="price-data-container">
              {Object.entries(obj).map(([address, tokenData]) => {
                const { symbol, logoURI, price } = tokenData;
                const truncatedAddress = truncateAddress(address);
                
                return (
                  <React.Fragment key={address}>
                    {config.showLogo && isValidUrl(logoURI) ? (
                      <img src={logoURI} alt={symbol} className="token-logo" onError={(e) => e.target.replaceWith(GenericERC20Icon())} />
                    ) : (
                      <GenericERC20Icon />
                    )}
                    <span className="token-symbol">{symbol}</span>
                    <span className="token-price">
                      ${Number(price).toLocaleString(undefined, { minimumFractionDigits: config.decimals, maximumFractionDigits: config.decimals })}
                    </span>
                    {config.showAddress && (
                      <div className="token-address-container">
                        <span className="token-address">{truncatedAddress}</span>
                        {config.showCopyButton && (
                          <button 
                            className="copy-button" 
                            onClick={() => copyToClipboard(address)}
                            title="Copy full address"
                          >
                            <CopyIcon />
                          </button>
                        )}
                      </div>
                    )}
                    {copiedAddress === address && <span className="copied-message">Copied!</span>}
                  </React.Fragment>
                );
              })}
            </div>
          );
    } else {
      return (
        <div className="data-container">
          {Object.entries(obj).map(([key, value]) => {
            const config = fieldConfig[section]?.[key] || { visible: true, decimals: 2, label: key };
            
            if (!config.visible) return null;

            const label = config.label || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            let formattedValue = formatValue(value, config);

            if (typeof value === 'object' && value !== null) {
              return (
                <React.Fragment key={key}>
                  <div className="data-label">{label}</div>
                  <div className="data-value">{renderData(value, key)}</div>
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={key}>
                <div className="data-label">{label}</div>
                <div className="data-value">{formattedValue}</div>
              </React.Fragment>
            );
          })}
        </div>
      );
    }
  };

  const tabs = ['strategy_data', 'peg_data', 'price_data', 'pipeline_data'];

  return (
    <div className="token-data">
      <h2>{data.symbol} ({token.slice(0, 5)}...{token.slice(-3)})</h2>
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab.replace(/_data/g, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {renderData(data[activeTab] || {}, activeTab)}
      </div>
    </div>
  );
};

export default TokenData;