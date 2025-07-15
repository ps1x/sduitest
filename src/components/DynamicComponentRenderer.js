import React from 'react';

const DynamicComponentRenderer = ({ stores, components, definitions }) => {
  return (
    <>
      {definitions.map((def, index) => {
        const Component = components[index];
        const store = stores[index];

        if (!Component || !store) {
          return <div key={def.id || index} className="component-box error">Error rendering component {def.type}</div>;
        }

        // Use the stable, unique ID from the data as the key
        return <Component key={def.id} store={store} />;
      })}
    </>
  );
};

export default DynamicComponentRenderer;
