import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge } from 'react-bootstrap';
import { Wallet, Landmark, Hourglass, TrendingUp } from 'lucide-react';
import axios from 'axios';

const PaymentLogs = () => {
  const [stats, setStats] = useState({
    totalInvested: 0,
    totalReceived: 0,
    pendingBalance: 0,
    totalProfit: 0
  });
  const [paidOrders, setPaidOrders] = useState([]);

  useEffect(() => {
    fetchPaymentStats();
  }, []);

  const fetchPaymentStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      const allOrders = res.data;

      let invested = 0;
      let received = 0;
      let profit = 0;

      allOrders.forEach(order => {
        // Calculate total buying price for this order (Investment)
        const orderInvestment = order.products.reduce((acc, p) => acc + (p.buyingPrice * p.qty), 0);
        invested += orderInvestment;

        // Total Profit
        profit += order.totalOrderProfit;

        // If paid, add to received amount
        if (order.paymentStatus.isReceived) {
          received += order.paymentStatus.amountReceived;
        }
      });

      setStats({
        totalInvested: invested.toFixed(2),
        totalReceived: received.toFixed(2),
        pendingBalance: (invested - received).toFixed(2),
        totalProfit: profit.toFixed(2)
      });

      // Filter only orders that are marked as paid for the transaction list
      setPaidOrders(allOrders.filter(o => o.paymentStatus.isReceived));

    } catch (err) {
      console.error("Error fetching payment stats", err);
    }
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-4">Financial Summary</h3>

      {/* --- STATS CARDS --- */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="p-3 bg-white bg-opacity-25 rounded-circle me-3">
                <Wallet size={30} />
              </div>
              <div>
                <small className="opacity-75">Total Invested (Cards)</small>
                <h4 className="mb-0">₹{stats.totalInvested}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="p-3 bg-white bg-opacity-25 rounded-circle me-3">
                <Landmark size={30} />
              </div>
              <div>
                <small className="opacity-75">Received</small>
                <h4 className="mb-0">₹{stats.totalReceived}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm bg-warning text-dark">
            <Card.Body className="d-flex align-items-center">
              <div className="p-3 bg-dark bg-opacity-10 rounded-circle me-3">
                <Hourglass size={30} />
              </div>
              <div>
                <small className="opacity-75">Pending Balance</small>
                <h4 className="mb-0">₹{stats.pendingBalance}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="border-0 shadow-sm bg-dark text-white">
            <Card.Body className="d-flex align-items-center">
              <div className="p-3 bg-white bg-opacity-25 rounded-circle me-3">
                <TrendingUp size={30} />
              </div>
              <div>
                <small className="opacity-75">Net Profit</small>
                <h4 className="mb-0 text-info">₹{stats.totalProfit}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- RECENT TRANSACTIONS TABLE --- */}
      <h5 className="mb-3">Recent Received Payments</h5>
      <Card className="shadow-sm">
        <Table responsive hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th>Received Date</th>
              <th>Order ID</th>
              <th>Method</th>
              <th className="text-end">Amount Received</th>
            </tr>
          </thead>
          <tbody>
            {paidOrders.length > 0 ? (
              paidOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.paymentStatus.receivedDate}</td>
                  <td>{order.orderId}</td>
                  <td><Badge bg="secondary">{order.paymentStatus.paymentMethod}</Badge></td>
                  <td className="text-end fw-bold text-success">₹{order.paymentStatus.amountReceived}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">No payment records found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default PaymentLogs;