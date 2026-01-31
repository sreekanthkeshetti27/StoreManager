// import React, { useState, useEffect } from 'react';
// import { Table, Button, Modal, Form, Badge } from 'react-bootstrap';
// import { CheckCircle, XCircle, FileSpreadsheet, Loader } from 'lucide-react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';

// const OrderLogs = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Modal State
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [paymentDetails, setPaymentDetails] = useState({
//     receivedDate: new Date().toISOString().split('T')[0],
//     amountReceived: 0,
//     paymentMethod: 'UPI'
//   });

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/orders');
//       setOrders(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching orders", err);
//       setLoading(false);
//     }
//   };

//   // Open modal for a specific order
//   const handlePaymentClick = (order) => {
//     setSelectedOrder(order);
//     setShowPaymentModal(true);
//   };

//   // Submit payment update to backend
//   const submitPayment = async () => {
//     try {
//       const updatedData = {
//         isReceived: true,
//         ...paymentDetails
//       };
//       await axios.patch(`http://localhost:5000/api/orders/${selectedOrder._id}/payment`, updatedData);
//       alert("Payment status updated!");
//       setShowPaymentModal(false);
//       fetchOrders(); // Refresh table
//     } catch (err) {
//       alert("Failed to update payment");
//     }
//   };

//   // --- EXCEL EXPORT LOGIC ---
//   const exportToExcel = () => {
//     const flatData = [];
    
//     orders.forEach(order => {
//       order.products.forEach((prod, index) => {
//         flatData.push({
//           "Order ID": index === 0 ? order.orderId : "", // Merged look
//           "Date": index === 0 ? order.date : "",
//           "Platform": index === 0 ? order.platform : "",
//           "Account": index === 0 ? order.platformAccount : "",
//           "Product": prod.productName,
//           "Qty": prod.qty,
//           "Buying Price": prod.buyingPrice,
//           "Selling Price": prod.sellingPrice,
//           "Net Profit": prod.netProfit,
//           "Payment Status": order.paymentStatus.isReceived ? "PAID" : "PENDING",
//           "Payment Date": order.paymentStatus.receivedDate
//         });
//       });
//     });

//     const ws = XLSX.utils.json_to_sheet(flatData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Orders");
//     XLSX.writeFile(wb, `Order_Logs_${new Date().toLocaleDateString()}.xlsx`);
//   };

//   if (loading) return <div className="p-5 text-center"><Loader className="spinner" /> Loading Logs...</div>;

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3>Order Logs</h3>
//         <Button variant="outline-success" onClick={exportToExcel}>
//           <FileSpreadsheet size={18} className="me-2" /> Export to Excel
//         </Button>
//       </div>

//       <Table bordered hover responsive className="shadow-sm bg-white">
//         <thead className="table-dark">
//           <tr>
//             <th>Order Info</th>
//             <th>Product Details</th>
//             <th>Pricing & Profit</th>
//             <th>Delivery</th>
//             <th>Paid?</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order) => (
//             <React.Fragment key={order._id}>
//               {/* We loop through products and group them under one Order row visually */}
//               {order.products.map((prod, pIndex) => (
//                 <tr key={`${order._id}-${pIndex}`}>
//                   {/* Show Order Header details only on the first product row */}
//                   {pIndex === 0 ? (
//                     <td rowSpan={order.products.length} className="bg-light align-middle">
//                       <strong>ID: {order.orderId}</strong><br/>
//                       <small>{order.date}</small><br/>
//                       <Badge bg="info">{order.platformAccount}</Badge>
//                     </td>
//                   ) : null}
                  
//                   <td>{prod.productName} (x{prod.qty})</td>
//                   <td>
//                     <small>Buy: {prod.buyingPrice} | Sell: {prod.sellingPrice}</small><br/>
//                     <strong className="text-success">Profit: ₹{prod.netProfit}</strong>
//                   </td>

//                   {pIndex === 0 ? (
//                     <td rowSpan={order.products.length} className="align-middle">
//                       <small>{order.deliveryDate}</small><br/>
//                       <small className="text-muted">{order.deliverySlot}</small>
//                     </td>
//                   ) : null}

//                   {pIndex === 0 ? (
//                     <td rowSpan={order.products.length} className="align-middle text-center" style={{backgroundColor: order.paymentStatus.isReceived ? '#d4edda' : '#fff3cd'}}>
//                       {order.paymentStatus.isReceived ? (
//                         <div className="text-success">
//                           <CheckCircle size={24} /><br/>
//                           <small>Paid on {order.paymentStatus.receivedDate}</small>
//                         </div>
//                       ) : (
//                         <Button variant="link" className="text-danger p-0" onClick={() => handlePaymentClick(order)}>
//                           <XCircle size={24} /><br/>
//                           <small>Mark Paid</small>
//                         </Button>
//                       )}
//                     </td>
//                   ) : null}
//                 </tr>
//               ))}
//               {/* Optional: Summary row for Total Order Profit */}
//               <tr className="table-secondary">
//                 <td colSpan="2" className="text-end font-weight-bold">Order Total Profit:</td>
//                 <td colSpan="3"><strong>₹{order.totalOrderProfit}</strong></td>
//               </tr>
//             </React.Fragment>
//           ))}
//         </tbody>
//       </Table>

//       {/* --- PAYMENT MODAL --- */}
//       <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Receive Payment Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Amount Received (₹)</Form.Label>
//               <Form.Control 
//                 type="number" 
//                 onChange={(e) => setPaymentDetails({...paymentDetails, amountReceived: e.target.value})}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Received Date</Form.Label>
//               <Form.Control 
//                 type="date" 
//                 value={paymentDetails.receivedDate}
//                 onChange={(e) => setPaymentDetails({...paymentDetails, receivedDate: e.target.value})}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Payment Method</Form.Label>
//               <Form.Select onChange={(e) => setPaymentDetails({...paymentDetails, paymentMethod: e.target.value})}>
//                 <option>UPI / GPay</option>
//                 <option>Cash</option>
//                 <option>Bank Transfer</option>
//               </Form.Select>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
//           <Button variant="primary" onClick={submitPayment}>Confirm Payment</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default OrderLogs;
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Card } from 'react-bootstrap';
import { 
  CheckCircle, 
  XCircle, 
  FileSpreadsheet, 
  Loader, 
  Truck, 
  Edit3, 
  PackageCheck 
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const OrderLogs = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    receivedDate: new Date().toISOString().split('T')[0],
    amountReceived: 0,
    paymentMethod: 'UPI'
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders", err);
      setLoading(false);
    }
  };

  // 1. Toggle Delivery Status
  const toggleDelivery = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/${id}/delivery`);
      fetchOrders(); // Refresh data
    } catch (err) {
      alert("Error updating delivery status");
    }
  };

  // 2. Payment Modal Logic
  const handlePaymentClick = (order) => {
    setSelectedOrder(order);
    setPaymentDetails({ ...paymentDetails, amountReceived: order.totalOrderProfit }); // Pre-fill with profit or custom amount
    setShowPaymentModal(true);
  };

  const submitPayment = async () => {
    try {
      const updatedData = { isReceived: true, ...paymentDetails };
      await axios.patch(`http://localhost:5000/api/orders/${selectedOrder._id}/payment`, updatedData);
      setShowPaymentModal(false);
      fetchOrders();
    } catch (err) {
      alert("Failed to update payment");
    }
  };

  // 3. Updated Excel Export Logic
  const exportToExcel = () => {
    const flatData = [];
    orders.forEach(order => {
      order.products.forEach((prod, index) => {
        flatData.push({
          "Order ID": index === 0 ? order.orderId : "",
          "Order Date": index === 0 ? order.date : "",
          "Platform": index === 0 ? order.platform : "",
          "Account": index === 0 ? order.platformAccount : "",
          "Product Name": prod.productName,
          "Quantity": prod.qty,
          "Buying Price": prod.buyingPrice,
          "Selling Price": prod.sellingPrice,
          "Net Profit": prod.netProfit,
          "Delivery Date": index === 0 ? order.deliveryDate : "",
          "Delivery Slot": index === 0 ? order.deliverySlot : "",
          "Delivery Status": index === 0 ? (order.isDelivered ? "DELIVERED" : "PENDING") : "",
          "Payment Received?": order.paymentStatus.isReceived ? "YES" : "NO",
          "Payment Date": order.paymentStatus.isReceived ? order.paymentStatus.receivedDate : "N/A",
          "Payment Method": order.paymentStatus.isReceived ? order.paymentStatus.paymentMethod : ""
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Details");
    XLSX.writeFile(wb, `Store_Orders_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) return <div className="p-5 text-center"><Loader className="spinner-border text-primary" /> <p>Loading Orders...</p></div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3><ClipboardList className="me-2" /> Order Logs</h3>
        <Button variant="success" onClick={exportToExcel}>
          <FileSpreadsheet size={20} className="me-2" /> Export to Excel
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Table responsive bordered hover className="mb-0 align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: '150px' }}>Order Info</th>
              <th>Product Details</th>
              <th>Pricing / Profit</th>
              <th>Delivery Info</th>
              <th className="text-center">Status</th>
              <th className="text-center">Payment</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                {order.products.map((prod, pIndex) => (
                  <tr key={`${order._id}-${pIndex}`}>
                    {/* Header Info (Merged) */}
                    {pIndex === 0 && (
                      <td rowSpan={order.products.length} className="bg-light fw-bold">
                        <small className="text-muted d-block">ID: {order.orderId}</small>
                        <span className="d-block">{order.date}</span>
                        <Badge bg="info" className="mt-1">{order.platformAccount}</Badge>
                      </td>
                    )}

                    {/* Product Info */}
                    <td>
                      {prod.productName} 
                      <Badge bg="secondary" pill className="ms-2">x{prod.qty}</Badge>
                    </td>

                    {/* Profit Info */}
                    <td>
                      <div className="small">Buy: ₹{prod.buyingPrice}</div>
                      <div className="small">Sell: ₹{prod.sellingPrice}</div>
                      <div className="fw-bold text-success">Profit: ₹{prod.netProfit}</div>
                    </td>

                    {/* Delivery Info (Merged) */}
                    {pIndex === 0 && (
                      <td rowSpan={order.products.length} className="small">
                        <div className="fw-bold text-primary">{order.deliveryDate || 'Not set'}</div>
                        <div className="text-muted">{order.deliverySlot}</div>
                      </td>
                    )}

                    {/* Delivery Status Toggle (Merged) */}
                    {pIndex === 0 && (
                      <td rowSpan={order.products.length} className="text-center">
                        <Button 
                          variant={order.isDelivered ? "success" : "outline-warning"} 
                          size="sm"
                          onClick={() => toggleDelivery(order._id)}
                          className="d-flex align-items-center gap-1 mx-auto"
                        >
                          {order.isDelivered ? <PackageCheck size={16}/> : <Truck size={16}/>}
                          {order.isDelivered ? "Delivered" : "Mark Deliv."}
                        </Button>
                      </td>
                    )}

                    {/* Payment Status (Merged) */}
                    {pIndex === 0 && (
                      <td rowSpan={order.products.length} 
                          className="text-center" 
                          style={{ backgroundColor: order.paymentStatus.isReceived ? '#e8f5e9' : '#fff8e1' }}>
                        {order.paymentStatus.isReceived ? (
                          <div className="text-success fw-bold">
                            <CheckCircle size={20} /><br/>
                            <small>Paid {order.paymentStatus.receivedDate}</small>
                          </div>
                        ) : (
                          <Button variant="link" className="text-danger p-0 text-decoration-none" onClick={() => handlePaymentClick(order)}>
                            <XCircle size={20} /><br/>
                            <small>Unpaid</small>
                          </Button>
                        )}
                      </td>
                    )}

                    {/* Actions (Merged) */}
                    {pIndex === 0 && (
                      <td rowSpan={order.products.length} className="text-center">
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => navigate(`/edit-order/${order._id}`)}
                        >
                          <Edit3 size={16} /> Edit
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
                {/* Total Row for the Order */}
                <tr className="table-secondary">
                  <td colSpan="2" className="text-end small">Order Total Profit:</td>
                  <td colSpan="5" className="fw-bold text-success">₹{order.totalOrderProfit}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* --- PAYMENT MODAL --- */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Update Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Amount Received (₹)</Form.Label>
              <Form.Control 
                type="number" 
                value={paymentDetails.amountReceived}
                onChange={(e) => setPaymentDetails({...paymentDetails, amountReceived: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Received Date</Form.Label>
              <Form.Control 
                type="date" 
                value={paymentDetails.receivedDate}
                onChange={(e) => setPaymentDetails({...paymentDetails, receivedDate: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select 
                value={paymentDetails.paymentMethod}
                onChange={(e) => setPaymentDetails({...paymentDetails, paymentMethod: e.target.value})}
              >
                <option>UPI / GPay</option>
                <option>Cash</option>
                <option>Bank Transfer</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Close</Button>
          <Button variant="primary" onClick={submitPayment}>Confirm Received</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

import { ClipboardList } from 'lucide-react'; 
export default OrderLogs;