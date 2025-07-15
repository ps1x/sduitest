import React from 'react';
import { observer } from 'mobx-react-lite';

// This component is also simplified.
const StockTicker = observer(({ store }) => {
  if (store.error) {
    return <div className="component-box error">Error loading stock!</div>;
  }
  
  return (
    <div className="component-box">
      <h3>Stock Ticker</h3>
      <p><strong>Symbol:</strong> {store.stockData.symbol}</p>
      <p><strong>Price:</strong> ${store.stockData.price}</p>
    </div>
  );
});

export default StockTicker;
