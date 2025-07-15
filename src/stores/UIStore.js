import { makeObservable, observable, action } from 'mobx';
import { componentRegistry } from '../componentRegistry';

export class UIStore {
  isLoading = true;
  layoutError = null;
  
  // This was the missing property
  componentDefinitions = [];
  
  componentStores = [];
  renderableComponents = [];

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      layoutError: observable,
      
      // We must make it observable
      componentDefinitions: observable.shallow,

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

        return (async () => {
          const [_, module] = await Promise.all([
            store.initialize(),
            registryEntry.importer(),
          ]);
          return module.default;
        })();
      });

      console.log(`UIStore: Waiting for ${componentLoadPromises.length} components to finish loading data and code...`);
      
      const loadedComponents = await Promise.all(componentLoadPromises);
      
      console.log('UIStore: All data and component code are loaded!');
      
      action(() => {
        // Here we set the property on the class instance
        this.componentDefinitions = definitions;
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
