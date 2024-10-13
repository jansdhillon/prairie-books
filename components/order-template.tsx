import * as React from 'react';

interface OrderConfirmationTemplateProps {
  name: string;
  email: string;
  orderId: string;
  orderSummary: string;
  totalAmount: string;
}

export const OrderConfirmationTemplate: React.FC<Readonly<OrderConfirmationTemplateProps>> = ({
  name,
  email,
  orderId,
  orderSummary,
  totalAmount,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <h1 style={{ color: '#4a5568', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Order Confirmation</h1>
    <p>Hello {name},</p>
    <p>Thank you for your purchase! We have received your order. Here are the details:</p>
    <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Order Summary:</strong></p>
      <p>{orderSummary}</p>
      <p><strong>Total Amount:</strong> {totalAmount}</p>
    </div>
    <p>You will receive another email when your items have been shipped.</p>
    <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '0.9em', color: '#718096' }}>
      <p>This email was sent to {email} for your order at Kathrin's Books.</p>
    </div>
  </div>
);
