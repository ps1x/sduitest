import React from 'react';
import { observer } from 'mobx-react-lite';

// This component is now much simpler.
// It will only be rendered AFTER its store is initialized.
const UserProfile = observer(({ store }) => {
  if (store.error) {
    return <div className="component-box error">Error loading user!</div>;
  }
  
  // No need for a "loading" state here, because the global spinner handles it.
  
  return (
    <div className="component-box">
      <h3>User Profile (ID: {store.userId})</h3>
      <p><strong>Name:</strong> {store.userData.name}</p>
      <p><strong>Email:</strong> {store.userData.email}</p>
    </div>
  );
});

export default UserProfile;
