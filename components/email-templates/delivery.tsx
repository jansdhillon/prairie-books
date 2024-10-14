import * as React from 'react';

interface DeliveryConfirmationTemplateProps {
  orderId: string;
}

export const DeliveryConfirmationTemplate: React.FC<DeliveryConfirmationTemplateProps> = ({
  orderId,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <h1 style={{ color: '#4a5568', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
      Delivery Confirmation
    </h1>
    <p>Hello,</p>
    <p>We are happy to inform you that your order has been delivered.</p>
    <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
      <p><strong>Order ID:</strong> {orderId}</p>
    </div>
    <p>Thank you for shopping with us! We hope you enjoy your purchase.</p>
    <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '0.9em', color: '#718096' }}>
      <p>This email was sent for your order at Kathrin's Books.</p>
    </div>
  </div>
);
