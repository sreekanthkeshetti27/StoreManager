// import React, { useState, useEffect } from 'react';
// import { Table, Button, Badge, Card, Modal, Form } from 'react-bootstrap';
// import { FileSpreadsheet, Truck, Edit3, CheckCircle, XCircle, PackageCheck } from 'lucide-react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import { useNavigate } from 'react-router-dom';

// const OrderLogs = () => {
//   const [orders, setOrders] = useState([]);
//   const [showPayModal, setShowPayModal] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [payData, setPayData] = useState({ receivedDate: new Date().toISOString().split('T')[0], amountReceived: 0, paymentMethod: 'UPI' });
//   const navigate = useNavigate();

//   useEffect(() => { fetchOrders(); }, []);
//   const fetchOrders = async () => { const res = await axios.get('http://localhost:5000/api/orders'); setOrders(res.data); };

//   const toggleDelivery = async (id) => { 
//     await axios.patch(`http://localhost:5000/api/orders/${id}/delivery`); 
//     fetchOrders(); 
//   };

//   const handlePayClick = (order) => { 
//     setSelectedOrder(order); 
//     setPayData({...payData, amountReceived: order.totalBuyingPrice}); 
//     setShowPayModal(true); 
//   };

//   const submitPayment = async () => {
//     await axios.patch(`http://localhost:5000/api/orders/${selectedOrder._id}/payment`, { isReceived: true, ...payData });
//     setShowPayModal(false);
//     fetchOrders();
//   };

//   const exportToExcel = () => {
//     const flatData = [];
//     orders.forEach(order => {
//       order.products.forEach((p, idx) => {
//         flatData.push({
//           "Order ID": idx === 0 ? order.orderId : "",
//           "Date": idx === 0 ? order.date : "",
//           "Account": idx === 0 ? order.platformAccount : "",
//           "Card Used": idx === 0 ? order.cardUsed : "",
//           "Cashback": idx === 0 ? order.cashbackAmount : "",
//           "Product": p.productName,
//           "Qty": p.qty,
//           "List Total": p.listingTotal,
//           "Buy Total": p.buyingTotal,
//           "Sell Total": p.sellingTotal,
//           "Profit": p.netProfit,
//           "Deliv Date": idx === 0 ? order.deliveryDate : "",
//           "Deliv Slot": idx === 0 ? order.deliverySlot : "",
//           "Status": idx === 0 ? (order.isDelivered ? "Delivered" : "Pending") : ""
//         });
//       });
//       flatData.push({ "Product": "ORDER TOTALS", "List Total": order.totalListingPrice, "Buy Total": order.totalBuyingPrice, "Sell Total": order.totalSellingPrice, "Profit": order.totalOrderProfit });
//     });
//     const ws = XLSX.utils.json_to_sheet(flatData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Store Logs");
//     XLSX.writeFile(wb, "Store_Management_Export.xlsx");
//   };

//   return (
//     <div className="container-fluid py-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold">All Orders History</h3>
//         <Button variant="success" onClick={exportToExcel}><FileSpreadsheet className="me-2"/>Export to Excel</Button>
//       </div>

