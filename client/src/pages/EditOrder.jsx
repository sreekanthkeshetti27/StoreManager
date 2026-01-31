import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Table, Spinner } from 'react-bootstrap';
import { Plus, Trash2, Save, ArrowLeft, Calculator } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
import api from '../api';

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [orderHeader, setOrderHeader] = useState({
    orderId: '', date: '', platform: 'Amazon', platformAccount: '',
    cardUsed: '', cashbackAmount: 0, deliveryDate: '', deliverySlot: '7 - 10 PM'
  });

  const [products, setProducts] = useState([]);

  // Helper: Calculate all totals for a single row
  const calculateRow = (row) => {
    const q = parseFloat(row.qty) || 0;
    const lp = parseFloat(row.listingPrice) || 0;
    const bp = parseFloat(row.buyingPrice) || 0;
    const sp = parseFloat(row.sellingPrice) || 0;

    return {
      ...row,
      listingTotal: (lp * q).toFixed(2),
      buyingTotal: (bp * q).toFixed(2),
      sellingTotal: (sp * q).toFixed(2),
      netProfit: ((sp - bp) * q).toFixed(2)
    };
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
                const res = await api.get('/api/orders');

        // const res = await axios.get('http://localhost:5000/api/orders');
        const currentOrder = res.data.find(o => o._id === id);
        
        if (currentOrder) {
          setOrderHeader({
            orderId: currentOrder.orderId, date: currentOrder.date,
            platform: currentOrder.platform, platformAccount: currentOrder.platformAccount,
            cardUsed: currentOrder.cardUsed, cashbackAmount: currentOrder.cashbackAmount,
            deliveryDate: currentOrder.deliveryDate, deliverySlot: currentOrder.deliverySlot
          });

          // IMPORTANT: Recalculate every row on load to fill in any missing totals
          const recalculatedProducts = currentOrder.products.map(p => calculateRow(p));
          setProducts(recalculatedProducts);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order", err);
        navigate('/order-logs');
      }
    };
    fetchOrderDetails();
  }, [id, navigate]);

  const handleHeaderChange = (e) => {
    setOrderHeader({ ...orderHeader, [e.target.name]: e.target.value });
  };

  // FIXED: Functional state update to prevent "lagging" calculations
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      // Update the value, then immediately calculate based on the fresh data
      const updatedRow = { ...updatedProducts[index], [name]: value };
      updatedProducts[index] = calculateRow(updatedRow); 
      return updatedProducts;
    });
  };

  const addProductRow = () => {
    const newRow = { 
      productName: '', qty: 1, listingPrice: 0, listingTotal: "0.00", 
      buyingPrice: 0, buyingTotal: "0.00", sellingPrice: 0, sellingTotal: "0.00", netProfit: "0.00" 
    };
    setProducts([...products, newRow]);
  };

  const removeProductRow = (index) => {
    if (products.length > 1) setProducts(products.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sum up the order-wide totals
    const totalListing = products.reduce((acc, p) => acc + parseFloat(p.listingTotal), 0);
    const totalBuying = products.reduce((acc, p) => acc + parseFloat(p.buyingTotal), 0);
    const totalSelling = products.reduce((acc, p) => acc + parseFloat(p.sellingTotal), 0);
    const totalProfit = products.reduce((acc, p) => acc + parseFloat(p.netProfit), 0);

    const updatedOrder = {
      ...orderHeader,
      products: products,
      totalListingPrice: totalListing.toFixed(2),
      totalBuyingPrice: totalBuying.toFixed(2),
      totalSellingPrice: totalSelling.toFixed(2),
      totalOrderProfit: totalProfit.toFixed(2)
    };

    try {
      await api.put(`/api/orders/${id}`, updatedOrder);
      alert("✅ Order Updated!");
      navigate('/order-logs');
    } catch (err) {
      alert("Error updating order");
    }
  };

  if (loading) return <div className="p-5 text-center"><Spinner animation="border" variant="primary" /></div>;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-secondary" className="me-3" onClick={() => navigate('/order-logs')}><ArrowLeft size={18} /></Button>
        <h3 className="mb-0 fw-bold">Edit Order: #{orderHeader.orderId}</h3>
      </div>

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4 shadow-sm border-0 bg-light">
          <Card.Header className="bg-primary text-white fw-bold">Order Details</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={3}><Form.Label className="small fw-bold">Order ID</Form.Label><Form.Control name="orderId" value={orderHeader.orderId} required onChange={handleHeaderChange} /></Col>
              <Col md={2}><Form.Label className="small fw-bold">Platform</Form.Label><Form.Select name="platform" value={orderHeader.platform} onChange={handleHeaderChange}><option>Amazon</option><option>Flipkart</option><option>Other</option></Form.Select></Col>
              <Col md={2}><Form.Label className="small fw-bold">Account</Form.Label><Form.Control name="platformAccount" value={orderHeader.platformAccount} onChange={handleHeaderChange} /></Col>
              <Col md={3}><Form.Label className="small fw-bold">Card Used</Form.Label><Form.Control name="cardUsed" value={orderHeader.cardUsed} onChange={handleHeaderChange} /></Col>
              <Col md={2}><Form.Label className="small fw-bold">Cashback</Form.Label><Form.Control type="number" name="cashbackAmount" value={orderHeader.cashbackAmount} onChange={handleHeaderChange} /></Col>
              <Col md={3}><Form.Label className="small fw-bold">Delivery Date</Form.Label><Form.Control type="date" name="deliveryDate" value={orderHeader.deliveryDate} onChange={handleHeaderChange} /></Col>
              <Col md={3}><Form.Label className="small fw-bold">Time Slot</Form.Label><Form.Control name="deliverySlot" value={orderHeader.deliverySlot} onChange={handleHeaderChange} /></Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0">
          <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center fw-bold">
            <span><Calculator size={18} className="me-2"/>Modify Pricing</span>
            <Button variant="outline-light" size="sm" onClick={addProductRow}><Plus size={16} /> Add Product</Button>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive bordered hover className="mb-0 text-center align-middle">
              <thead className="table-secondary small">
                <tr>
                  <th style={{ minWidth: '200px' }}>Product Name</th>
                  <th style={{ width: '80px' }}>Qty</th>
                  <th>List Price</th>
                  <th className="bg-info bg-opacity-10">List Total</th>
                  <th>Buy Price</th>
                  <th className="bg-warning bg-opacity-10">Buy Total</th>
                  <th>Sell Price</th>
                  <th className="bg-primary bg-opacity-10">Sell Total</th>
                  <th className="bg-success text-white">Profit</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td><Form.Control size="sm" name="productName" value={product.productName} required onChange={(e) => handleProductChange(index, e)} /></td>
                    <td><Form.Control size="sm" type="number" name="qty" value={product.qty} onChange={(e) => handleProductChange(index, e)} /></td>
                    <td><Form.Control size="sm" type="number" name="listingPrice" value={product.listingPrice} onChange={(e) => handleProductChange(index, e)} /></td>
                    <td className="fw-bold">₹{product.listingTotal}</td>
                    <td><Form.Control size="sm" type="number" name="buyingPrice" value={product.buyingPrice} onChange={(e) => handleProductChange(index, e)} /></td>
                    <td className="fw-bold">₹{product.buyingTotal}</td>
                    <td><Form.Control size="sm" type="number" name="sellingPrice" value={product.sellingPrice} onChange={(e) => handleProductChange(index, e)} /></td>
                    <td className="fw-bold text-primary">₹{product.sellingTotal}</td>
                    <td className="fw-bold text-success" style={{backgroundColor: '#f0fff4'}}>₹{product.netProfit}</td>
                    <td><Button variant="link" className="text-danger p-0" onClick={() => removeProductRow(index)}><Trash2 size={18} /></Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="p-3 bg-light d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate('/order-logs')}>Cancel</Button>
              <Button type="submit" variant="primary" className="fw-bold px-4"><Save size={18} className="me-2" /> Save Changes</Button>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};

export default EditOrder;