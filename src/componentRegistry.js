import { UserProfileStore } from './stores/UserProfileStore';
import { StockTickerStore } from './stores/StockTickerStore';

export const componentRegistry = {
  UserProfile: {
    importer: () => import('./components/UserProfile'),
    storeFactory: (props) => new UserProfileStore(props),
  },
  StockTicker: {
    importer: () => import('./components/StockTicker'),
    storeFactory: (props) => new StockTickerStore(props),
  },
};
