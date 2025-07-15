import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { UIStore } from './stores/UIStore';
import DynamicComponentRenderer from './components/DynamicComponentRenderer';
import GlobalSpinner from './components/GlobalSpinner';
import './App.css';

const App = observer(() => {
  const [uiStore] = useState(() => new UIStore());

  useEffect(() => {
    uiStore.fetchLayout();
  }, [uiStore]);

  if (uiStore.layoutError) {
    return <div className="app-error">Error loading page layout! Check the console.</div>;
  }

  if (uiStore.isLoading) {
    return <GlobalSpinner />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Server-Driven UI Demo</h1>
        <p>This entire layout is dynamically rendered based on a mock API call.</p>
      </header>
      <main>
        <DynamicComponentRenderer
          definitions={uiStore.componentDefinitions}
          stores={uiStore.componentStores}
          components={uiStore.renderableComponents}
        />
      </main>
    </div>
  );
});

export default App;
