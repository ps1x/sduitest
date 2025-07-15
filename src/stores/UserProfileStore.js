import { makeObservable, observable, action, runInAction } from 'mobx';
import { BaseComponentStore } from './BaseComponentStore';

export class UserProfileStore extends BaseComponentStore {
  userData = null;
  userId = null;

  constructor({ userId }) {
    super();
    this.userId = userId;
    makeObservable(this, {
      userData: observable,
    });
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log(`Fetching data for user ${this.userId}...`);
      const response = await fetch(`/api/users/${this.userId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      // runInAction is REQUIRED here to wrap state changes in an action
      // because of the makeObservable inheritance issue.
      runInAction(() => {
        this.userData = data;
        this.isInitialized = true;
        console.log(`Data for user ${this.userId} LOADED.`);
      });
    } catch (err) {
      console.error(`Failed to fetch user ${this.userId}:`, err);
      runInAction(() => {
        this.error = err;
        this.isInitialized = true;
      });
    }
  }
}
