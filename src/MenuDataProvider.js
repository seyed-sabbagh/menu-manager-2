import React from 'react';
import ReactDOM from 'react-dom';
import MenuManagementPage from './MenuManagementPage';
import { MenuDataProvider } from './MenuDataContext';

ReactDOM.render(
  <React.StrictMode>
    <MenuDataProvider>
      <MenuManagementPage />
    </MenuDataProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
