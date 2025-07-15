import { makeObservable, observable, action } from 'mobx';
import { componentRegistry } from '../componentRegistry';

export class UIStore {
  isLoading = true;
  layoutError = null;
  componentStores = [];
  // This will hold the actual, loaded component functions
  renderableComponents = [];

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      layoutError: observable,
      componentStores: observable.shallow,
      renderableComponents: observable.shallow,
      fetchLayout: action,
    });
  }

  async fetchLayout() {
    console.log('UIStore: Starting full layout and component load...');
    this.isLoading = true;
    this.layoutError = null;
    
    try {
      const response = await fetch('/api/sdui-layout');
      if (!response.ok) throw new Error('Failed to fetch layout');
      const layoutJson = await response.json();
      const definitions = layoutJson.components;
      
      console.log('UIStore: Layout JSON received. Preparing parallel load promises...');
      
      const stores = [];
      const componentLoadPromises = definitions.map(def => {
        const registryEntry = componentRegistry[def.type];
        if (!registryEntry) {
          return Promise.reject(new Error(`Unknown component type: ${def.type}`));
        }
        
        const store = registryEntry.storeFactory(def.props);
        stores.push(store);

        // This promise resolves with the actual Component function
        // only after BOTH data and code are ready.
        return (async () => {
          const [_, module] = await Promise.all([
            store.initialize(),
            registryEntry.importer(),
          ]);
          return module.default; // The actual component function
        })();
      });

      console.log(`UIStore: Waiting for ${componentLoadPromises.length} components to finish loading data and code...`);
      
      const loadedComponents = await Promise.all(componentLoadPromises);
      
      console.log('UIStore: All data and component code are loaded!');
      
      // Now, and only now, we are truly ready.
      action(() => {
        this.componentStores = stores;
        this.renderableComponents = loadedComponents;
        this.isLoading = false;
      })();

    } catch (error) {
      console.error('UIStore: A critical error occurred during layout load:', error);
      action(() => {
        this.layoutError = error;
        this.isLoading = false;
      })();
    }
  }
}
