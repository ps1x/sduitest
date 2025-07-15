import { makeObservable, observable, action, runInAction } from 'mobx';
import { BaseComponentStore } from './BaseComponentStore';

export class StockTickerStore extends BaseComponentStore {
  stockData = null;
  symbol = null;

  constructor({ symbol }) {
    super();
    this.symbol = symbol;
    makeObservable(this, {
      stockData: observable,
    });
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log(`Fetching data for stock ${this.symbol}...`);
      const response = await fetch(`/api/stocks/${this.symbol}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      // runInAction is also REQUIRED here.
      runInAction(() => {
        this.stockData = data;
        this.isInitialized = true;
        console.log(`Data for stock ${this.symbol} LOADED.`);
      });
    } catch (err) {
      console.error(`Failed to fetch stock ${this.symbol}:`, err);
      runInAction(() => {
        this.error = err;
        this.isInitialized = true;
      });
    }
  }
}
