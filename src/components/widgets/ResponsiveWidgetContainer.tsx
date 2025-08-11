import React from 'react';
import './ResponsiveWidgetContainer.css';

const ResponsiveWidgetContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="widget-container">{children}</div>;
};

export default ResponsiveWidgetContainer;