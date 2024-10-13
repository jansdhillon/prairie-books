import * as React from 'react';

interface ShippingConfirmationTemplateProps {
  name: string;
  email: string;
  trackingNumber: string;
  orderId: string;
  shippingProvider: string;
}

export const ShippingConfirmationTemplate: React.FC<Readonly<ShippingConfirmationTemplateProps>> = ({
  name,
  email,
  trackingNumber,
  orderId,
  shippingProvider,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <h1 style={{ color: '#4a5568', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>Shipping Confirmation</h1>
    <p>Hello {name},</p>
    <p>Your order has been shipped! Here are the details:</p>
    <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Shipping Provider:</strong> {shippingProvider}</p>
      <p><strong>Tracking Number:</strong> {trackingNumber}</p>
    </div>
    <p>You can track your package using the tracking number provided.</p>
    <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '0.9em', color: '#718096' }}>
      <p>This email was sent to {email} for your order at Kathrin's Books.</p>
    </div>
  </div>
);
