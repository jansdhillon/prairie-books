import * as React from 'react';

interface NewsletterTemplateProps {
  content: string;
}

export const NewsletterTemplate: React.FC<NewsletterTemplateProps> = ({
  content,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, color: '#333' }}>
    <h1 style={{ color: '#4a5568', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
      Latest News from Kathrin's Books
    </h1>
    <p>Hello,</p>
    <p>We're excited to share the latest news and updates with you:</p>
    <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
      <p>{content}</p>
    </div>
    <p>Thank you for being a part of our community. We hope you enjoy the updates!</p>
    <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '0.9em', color: '#718096' }}>
      <p>This email was sent because you're subscribed to our newsletter.</p>
    </div>
  </div>
);
