// import React, { useState } from 'react';
// import { Card, Form, Button, Row, Col, Table } from 'react-bootstrap';
// import { Plus, Trash2, Save } from 'lucide-react';
// import axios from 'axios';

// const Dashboard = () => {
//   // 1. Initial State structure
//   const [orderHeader, setOrderHeader] = useState({
//     orderId: '',
//     date: new Date().toISOString().split('T')[0], // Default today
//     time: '',
//     platform: 'Amazon',
//     platformAccount: '',
//     cardUsed: '',
//     cashback: 0,
//     deliveryDate: '',
//     deliverySlot: '7 - 10 PM'
//   });

//   const [products, setProducts] = useState([
//     { productName: '', qty: 1, listingPrice: 0, buyingPrice: 0, sellingPrice: 0 }
//   ]);

//   // 2. Handle Header changes (Top section)
//   const handleHeaderChange = (e) => {
//     setOrderHeader({ ...orderHeader, [e.target.name]: e.target.value });
//   };

//   // 3. Handle Product changes (Dynamic rows)
//   const handleProductChange = (index, e) => {
//     const newProducts = [...products];
//     newProducts[index][e.target.name] = e.target.value;
//     setProducts(newProducts);
//   };

//   // 4. Add/Remove Product Rows
//   const addProductRow = () => {
//     setProducts([...products, { productName: '', qty: 1, listingPrice: 0, buyingPrice: 0, sellingPrice: 0 }]);
//   };

//   const removeProductRow = (index) => {
//     const newProducts = products.filter((_, i) => i !== index);
//     setProducts(newProducts);
//   };

//   // 5. Submit to Backend
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Calculate profits before sending
//     let totalOrderProfit = 0;
//     const processedProducts = products.map(p => {
//       const netProfit = (parseFloat(p.sellingPrice) - parseFloat(p.buyingPrice)) * parseInt(p.qty);
//       totalOrderProfit += netProfit;
//       return { ...p, netProfit };
//     });

//     const finalOrder = {
//       ...orderHeader,
//       products: processedProducts,
//       totalOrderProfit: totalOrderProfit
//     };

//     try {
//       await axios.post('http://localhost:5000/api/orders', finalOrder);
//       alert("Order saved successfully!");
//       // Reset form if needed
//       window.location.reload(); 
//     } catch (err) {
//       console.error(err);
//       alert("Error saving order");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <h3 className="mb-4">Create New Order</h3>
//       <Form onSubmit={handleSubmit}>
        
//         {/* --- ORDER HEADER --- */}
//         <Card className="mb-4 shadow-sm">
//           <Card.Header className="bg-primary text-white">Order Details</Card.Header>
//           <Card.Body>
//             <Row className="g-3">
//               <Col md={3}><Form.Label>Order ID</Form.Label><Form.Control name="orderId" required onChange={handleHeaderChange} /></Col>
//               <Col md={3}><Form.Label>Date</Form.Label><Form.Control type="date" name="date" value={orderHeader.date} onChange={handleHeaderChange} /></Col>
//               <Col md={2}><Form.Label>Time</Form.Label><Form.Control type="time" name="time" onChange={handleHeaderChange} /></Col>
//               <Col md={2}><Form.Label>Platform</Form.Label><Form.Select name="platform" onChange={handleHeaderChange}><option>Amazon</option><option>Flipkart</option><option>Other</option></Form.Select></Col>
//               <Col md={2}><Form.Label>Account Name</Form.Label><Form.Control name="platformAccount" placeholder="e.g. Nikhil" onChange={handleHeaderChange} /></Col>
//               <Col md={3}><Form.Label>Card/Cashback Info</Form.Label><Form.Control name="cardUsed" placeholder="e.g. SBI 5%" onChange={handleHeaderChange} /></Col>
//               <Col md={3}><Form.Label>Delivery Date</Form.Label><Form.Control type="date" name="deliveryDate" onChange={handleHeaderChange} /></Col>
//               <Col md={3}><Form.Label>Delivery Slot</Form.Label><Form.Control name="deliverySlot" defaultValue="7 - 10 PM" onChange={handleHeaderChange} /></Col>
//             </Row>
//           </Card.Body>
//         </Card>

