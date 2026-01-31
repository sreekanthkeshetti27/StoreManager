import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Table } from 'react-bootstrap';
import { Plus, Trash2, Save, PackagePlus } from 'lucide-react';
import axios from 'axios';
import api from '../api';

const Dashboard = () => {
  const [orderHeader, setOrderHeader] = useState({
    orderId: '',
    date: new Date().toISOString().split('T')[0],
    platform: 'Amazon',
    platformAccount: '',
    cardUsed: '', // Separate Field
    cashbackAmount: 0, // Separate Field
    deliveryDate: '', // Estimated Delivery Date
    deliverySlot: '7 - 10 PM' // Estimated Delivery Time Slot
  });

  const [products, setProducts] = useState([
    { productName: '', qty: 1, listingPrice: 0, listingTotal: 0, buyingPrice: 0, buyingTotal: 0, sellingPrice: 0, sellingTotal: 0, netProfit: 0 }
  ]);

  const handleHeaderChange = (e) => {
    setOrderHeader({ ...orderHeader, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...products];
    newProducts[index][name] = value;

    const q = parseFloat(newProducts[index].qty) || 0;
    const lp = parseFloat(newProducts[index].listingPrice) || 0;
    const bp = parseFloat(newProducts[index].buyingPrice) || 0;
    const sp = parseFloat(newProducts[index].sellingPrice) || 0;

    newProducts[index].listingTotal = (lp * q).toFixed(2);
    newProducts[index].buyingTotal = (bp * q).toFixed(2);
    newProducts[index].sellingTotal = (sp * q).toFixed(2);
    newProducts[index].netProfit = ((sp * q) - (bp * q)).toFixed(2);

    setProducts(newProducts);
  };

  const addProductRow = () => {
    setProducts([...products, { productName: '', qty: 1, listingPrice: 0, listingTotal: 0, buyingPrice: 0, buyingTotal: 0, sellingPrice: 0, sellingTotal: 0, netProfit: 0 }]);
  };

  const removeProductRow = (index) => {
    if (products.length > 1) setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalListing = products.reduce((acc, p) => acc + parseFloat(p.listingTotal), 0);
    const totalBuying = products.reduce((acc, p) => acc + parseFloat(p.buyingTotal), 0);
    const totalSelling = products.reduce((acc, p) => acc + parseFloat(p.sellingTotal), 0);
    const totalProfit = products.reduce((acc, p) => acc + parseFloat(p.netProfit), 0);

    const finalOrder = {
      ...orderHeader,
      products,
      totalListingPrice: totalListing.toFixed(2),
      totalBuyingPrice: totalBuying.toFixed(2),
      totalSellingPrice: totalSelling.toFixed(2),
      totalOrderProfit: totalProfit.toFixed(2)
    };

    try {
      // await axios.post('http://localhost:5000/api/orders', finalOrder);
      await api.post('/api/orders', finalOrder);
      alert("✅ Order Saved Successfully!");
      window.location.reload();
    } catch (err) {
      alert("Error saving order. Make sure backend is running.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-primary fw-bold"><PackagePlus size={32} className="me-2"/>Order Entry Dashboard</h2>
      <Form onSubmit={handleSubmit}>
        <Card className="shadow-sm border-0 mb-4 bg-light">
          <Card.Header className="bg-primary text-white fw-bold">1. Order & Delivery Details</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={3}><Form.Label>Order ID</Form.Label><Form.Control name="orderId" required onChange={handleHeaderChange} /></Col>
              <Col md={3}><Form.Label>Order Date</Form.Label><Form.Control type="date" name="date" value={orderHeader.date} onChange={handleHeaderChange} /></Col>
              <Col md={3}><Form.Label>Marketplace</Form.Label><Form.Select name="platform" onChange={handleHeaderChange}><option>Amazon</option><option>Flipkart</option><option>Other</option></Form.Select></Col>
              <Col md={3}><Form.Label>Account Name</Form.Label><Form.Control name="platformAccount" placeholder="e.g. Nikhil" onChange={handleHeaderChange} /></Col>
              
              <Col md={3}><Form.Label>Card Used</Form.Label><Form.Control name="cardUsed" placeholder="e.g. SBI Credit Card" onChange={handleHeaderChange} /></Col>
              <Col md={3}><Form.Label>Cashback Amount (₹)</Form.Label><Form.Control type="number" name="cashbackAmount" onChange={handleHeaderChange} /></Col>
              
              <Col md={3}><Form.Label>Est. Delivery Date</Form.Label><Form.Control type="date" name="deliveryDate" required onChange={handleHeaderChange} /></Col>
              <Col md={3}><Form.Label>Est. Delivery Time Slot</Form.Label><Form.Control name="deliverySlot" defaultValue="7 - 10 PM" onChange={handleHeaderChange} /></Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0">
          <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center fw-bold">
            2. Product Pricing (Auto-Calculated)
            <Button variant="outline-light" size="sm" onClick={addProductRow}><Plus size={18} /> Add Row</Button>
          </Card.Header>
          <Table responsive bordered className="mb-0 text-center align-middle">
            <thead className="table-secondary small fw-bold text-uppercase">
              <tr>
                <th>Product</th>
                <th style={{width: '80px'}}>Qty</th>
                <th>List Price</th>
                <th className="bg-info bg-opacity-10">List Total</th>
                <th>Buy Price</th>
                <th className="bg-warning bg-opacity-10">Buy Total</th>
                <th>Sell Price</th>
                <th className="bg-primary bg-opacity-10">Sell Total</th>
                <th className="bg-success text-white">Profit</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i}>
                  <td><Form.Control size="sm" name="productName" required onChange={(e) => handleProductChange(i, e)} /></td>
                  <td><Form.Control size="sm" type="number" name="qty" value={p.qty} onChange={(e) => handleProductChange(i, e)} /></td>
                  <td><Form.Control size="sm" type="number" name="listingPrice" onChange={(e) => handleProductChange(i, e)} /></td>
                  <td className="fw-bold">₹{p.listingTotal}</td>
                  <td><Form.Control size="sm" type="number" name="buyingPrice" onChange={(e) => handleProductChange(i, e)} /></td>
                  <td className="fw-bold">₹{p.buyingTotal}</td>
                  <td><Form.Control size="sm" type="number" name="sellingPrice" onChange={(e) => handleProductChange(i, e)} /></td>
                  <td className="fw-bold">₹{p.sellingTotal}</td>
                  <td className="fw-bold text-success">₹{p.netProfit}</td>
                  <td><Button variant="link" className="text-danger p-0" onClick={() => removeProductRow(i)}><Trash2 size={20}/></Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Card.Footer className="text-end bg-white py-3">
            <Button type="submit" variant="success" size="lg" className="px-5 shadow-sm fw-bold"><Save className="me-2"/>Save Full Order</Button>
          </Card.Footer>
        </Card>
      </Form>
    </div>
  );
};

export default Dashboard;