//       <Table bordered hover responsive className="bg-white align-middle text-center small shadow-sm">
//         <thead className="table-dark">
//           <tr>
//             <th>Order / Card / Cashback</th>
//             <th>Product Details</th>
//             <th>List Total</th>
//             <th>Buy Total</th>
//             <th>Sell Total</th>
//             <th>Profit</th>
//             <th>Delivery Status</th>
//             <th>Paid?</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order) => (
//             <React.Fragment key={order._id}>
//               {order.products.map((p, idx) => (
//                 <tr key={idx}>
//                   {idx === 0 && (
//                     <td rowSpan={order.products.length} className="bg-light">
//                       <strong>{order.orderId}</strong><br/>
//                       <Badge bg="info">{order.platformAccount}</Badge><br/>
//                       <small className="text-muted">{order.cardUsed}</small><br/>
//                       <Badge bg="warning" text="dark">₹{order.cashbackAmount}</Badge>
//                     </td>
//                   )}
//                   <td className="text-start">{p.productName} <Badge bg="secondary">x{p.qty}</Badge></td>
//                   <td>₹{p.listingTotal}</td>
//                   <td>₹{p.buyingTotal}</td>
//                   <td>₹{p.sellingTotal}</td>
//                   <td className="text-success fw-bold">₹{p.netProfit}</td>
//                   {idx === 0 && (
//                     <td rowSpan={order.products.length}>
//                       <Button variant={order.isDelivered ? "success" : "outline-warning"} size="sm" onClick={() => toggleDelivery(order._id)}>
//                         {order.isDelivered ? <><PackageCheck size={16}/> Delivered</> : <><Truck size={16}/> Mark Deliv.</>}
//                       </Button>
//                       <div className="small mt-1 text-muted">{order.deliveryDate}</div>
//                     </td>
//                   )}
//                   {idx === 0 && (
//                     <td rowSpan={order.products.length} style={{ backgroundColor: order.paymentStatus.isReceived ? '#e8f5e9' : '#fff8e1' }}>
//                       {order.paymentStatus.isReceived ? (
//                         <div className="text-success"><CheckCircle size={20}/><br/><small>Paid</small></div>
//                       ) : (
//                         <Button variant="link" className="text-danger p-0" onClick={() => handlePayClick(order)}>
//                           <XCircle size={20}/><br/><small>Unpaid</small>
//                         </Button>
//                       )}
//                     </td>
//                   )}
//                   {idx === 0 && (
//                     <td rowSpan={order.products.length}>
//                       <Button variant="outline-primary" size="sm" onClick={() => navigate(`/edit-order/${order._id}`)}><Edit3 size={16}/></Button>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//               <tr className="table-secondary fw-bold">
//                 <td colSpan="2" className="text-end">SUMMARY TOTALS:</td>
//                 <td>₹{order.totalListingPrice}</td>
//                 <td>₹{order.totalBuyingPrice}</td>
//                 <td>₹{order.totalSellingPrice}</td>
//                 <td colSpan="3" className="text-success">Net Profit: ₹{order.totalOrderProfit}</td>
//                 <td></td>
//               </tr>
//             </React.Fragment>
//           ))}
//         </tbody>
//       </Table>

//       <Modal show={showPayModal} onHide={() => setShowPayModal(false)} centered>
//         <Modal.Header closeButton><Modal.Title>Receive Payment</Modal.Title></Modal.Header>
//         <Modal.Body>
//           <Form.Group className="mb-3"><Form.Label>Amount (₹)</Form.Label><Form.Control type="number" value={payData.amountReceived} onChange={e => setPayData({...payData, amountReceived: e.target.value})}/></Form.Group>
//           <Form.Group className="mb-3"><Form.Label>Method</Form.Label><Form.Select onChange={e => setPayData({...payData, paymentMethod: e.target.value})}><option>UPI</option><option>Cash</option></Form.Select></Form.Group>
//         </Modal.Body>
//         <Modal.Footer><Button variant="primary" onClick={submitPayment}>Confirm Paid</Button></Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default OrderLogs;
import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Card, Modal, Form } from 'react-bootstrap';
import { FileSpreadsheet, Truck, Edit3, CheckCircle, XCircle, PackageCheck ,Trash2} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { Upload } from 'lucide-react'; // Import Upload icon
import api from '../api';

