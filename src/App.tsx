import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import SpaceManagement from './pages/SpaceManagement';
import AddItemPage from './features/items/AddItemPage';
import EditItemPage from './features/items/EditItemPage';
import ItemsPage from './features/items/ItemsPage';
import { ItemDetailPage } from './pages/Items/ItemDetailPage';
import { InventoryDashboard } from './pages/Inventory/InventoryDashboard';
import { ShoppingListPage } from './pages/ShoppingList/ShoppingListPage';
import ExpiryPage from './pages/Expiry/ExpiryPage';
import StatsPage from './pages/Stats/StatsPage';
import { LoanManagementPage } from './pages/Loans/LoanManagementPage';
import { LoanListPage } from './pages/Loans/LoanListPage';

import SettingsPage from './pages/Settings/SettingsPage';
import NavigationSettings from './pages/Settings/NavigationSettings';
import { AuditPage } from './pages/Audit/AuditPage';
import { MovingListPage } from './pages/Moving/MovingListPage';
import { MovingDetailPage } from './pages/Moving/MovingDetailPage';


import { HomePage } from './pages/Home/HomePage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="items" element={<ItemsPage />} />
          <Route path="items/:id" element={<ItemDetailPage />} />
          <Route path="edit/:id" element={<EditItemPage />} />
          <Route path="add" element={<AddItemPage />} />
          <Route path="lists" element={<ShoppingListPage />} />
          <Route path="inventory" element={<InventoryDashboard />} />
          <Route path="expiry" element={<ExpiryPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="loans" element={<LoanListPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="moving" element={<MovingListPage />} />
          <Route path="moving/:id" element={<MovingDetailPage />} />

          <Route path="loans/:id" element={<LoanManagementPage />} />

          <Route path="spaces" element={<SpaceManagement />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/nav" element={<NavigationSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
