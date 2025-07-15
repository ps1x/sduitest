import React from 'react';

const DynamicComponentRenderer = ({ stores, components }) => {
  return (
    <>
      {components.map((Component, index) => {
        const store = stores[index];

        if (!Component || !store) {
          return <div key={index} className="component-box error">Error rendering component at index {index}</div>;
        }

        // No Suspense needed. Just render the component directly.
        return <Component key={index} store={store} />;
      })}
    </>
  );
};

export default DynamicComponentRenderer;