//         {/* --- PRODUCTS TABLE --- */}
//         <Card className="shadow-sm">
//           <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
//             Products In This Order
//             <Button variant="outline-light" size="sm" onClick={addProductRow}><Plus size={16} /> Add Product</Button>
//           </Card.Header>
//           <Card.Body>
//             <Table responsive bordered hover>
//               <thead className="table-light">
//                 <tr>
//                   <th>Product Name</th>
//                   <th style={{width: '100px'}}>Qty</th>
//                   <th>Listing Price</th>
//                   <th>Buying Price</th>
//                   <th>Selling Price</th>
//                   <th style={{width: '50px'}}></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((product, index) => (
//                   <tr key={index}>
//                     <td><Form.Control name="productName" required onChange={(e) => handleProductChange(index, e)} /></td>
//                     <td><Form.Control type="number" name="qty" min="1" defaultValue="1" onChange={(e) => handleProductChange(index, e)} /></td>
//                     <td><Form.Control type="number" name="listingPrice" onChange={(e) => handleProductChange(index, e)} /></td>
//                     <td><Form.Control type="number" name="buyingPrice" onChange={(e) => handleProductChange(index, e)} /></td>
//                     <td><Form.Control type="number" name="sellingPrice" onChange={(e) => handleProductChange(index, e)} /></td>
//                     <td>
//                       {products.length > 1 && (
//                         <Button variant="outline-danger" size="sm" onClick={() => removeProductRow(index)}>
//                           <Trash2 size={16} />
//                         </Button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             <div className="text-end">
//                <Button type="submit" variant="success" size="lg" className="px-5">
//                  <Save size={20} className="me-2" /> Save Full Order
//                </Button>
//             </div>
//           </Card.Body>
//         </Card>
//       </Form>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Table, InputGroup } from 'react-bootstrap';
import { Plus, Trash2, Save, PackagePlus, Calculator } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  // 1. Order Header State (Fields that appear once per order)
  const [orderHeader, setOrderHeader] = useState({
    orderId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    platform: 'Amazon',
    platformAccount: '',
    cardUsed: '',
    cashbackAmount: 0, // General cashback for the whole order
    deliveryDate: '',
    deliverySlot: '7 - 10 PM'
  });

  // 2. Products State (Multiple rows)
  const [products, setProducts] = useState([
    { 
        productName: '', 
        qty: 1, 
        listingPrice: 0, 
        listingTotal: 0,
        cashback: 0, 
        buyingPrice: 0, 
        buyingTotal: 0,
        sellingPrice: 0,
        sellingTotal: 0,
        netProfit: 0 
    }
  ]);

  // Handle Header Changes
  const handleHeaderChange = (e) => {
    setOrderHeader({ ...orderHeader, [e.target.name]: e.target.value });
  };

  // 3. Handle Product Changes + Automatic Calculations
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...products];
    
    // Update the changed field
    newProducts[index][name] = value;

    // Perform Calculations
    const q = parseFloat(newProducts[index].qty) || 0;
    const lp = parseFloat(newProducts[index].listingPrice) || 0;
    const bp = parseFloat(newProducts[index].buyingPrice) || 0;
    const sp = parseFloat(newProducts[index].sellingPrice) || 0;

    // Logic: Totals = Price * Quantity
    newProducts[index].listingTotal = (lp * q).toFixed(2);
    newProducts[index].buyingTotal = (bp * q).toFixed(2);
    newProducts[index].sellingTotal = (sp * q).toFixed(2);
    
    // Logic: Profit = (Selling Total - Buying Total)
    newProducts[index].netProfit = ((sp * q) - (bp * q)).toFixed(2);

    setProducts(newProducts);
  };

  const addProductRow = () => {
    setProducts([...products, { 
        productName: '', qty: 1, listingPrice: 0, listingTotal: 0, 
        cashback: 0, buyingPrice: 0, buyingTotal: 0, 
        sellingPrice: 0, sellingTotal: 0, netProfit: 0 
    }]);
  };

  const removeProductRow = (index) => {
    if(products.length > 1) {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
    }
  };

  // 4. Submit to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate Total Order Profit for the summary
    const totalOrderProfit = products.reduce((acc, p) => acc + parseFloat(p.netProfit), 0);

    const finalOrder = {
      ...orderHeader,
      products: products,
      totalOrderProfit: totalOrderProfit.toFixed(2)
    };

    try {
      await axios.post('http://localhost:5000/api/orders', finalOrder);
      alert("🎉 Order Saved Successfully!");
      window.location.reload(); // Reset form
    } catch (err) {
      console.error(err);
      alert("Error saving order. Check if server is running.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark"><PackagePlus className="me-2" /> New Order Entry</h2>
        <div className="text-muted small">MERN Store Manager v1.1</div>
      </div>

      <Form onSubmit={handleSubmit}>
        {/* --- SECTION 1: ORDER HEADER --- */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Header className="bg-primary text-white fw-bold">1. Platform & Account Details</Card.Header>
          <Card.Body className="bg-light">
            <Row className="g-3">
              <Col md={3}>
                <Form.Label className="small fw-bold">Order ID</Form.Label>
                <Form.Control name="orderId" placeholder="e.g. 405-..." required onChange={handleHeaderChange} />
              </Col>
              <Col md={3}>
                <Form.Label className="small fw-bold">Order Date</Form.Label>
                <Form.Control type="date" name="date" value={orderHeader.date} onChange={handleHeaderChange} />
              </Col>
              <Col md={2}>
                <Form.Label className="small fw-bold">Marketplace</Form.Label>
                <Form.Select name="platform" onChange={handleHeaderChange}>
                  <option>Amazon</option>
                  <option>Flipkart</option>
                  <option>Blinkit</option>
                  <option>Other</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label className="small fw-bold">Account</Form.Label>
                <Form.Control name="platformAccount" placeholder="Nikhil / D" onChange={handleHeaderChange} />
              </Col>
              <Col md={2}>
                <Form.Label className="small fw-bold">Card/Cashback</Form.Label>
                <Form.Control name="cardUsed" placeholder="SBI / 460" onChange={handleHeaderChange} />
              </Col>
            </Row>
            <Row className="g-3 mt-2">
               <Col md={3}>
                <Form.Label className="small fw-bold">Delivery Date</Form.Label>
                <Form.Control type="date" name="deliveryDate" onChange={handleHeaderChange} />
              </Col>
              <Col md={3}>
                <Form.Label className="small fw-bold">Delivery Time Slot</Form.Label>
                <Form.Control name="deliverySlot" defaultValue="7 - 10 PM" onChange={handleHeaderChange} />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* --- SECTION 2: PRODUCT TABLE (THE CORE LOGIC) --- */}
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
            <span className="fw-bold"><Calculator size={18} className="me-2"/> 2. Products & Pricing</span>
            <Button variant="outline-light" size="sm" onClick={addProductRow}>
              <Plus size={16} /> Add Another Product
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive bordered hover className="mb-0 align-middle text-center">
              <thead className="table-secondary small">
                <tr>
                  <th style={{minWidth: '200px'}}>Product Name</th>
                  <th style={{width: '80px'}}>Qty</th>
                  <th>Listing Price</th>
                  <th className="bg-info bg-opacity-10">Listing Total</th>
                  <th>Cashback</th>
                  <th>Buying Price</th>
                  <th className="bg-warning bg-opacity-10">Buying Total</th>
                  <th>Selling Price</th>
                  <th className="bg-primary bg-opacity-10">Selling Total</th>
                  <th className="bg-success text-white">Net Profit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control size="sm" name="productName" placeholder="e.g. Golddrop Oil" required onChange={(e) => handleProductChange(index, e)} />
                    </td>
                    <td>
                      <Form.Control size="sm" type="number" name="qty" value={product.qty} min="1" onChange={(e) => handleProductChange(index, e)} />
                    </td>
                    
                    {/* Listing */}
                    <td><Form.Control size="sm" type="number" name="listingPrice" placeholder="0" onChange={(e) => handleProductChange(index, e)} /></td>
                    <td className="fw-bold text-muted">₹{product.listingTotal}</td>

                    {/* Cashback/Discount per product */}
                    <td><Form.Control size="sm" type="number" name="cashback" placeholder="0" onChange={(e) => handleProductChange(index, e)} /></td>

                    {/* Buying */}
                    <td><Form.Control size="sm" type="number" name="buyingPrice" placeholder="0" onChange={(e) => handleProductChange(index, e)} /></td>
                    <td className="fw-bold text-dark">₹{product.buyingTotal}</td>

                    {/* Selling */}
                    <td><Form.Control size="sm" type="number" name="sellingPrice" placeholder="0" onChange={(e) => handleProductChange(index, e)} /></td>
                    <td className="fw-bold text-primary">₹{product.sellingTotal}</td>

                    {/* Final Profit for this row */}
                    <td className="fw-bold text-success" style={{backgroundColor: '#f0fff4'}}>₹{product.netProfit}</td>

                    <td>
                      <Button variant="link" className="text-danger p-0" onClick={() => removeProductRow(index)}>
                        <Trash2 size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
          <Card.Footer className="bg-white p-3 d-flex justify-content-between align-items-center">
             <div className="text-muted small italic">* All totals are calculated automatically based on Quantity.</div>
             <Button type="submit" variant="success" size="lg" className="px-5 fw-bold shadow">
                <Save className="me-2" /> Save Order to Logs
             </Button>
          </Card.Footer>
        </Card>
      </Form>
    </div>
  );
};

export default Dashboard;