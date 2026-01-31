import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Table, Spinner } from 'react-bootstrap';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditOrder = () => {
  const { id } = useParams(); // Get the order ID from the URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 1. State structure
  const [orderHeader, setOrderHeader] = useState({
    orderId: '',
    date: '',
    time: '',
    platform: '',
    platformAccount: '',
    cardUsed: '',
    cashback: 0,
    deliveryDate: '',
    deliverySlot: ''
  });

  const [products, setProducts] = useState([]);

  // 2. Fetch existing order data on load
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders`);
        // Filter the specific order from the list (or you can create a specific GET by ID route)
        const currentOrder = res.data.find(o => o._id === id);
        
        if (currentOrder) {
          setOrderHeader({
            orderId: currentOrder.orderId,
            date: currentOrder.date,
            time: currentOrder.time,
            platform: currentOrder.platform,
            platformAccount: currentOrder.platformAccount,
            cardUsed: currentOrder.cardUsed,
            cashback: currentOrder.cashback,
            deliveryDate: currentOrder.deliveryDate,
            deliverySlot: currentOrder.deliverySlot
          });
          setProducts(currentOrder.products);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order", err);
        alert("Could not load order details");
        navigate('/order-logs');
      }
    };
    fetchOrderDetails();
  }, [id, navigate]);

  // 3. Handle Form Changes
  const handleHeaderChange = (e) => {
    setOrderHeader({ ...orderHeader, [e.target.name]: e.target.value });
  };

  const handleProductChange = (index, e) => {
    const newProducts = [...products];
    newProducts[index][e.target.name] = e.target.value;
    setProducts(newProducts);
  };

  const addProductRow = () => {
    setProducts([...products, { productName: '', qty: 1, listingPrice: 0, buyingPrice: 0, sellingPrice: 0 }]);
  };

  const removeProductRow = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  // 4. Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    let totalOrderProfit = 0;
    const processedProducts = products.map(p => {
      const netProfit = (parseFloat(p.sellingPrice) - parseFloat(p.buyingPrice)) * parseInt(p.qty);
      totalOrderProfit += netProfit;
      return { ...p, netProfit };
    });

    const updatedOrder = {
      ...orderHeader,
      products: processedProducts,
      totalOrderProfit: totalOrderProfit
    };

    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, updatedOrder);
      alert("Order updated successfully!");
      navigate('/order-logs'); // Go back to logs
    } catch (err) {
      console.error(err);
      alert("Error updating order");
    }
  };

  if (loading) return <div className="p-5 text-center"><Spinner animation="border" /></div>;

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center mb-4">
        <Button variant="outline-secondary" className="me-3" onClick={() => navigate('/order-logs')}>
          <ArrowLeft size={18} />
        </Button>
        <h3 className="mb-0">Edit Order: {orderHeader.orderId}</h3>
      </div>

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4 shadow-sm border-0">
          <Card.Header className="bg-primary text-white">Order Header Details</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label>Order ID</Form.Label>
                <Form.Control name="orderId" value={orderHeader.orderId} required onChange={handleHeaderChange} />
              </Col>
              <Col md={3}>
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" name="date" value={orderHeader.date} onChange={handleHeaderChange} />
              </Col>
              <Col md={2}>
                <Form.Label>Time</Form.Label>
                <Form.Control type="time" name="time" value={orderHeader.time} onChange={handleHeaderChange} />
              </Col>
              <Col md={2}>
                <Form.Label>Platform</Form.Label>
                <Form.Select name="platform" value={orderHeader.platform} onChange={handleHeaderChange}>
                  <option>Amazon</option>
                  <option>Flipkart</option>
                  <option>Blinkit</option>
                  <option>Other</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label>Account</Form.Label>
                <Form.Control name="platformAccount" value={orderHeader.platformAccount} onChange={handleHeaderChange} />
              </Col>
              <Col md={4}>
                <Form.Label>Card/Cashback Used</Form.Label>
                <Form.Control name="cardUsed" value={orderHeader.cardUsed} onChange={handleHeaderChange} />
              </Col>
              <Col md={4}>
                <Form.Label>Delivery Date</Form.Label>
                <Form.Control type="date" name="deliveryDate" value={orderHeader.deliveryDate} onChange={handleHeaderChange} />
              </Col>
              <Col md={4}>
                <Form.Label>Delivery Slot</Form.Label>
                <Form.Control name="deliverySlot" value={orderHeader.deliverySlot} onChange={handleHeaderChange} />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0">
          <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
            Modify Products
            <Button variant="outline-light" size="sm" onClick={addProductRow}>
              <Plus size={16} /> Add Product
            </Button>
          </Card.Header>
          <Card.Body>
            <Table responsive bordered hover>
              <thead className="table-light">
                <tr>
                  <th>Product Name</th>
                  <th style={{ width: '100px' }}>Qty</th>
                  <th>Listing Price</th>
                  <th>Buying Price</th>
                  <th>Selling Price</th>
                  <th style={{ width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control 
                        name="productName" 
                        value={product.productName} 
                        required 
                        onChange={(e) => handleProductChange(index, e)} 
                      />
                    </td>
                    <td>
                      <Form.Control 
                        type="number" 
                        name="qty" 
                        value={product.qty} 
                        onChange={(e) => handleProductChange(index, e)} 
                      />
                    </td>
                    <td>
                      <Form.Control 
                        type="number" 
                        name="listingPrice" 
                        value={product.listingPrice} 
                        onChange={(e) => handleProductChange(index, e)} 
                      />
                    </td>
                    <td>
                      <Form.Control 
                        type="number" 
                        name="buyingPrice" 
                        value={product.buyingPrice} 
                        onChange={(e) => handleProductChange(index, e)} 
                      />
                    </td>
                    <td>
                      <Form.Control 
                        type="number" 
                        name="sellingPrice" 
                        value={product.sellingPrice} 
                        onChange={(e) => handleProductChange(index, e)} 
                      />
                    </td>
                    <td>
                      {products.length > 1 && (
                        <Button variant="outline-danger" size="sm" onClick={() => removeProductRow(index)}>
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate('/order-logs')}>Cancel</Button>
              <Button type="submit" variant="primary" className="px-4">
                <Save size={18} className="me-2" /> Save Changes
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};

export default EditOrder;