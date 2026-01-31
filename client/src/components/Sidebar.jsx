// client/src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, WalletCards } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar p-3 d-flex flex-column">
      <h4 className="text-center mb-4 text-primary">Store Manager</h4>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/" className="nav-link d-flex align-items-center gap-2">
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/order-logs" className="nav-link d-flex align-items-center gap-2">
            <ClipboardList size={20} />
            Order Logs
          </NavLink>
        </li>
        <li>
          <NavLink to="/payment-logs" className="nav-link d-flex align-items-center gap-2">
            <WalletCards size={20} />
            Payment Logs
          </NavLink>
        </li>
      </ul>
      <hr />
      <div className="text-muted small text-center">v1.0.0</div>
    </div>
  );
};

export default Sidebar;