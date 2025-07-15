import { makeObservable, observable, action } from 'mobx';

export class BaseComponentStore {
  isInitialized = false; // The crucial flag for each component
  error = null;

  constructor() {
    makeObservable(this, {
      isInitialized: observable,
      error: observable,
      initialize: action,
    });
  }

  // This method will be called by the component once it mounts.
  // Child stores will override this to fetch their specific data.
  async initialize(props) {
    // Base implementation can be empty or have common logic
    console.log("Base store initialized (no data to fetch).");
    this.isInitialized = true;
  }
}
