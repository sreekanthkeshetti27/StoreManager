// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import OrderLogs from './pages/OrderLogs';
import PaymentLogs from './pages/PaymentLogs';
import EditOrder from './pages/EditOrder';

function App() {
  return (
    <Router>
      <div className="d-flex">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Dynamic Content Area */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/order-logs" element={<OrderLogs />} />
            <Route path="/payment-logs" element={<PaymentLogs />} />
            <Route path="/edit-order/:id" element={<EditOrder />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;