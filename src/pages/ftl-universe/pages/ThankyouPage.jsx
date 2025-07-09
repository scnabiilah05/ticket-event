import React from 'react';
import './ThankyouPage.css';

const ThankyouPage = () => {
  return (
    <div className="thankyou-bg">
      <img
        src="/images/Universe Logo - Transparent.png"
        alt="FTL Universe Logo"
        className="thankyou-logo"
      />
      <h1 className="thankyou-title">Thank You</h1>
      <div className="thankyou-message">
        <span>Your <b>confirmation</b> has been <b>sent to you via e-mail</b>. </span>
        <span>if you have any issues or questions, please contact center on <b>whatsapp at 0818687858</b></span>
      </div>
    </div>
  );
};

export default ThankyouPage;