const OrderLogs = () => {
    const fileInputRef = useRef(null); // To trigger the hidden file input 
  const [orders, setOrders] = useState([]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [payData, setPayData] = useState({ receivedDate: new Date().toISOString().split('T')[0], amountReceived: 0, paymentMethod: 'UPI' });
  const navigate = useNavigate();
  // Calculate Grand Totals for the bottom row
const grandTotals = orders.reduce((acc, order) => {
    acc.listing += parseFloat(order.totalListingPrice || 0);
    acc.buying += parseFloat(order.totalBuyingPrice || 0);
    acc.selling += parseFloat(order.totalSellingPrice || 0);
    acc.profit += parseFloat(order.totalOrderProfit || 0);
    return acc;
}, { listing: 0, buying: 0, selling: 0, profit: 0 });

// Calculate Grand Totals for the UI
const grandListingTotal = orders.reduce((acc, order) => acc + parseFloat(order.totalListingPrice || 0), 0);
const grandBuyingTotal = orders.reduce((acc, order) => acc + parseFloat(order.totalBuyingPrice || 0), 0);
const grandSellingTotal = orders.reduce((acc, order) => acc + parseFloat(order.totalSellingPrice || 0), 0);
const grandNetProfit = orders.reduce((acc, order) => acc + parseFloat(order.totalOrderProfit || 0), 0);

  useEffect(() => { fetchOrders(); }, []);
  // const fetchOrders = async () => { const res = await axios.get('http://localhost:5000/api/orders'); setOrders(res.data); };
    const fetchOrders = async () => { const res = await axios.get('/api/orders'); setOrders(res.data); };


  const toggleDelivery = async (id) => { 
    try {
              // await axios.patch(`http://localhost:5000/api/orders/${id}/delivery`); 

        await axios.patch(`/api/orders/${id}/delivery`); 
        fetchOrders(); 
    } catch(err) { alert("Error toggling delivery"); }
  };
  // --- DELETE LOGIC ---
  const handleDelete = async (id, orderId) => {
    if (window.confirm(`Are you sure you want to delete Order #${orderId}? This cannot be undone.`)) {
      try {
                // await axios.delete(`http://localhost:5000/api/orders/${id}`);

        await axios.delete(`/api/orders/${id}`);
        alert("Order Deleted");
        fetchOrders(); // Refresh the list
      } catch (err) {
        alert("Error deleting order");
      }
    }
  };

  const handlePayClick = (order) => { 
    setSelectedOrder(order); 
    setPayData({...payData, amountReceived: order.totalSellingPrice}); // Usually received from father
    setShowPayModal(true); 
  };

  const submitPayment = async () => {
    try {
              // await axios.patch(`http://localhost:5000/api/orders/${selectedOrder._id}/payment`, { isReceived: true, ...payData });

        await axios.patch(`/api/orders/${selectedOrder._id}/payment`, { isReceived: true, ...payData });
        setShowPayModal(false);
        fetchOrders();
    } catch(err) { alert("Error updating payment"); }
  };

  const exportToExcel = () => {
    const flatData = [];
    orders.forEach(order => {
      order.products.forEach((p, idx) => {
        flatData.push({
          "Order ID": idx === 0 ? order.orderId : "",
          "Date": idx === 0 ? order.date : "",
          "Account": idx === 0 ? order.platformAccount : "",
          "Card": idx === 0 ? order.cardUsed : "",
          "Cashback": idx === 0 ? order.cashbackAmount : "",
          "Listed Price": p.listingPrice,
          "Listed Total": p.listingTotal,
          "Product": p.productName,
          "Buying Price": p.buyingPrice,
          "Buying Total": p.buyingTotal,
          "Quantity": p.qty,
          "Selling Price": p.sellingPrice,
          "Selling Total": p.sellingTotal,
          "Net Profit": p.netProfit,
          "Delivery Date": idx === 0 ? order.deliveryDate : "",
          "Status": idx === 0 ? (order.isDelivered ? "Delivered" : "Pending") : "",
          // --- NEW COLUMNS ADDED BELOW ---
          "Payment Status": idx === 0 ? (order.paymentStatus.isReceived ? "PAID" : "UNPAID") : "",
          "Paid Date": idx === 0 && order.paymentStatus.isReceived ? order.paymentStatus.receivedDate : "-",
          "Paid Amount": idx === 0 && order.paymentStatus.isReceived ? order.paymentStatus.amountReceived : "0",
          "Pay Method": idx === 0 && order.paymentStatus.isReceived ? order.paymentStatus.paymentMethod : "-"
        });
      });
      flatData.push({ "Product": "TOTAL", "Listed Total": order.totalListingPrice, "Buying Total": order.totalBuyingPrice, "Selling Total": order.totalSellingPrice, "Net Profit": order.totalOrderProfit,"Payment Status": order.paymentStatus.isReceived ? "SETTLED" : "DUE"  });
    });
      // --- ADD THE GRAND TOTAL ROW TO EXCEL ---
    flatData.push({}); // Empty row for spacing
    flatData.push({
      "Product": "GRAND TOTAL (ALL ORDERS)",
      "Listed Total": grandTotals.listing.toFixed(2),
      "Buying Total": grandTotals.buying.toFixed(2),
      "Selling Total": grandTotals.selling.toFixed(2),
      "Net Profit": grandTotals.profit.toFixed(2)
    });
    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Store Logs");
    XLSX.writeFile(wb, "Order_Management_Report.xlsx");
  };
  // const handleImport = (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();

  //   reader.onload = async (event) => {
  //     const data = new Uint8Array(event.target.result);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //     const ordersToUpload = [];
  //     let currentOrder = null;

  //     jsonData.forEach((row) => {
  //       // Skip rows that are "TOTAL" or "GRAND TOTAL" rows from previous exports
  //       if (row["Product"] === "TOTAL" || row["Product"] === "GRAND TOTAL (ALL ORDERS)") return;

  //       // If 'Order ID' exists, it's a new order header
  //       if (row["Order ID"] && row["Order ID"] !== "") {
  //         if (currentOrder) ordersToUpload.push(currentOrder); // Save previous order

  //         currentOrder = {
  //           orderId: String(row["Order ID"]),
  //           date: row["Date"],
  //           platform: row["Platform"] || "Amazon",
  //           platformAccount: row["Account"],
  //           cardUsed: row["Card"],
  //           cashbackAmount: parseFloat(row["Cashback"]) || 0,
  //           deliveryDate: row["Delivery Date"],
  //           deliverySlot: row["Deliv Slot"] || "7 - 10 PM",
  //           products: [],
  //           totalListingPrice: 0,
  //           totalBuyingPrice: 0,
  //           totalSellingPrice: 0,
  //           totalOrderProfit: 0
  //         };
  //       }

  //       // Add the product to the current active order
  //       if (currentOrder) {
  //         const product = {
  //           productName: row["Product"],
  //           qty: parseInt(row["Quantity"]) || 1,
  //           listingPrice: parseFloat(row["Listed Price"]) || 0,
  //           listingTotal: parseFloat(row["Listed Total"]) || 0,
  //           buyingPrice: parseFloat(row["Buying Price"]) || 0,
  //           buyingTotal: parseFloat(row["Buying Total"]) || 0,
  //           sellingPrice: parseFloat(row["Selling Price"]) || 0,
  //           sellingTotal: parseFloat(row["Selling Total"]) || 0,
  //           netProfit: parseFloat(row["Net Profit"]) || 0
  //         };
  //         currentOrder.products.push(product);
          
  //         // Update Order Totals
  //         currentOrder.totalListingPrice += product.listingTotal;
  //         currentOrder.totalBuyingPrice += product.buyingTotal;
  //         currentOrder.totalSellingPrice += product.sellingTotal;
  //         currentOrder.totalOrderProfit += product.netProfit;
  //       }
  //     });

  //     // Push the last order in the loop
  //     if (currentOrder) ordersToUpload.push(currentOrder);

  //     // Send to Backend
  //     try {
  //       await axios.post('http://localhost:5000/api/orders/bulk', ordersToUpload);
  //       alert(`Successfully imported ${ordersToUpload.length} orders!`);
  //       fetchOrders(); // Refresh table
  //     } catch (err) {
  //       alert("Error during import. Check Excel format.");
  //     }
  //   };
  //   reader.readAsArrayBuffer(file);
  // };

  // After Import
// const handleImport = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.onload = async (event) => {
//       const data = new Uint8Array(event.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
      
//       // CRITICAL: defval: "" prevents the columns from shifting left if a cell is empty
//       const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

//       const formatDate = (val) => {
//         if (!val || val === "") return "";
//         if (val instanceof Date) return val.toISOString().split('T')[0];
//         if (typeof val === 'number') {
//           const date = new Date((val - 25569) * 86400 * 1000);
//           return date.toISOString().split('T')[0];
//         }
//         return String(val);
//       };

//       const ordersToUpload = [];
//       let currentOrder = null;

//       // STARTING LOOP - Skipping the header (Row 0)
//       for (let i = 1; i < rows.length; i++) {
//         const row = rows[i];
//         if (!row || row.length === 0) continue;

//         const sNoTrigger = row[0]; // Col A: Orders
        
//         // Skip "Total" summary rows from Excel
//         const isSummaryRow = String(row[0]).toLowerCase().includes("total") || 
//                              String(row[7]).toLowerCase().includes("total") ||
//                              String(row[8]).toLowerCase().includes("total");
//         if (isSummaryRow) continue;

//         // If Col A has a Serial Number, it's a NEW ORDER
//         if (sNoTrigger !== "" && !isNaN(sNoTrigger)) {
//           if (currentOrder) ordersToUpload.push(currentOrder);

//           currentOrder = {
//             orderId: "", // Kept blank as requested
//             date: formatDate(row[2]), // Col C: Date
//             platform: row[1] || "Amazon", // Col B: Marketplace
//             platformAccount: row[3] || "", // Col D: Account
//             cardUsed: "", 
//             cashbackAmount: parseFloat(row[4]) || 0, // Col E: Cashback
//             deliveryDate: formatDate(row[14]), // Col O: Delivery Date
//             deliverySlot: row[15] || "7 - 10 PM", // Col P: Delivery Time
//             products: [],
//             totalListingPrice: 0,
//             totalBuyingPrice: 0,
//             totalSellingPrice: 0,
//             totalOrderProfit: 0,
//             isDelivered: false,
//             paymentStatus: { isReceived: false, receivedDate: "", amountReceived: 0, paymentMethod: "" }
//           };
//         }

//         // ADDING PRODUCT DATA (Indices verified from your image)
//         // Col H (index 7) is Product Name
//         if (currentOrder && row[7] !== "") { 
//           const product = {
//             productName: String(row[7]),       // Col H: Product
//             listingPrice: parseFloat(row[5]) || 0, // Col F: Listed Price
//             listingTotal: parseFloat(row[6]) || 0, // Col G: Total (Listing)
//             buyingPrice: parseFloat(row[8]) || 0,  // Col I: Buying Price
//             buyingTotal: parseFloat(row[9]) || 0,  // Col J: Total (Buying)
//             qty: parseInt(row[10]) || 1,           // Col K: Quantity
//             sellingPrice: parseFloat(row[11]) || 0, // Col L: Selling Price
//             sellingTotal: parseFloat(row[12]) || 0, // Col M: Total (Selling)
//             netProfit: parseFloat(row[13]) || 0    // Col N: Net Profit
//           };

//           currentOrder.products.push(product);
          
//           // Add up the grand totals for the order summary
//           currentOrder.totalListingPrice += product.listingTotal;
//           currentOrder.totalBuyingPrice += product.buyingTotal;
//           currentOrder.totalSellingPrice += product.sellingTotal;
//           currentOrder.totalOrderProfit += product.netProfit;
//         }
//       }

//       if (currentOrder) ordersToUpload.push(currentOrder);

//       try {
//         await axios.post('http://localhost:5000/api/orders/bulk', ordersToUpload);
//         alert(`Successfully imported ${ordersToUpload.length} orders!`);
//         fetchOrders(); 
//       } catch (err) {
//         console.error(err);
//         alert("Error: Check backend console.");
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };
const handleImport = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = async (event) => {
    try {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // header: 1 reads as array of arrays. 
      // defval: "" ensures empty cells don't cause columns to shift.
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

      const formatDate = (val) => {
        if (!val || val === "") return "";
        if (val instanceof Date) return val.toISOString().split('T')[0];
        if (typeof val === 'number') {
          // Convert Excel Serial Number to JS Date
          const date = new Date((val - 25569) * 86400 * 1000);
          return date.toISOString().split('T')[0];
        }
        return String(val);
      };

      const ordersToUpload = [];
      let currentOrder = null;

      // Start loop from index 1 (skipping the Excel Header Row)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        // Detect "Total" summary rows in the manual Excel and ignore them
        const rowContent = row.join(" ").toLowerCase();
        if (rowContent.includes("total")) continue;

        const sNoTrigger = row[0]; // Column A (Index 0): Orders Serial Number

        // LOGIC: If Column A has a Serial Number, it's the start of a NEW ORDER
        if (sNoTrigger !== "" && !isNaN(sNoTrigger)) {
          if (currentOrder) ordersToUpload.push(currentOrder);

          currentOrder = {
            orderId: "", // Blank as requested
            date: formatDate(row[2]), // Column C: Date
            platform: row[1] || "Amazon", // Column B: Marketplace
            platformAccount: row[3] || "", // Column D: Account
            cardUsed: "", // Not in manual sheet, keep blank
            cashbackAmount: parseFloat(row[4]) || 0, // Column E: Cashback
            deliveryDate: formatDate(row[14]), // Column O: Delivery Date
            deliverySlot: row[15] || "7 - 10 PM", // Column P: Delivery Time
            products: [],
            totalListingPrice: 0,
            totalBuyingPrice: 0,
            totalSellingPrice: 0,
            totalOrderProfit: 0,
            isDelivered: false,
            paymentStatus: {
              isReceived: false,
              receivedDate: "",
              amountReceived: 0,
              paymentMethod: ""
            }
          };
        }

        // ADDING PRODUCT DATA (Indices based on your image)
        // Col H (Index 7) is Product Name
        if (currentOrder && row[7] !== "") {
          const buyTotal = parseFloat(row[9]) || 0;    // Column J: Buying Total
          const sellTotal = parseFloat(row[12]) || 0;  // Column M: Selling Total
          
          // --- FIX: CALCULATE PROFIT MANUALLY TO AVOID BLANK EXCEL CELLS ---
          const calculatedProfit = parseFloat((sellTotal - buyTotal).toFixed(2));

          const product = {
            productName: String(row[7]),           // Column H
            listingPrice: parseFloat(row[5]) || 0, // Column F
            listingTotal: parseFloat(row[6]) || 0, // Column G
            buyingPrice: parseFloat(row[8]) || 0,  // Column I
            buyingTotal: buyTotal,                 // Column J
            qty: parseInt(row[10]) || 1,           // Column K
            sellingPrice: parseFloat(row[11]) || 0, // Column L
            sellingTotal: sellTotal,               // Column M
            netProfit: calculatedProfit            // Calculated Value
          };

          currentOrder.products.push(product);

          // Update the running totals for the entire Order
          currentOrder.totalListingPrice += product.listingTotal;
          currentOrder.totalBuyingPrice += product.buyingTotal;
          currentOrder.totalSellingPrice += product.sellingTotal;
          currentOrder.totalOrderProfit += calculatedProfit;
        }
      }

      // Add the final order from the loop
      if (currentOrder) ordersToUpload.push(currentOrder);

      // Check if we actually found data
      if (ordersToUpload.length === 0) {
        alert("No valid orders found. Check if the Excel format matches the requirement.");
        return;
      }

      // Send to Backend
      // await axios.post('http://localhost:5000/api/orders/bulk', ordersToUpload);
            await axios.post('/api/orders/bulk', ordersToUpload);
      alert(`🎉 Success! ${ordersToUpload.length} orders imported with calculated profits.`);
      fetchOrders(); // Refresh the list
      
    } catch (err) {
      console.error("Import Error:", err);
      alert("Failed to import. Check console for details.");
    }
  };

  reader.readAsArrayBuffer(file);
}; 
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-dark">Store Order Logs</h3>
        {/* <Button variant="success" onClick={exportToExcel} className="shadow-sm">
          <FileSpreadsheet className="me-2"/> Export to Excel
        </Button> */}
        <div className="d-flex gap-2">
    {/* Hidden File Input */}
    <input 
      type="file" 
      ref={fileInputRef} 
      style={{ display: 'none' }} 
      accept=".xlsx, .xls,.pdf" 
      onChange={handleImport} 
    />
    
    {/* Import Button */}
    <Button variant="outline-primary" onClick={() => fileInputRef.current.click()}>
      <Upload size={18} className="me-2" /> Import Data
    </Button>

    <Button variant="success" onClick={exportToExcel}>
      <FileSpreadsheet className="me-2"/> Export to Excel
    </Button>
  </div>

      </div>

      <Card className="shadow-sm border-0">
        <Table bordered hover responsive className="bg-white align-middle text-center mb-0" style={{ fontSize: '0.85rem' }}>
          <thead className="table-dark">
            <tr>
                <th>#</th> {/* Serial Number Column */}
              <th>Order/Account</th>
              <th>Card/Cash</th>
              <th>Listed Price</th>
              <th className="table-info text-dark">Total</th>
              <th>Product</th>
              <th>Buying Price</th>
              <th className="table-warning text-dark">Total</th>
              <th>Qty</th>
              <th>Selling Price</th>
              <th className="table-primary text-dark">Total</th>
              <th className="bg-success">Net Profit</th>
              <th>Delivery / Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order,oIdx) => (
              <React.Fragment key={order._id}>
                {order.products.map((p, idx) => (
                  <tr key={idx}>
                    {/* Serial Number & Order Info merged */}
                     {idx === 0 && (
          <td rowSpan={order.products.length + 1} className="bg-light fw-bold border-end align-middle">
            {oIdx + 1} {/* This is your Serial Number */}
          </td>
        )}
                    {/* Common Order Header */}
                    {idx === 0 && (
                      <td rowSpan={order.products.length + 1} className="bg-light fw-bold border-end">
                        <small className="text-muted d-block">#{order.orderId}</small>
                        {order.date}<br/>
                        <Badge bg="info" className="mt-1">{order.platformAccount}</Badge>
                      </td>
                    )}
                    {idx === 0 && (
                      <td rowSpan={order.products.length + 1} className="bg-light border-end">
                        <small className="d-block">{order.cardUsed}</small>
                        <Badge bg="warning" text="dark">₹{order.cashbackAmount}</Badge>
                      </td>
                    )}

                    {/* Product Data Rows */}
                    <td>₹{p.listingPrice}</td>
                    <td className="fw-bold">₹{p.listingTotal}</td>
                    <td className="text-start fw-bold">{p.productName}</td>
                    <td>₹{p.buyingPrice}</td>
                    <td className="fw-bold">₹{p.buyingTotal}</td>
                    <td>{p.qty}</td>
                    <td>₹{p.sellingPrice}</td>
                    <td className="fw-bold">₹{p.sellingTotal}</td>
                    <td className="text-success fw-bold">₹{p.netProfit}</td>

                    {/* Delivery & Actions Header */}
                    {idx === 0 && (
                      <td rowSpan={order.products.length + 1} className="border-start">
                        <div className="mb-2">
                           <Button variant={order.isDelivered ? "success" : "outline-warning"} size="sm" onClick={() => toggleDelivery(order._id)} className="w-100 mb-1">
                             {order.isDelivered ? <><PackageCheck size={14}/> Deliv.</> : <><Truck size={14}/> Pend.</>}
                           </Button>
                           <small className="d-block text-muted">{order.deliveryDate}</small>
                        </div>
                        <hr className="my-1"/>
                        <div className="mb-2" style={{ cursor: 'pointer' }} onClick={() => handlePayClick(order)}>
                           {order.paymentStatus.isReceived ? 
                             <div className="text-success"><CheckCircle size={18}/><br/><small>Paid</small></div> : 
                             <div className="text-danger"><XCircle size={18}/><br/><small>Unpaid</small></div>}
                        </div>
                        <hr className="my-1"/>
                        <Button variant="outline-primary" size="sm" onClick={() => navigate(`/edit-order/${order._id}`)} className="w-100">
                          <Edit3 size={14}/> Edit
                        </Button>
                        {/* --- DELETE BUTTON --- */}
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(order._id, order.orderId)}>
                              <Trash2 size={14}/>
                            </Button>
                      </td>
                    )}
                  </tr>
                ))}
                
                {/* --- SUMMARY TOTALS ROW (Matches your Excel Image) --- */}
                <tr className="table-secondary fw-bold" style={{ borderTop: '2px solid #dee2e6' }}>
                  <td colSpan="1">Total</td>
                  <td>₹{order.totalListingPrice}</td>
                  <td colSpan="2"></td>
                  <td>₹{order.totalBuyingPrice}</td>
                  <td></td>
                  <td></td>
                  <td>₹{order.totalSellingPrice}</td>
                  <td className="text-success" style={{ backgroundColor: '#e6fffa' }}>₹{order.totalOrderProfit}</td>
                </tr>
              </React.Fragment>
            ))}

            {/* --- FINAL GRAND TOTAL ROW AT THE BOTTOM OF UI --- */}
<tr className="table-dark fw-bold border-top border-4 shadow-lg">
  {/* Span the first 3 columns: #, Order/Account, and Card/Cash */}
  <td colSpan="3" className="text-end text-uppercase py-3" style={{ letterSpacing: '1px' }}>
    <span className="text-warning">Grand Totals (All Orders):</span>
  </td>
  
  {/* Listing Price Column */}
  <td></td> 
  {/* Listing Total Column */}
  <td className="text-info fs-5">₹{grandListingTotal.toLocaleString()}</td>
  
  {/* Product Column */}
  <td></td>
  
  {/* Buying Price Column */}
  <td></td>
  {/* Buying Total Column */}
  <td className="text-warning fs-5">₹{grandBuyingTotal.toLocaleString()}</td>
  
  {/* Qty Column */}
  <td></td>
  
  {/* Selling Price Column */}
  <td></td>
  {/* Selling Total Column */}
  <td className="text-primary fs-5">₹{grandSellingTotal.toLocaleString()}</td>
  
  {/* Net Profit Column */}
  <td className="bg-success fs-5 text-white shadow-sm">
    ₹{grandNetProfit.toLocaleString()}
  </td>
  
  {/* Delivery/Actions Column */}
  <td></td>
</tr>          
          </tbody>
        </Table>
      </Card>

      {/* Payment Modal */}
      <Modal show={showPayModal} onHide={() => setShowPayModal(false)} centered>
  <Modal.Header closeButton className="bg-primary text-white">
    <Modal.Title>Receive Payment Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      {/* Amount Field */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Amount Received (₹)</Form.Label>
        <Form.Control 
          type="number" 
          value={payData.amountReceived} 
          onChange={e => setPayData({...payData, amountReceived: e.target.value})}
          placeholder="Enter amount"
        />
      </Form.Group>

      {/* Date Field */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Received Date</Form.Label>
        <Form.Control 
          type="date" 
          value={payData.receivedDate} 
          onChange={e => setPayData({...payData, receivedDate: e.target.value})}
        />
      </Form.Group>

      {/* --- ADDED PAYMENT METHOD DROPDOWN --- */}
      <Form.Group className="mb-3">
        <Form.Label className="fw-bold">Payment Method</Form.Label>
        <Form.Select 
          value={payData.paymentMethod} 
          onChange={e => setPayData({...payData, paymentMethod: e.target.value})}
        >
          <option value="UPI">UPI / GPay / PhonePe</option>
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Card">Card</option>
        </Form.Select>
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowPayModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={submitPayment} className="px-4 fw-bold">
      Confirm Received
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default OrderLogs;