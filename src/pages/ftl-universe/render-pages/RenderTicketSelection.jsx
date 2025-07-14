import React, { useState, useEffect } from "react";
import "../pages/RegistrationPages.css";
import { FaLock } from "react-icons/fa";

const generalSaleId = import.meta.env.VITE_GENERAL_SALE_TYPE;
const memberOnlyId = import.meta.env.VITE_MEMBER_ONLY_TYPE;

export const RenderTicketSelection = ({
  isSelecting,
  selectedTicket,
  handleSelectTicket,
  ticketEvent ,
  handlePreviousStep,
}) => {

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Function to calculate time left for a specific ticket
  const calculateTimeLeft = (endDate) => {
    const end = new Date(endDate);
    const now = currentTime;
    const difference = end - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  };


  return (
    <div className="terms-bg">
      {/* Header Section */}
      <div className="header-row">
        <div className="header-left">
          <h1 className="title-header">READY TO JOIN FTL UNIVERSE?</h1>
          <p className="desc-header">
            Begin your journey sooner to unlock the best available offers — giving you peace of mind before the FTL Universe unfolds.
          </p>
        </div>
        <img
          src="/images/Universe Logo - Transparent.png"
          alt="FTL Universe Logo"
          className="logo-header"
        />
      </div>
      <div className="divider-header" />

      {/* Ticket Cards Grid */}
      <div className="ticket-landing-grid">
        {ticketEvent
          .filter(item => item?.status !== -1) // Filter out tickets with status -1
          .map((item, index) => {
            const timeLeft = calculateTimeLeft(item?.end_date);
            const isLocked = item?.status === 1; //ganti jadi 0
            const isAvailable = item?.status === 0; //ganti jadi 1
            
            return (
              <div className="ticket-landing-card" key={item?.uuid}>
                {!isLocked && (
                  <div className="ticket-landing-countdown-badge">
                    <div className="ticket-landing-countdown-label">Limited Promo Ends In:</div>
                    <div className="ticket-landing-countdown-timer">
                      <div className="ticket-landing-countdown-item">
                        <div className="ticket-landing-countdown-number">{timeLeft.days}</div>
                        <div className="ticket-landing-countdown-unit">Days</div>
                      </div>
                      <div className="ticket-landing-countdown-item">
                        <div className="ticket-landing-countdown-number">{timeLeft.hours}</div>
                        <div className="ticket-landing-countdown-unit">Hours</div>
                      </div>
                      <div className="ticket-landing-countdown-item">
                        <div className="ticket-landing-countdown-number">{timeLeft.minutes}</div>
                        <div className="ticket-landing-countdown-unit">Minutes</div>
                      </div>
                      <div className="ticket-landing-countdown-item">
                        <div className="ticket-landing-countdown-number">{timeLeft.seconds}</div>
                        <div className="ticket-landing-countdown-unit">Seconds</div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="ticket-landing-type-badge">{item.uuid == generalSaleId ? 'General Sale' : 'Early Bid'}</div>
                <div className="ticket-landing-card-title">{item.uuid == generalSaleId ? 'NORMAL PRICE' : item.uuid == memberOnlyId ? 'MEMBER ONLY' : 'NON - MEMBER'}</div>
                {isLocked ? (
                  <button className="ticket-landing-btn disabled" disabled>
                    <span className="ticket-landing-btn-lock"><FaLock /></span> Buy Ticket
                  </button>
                ) : (
                  <button
                    className="ticket-landing-btn"
                    onClick={() => handleSelectTicket(item)}
                  >
                    Buy Ticket
                  </button>
                )}
              </div>
            );
          })}
      </div>
      <div className="terms-btn-row">
        <button
          className="terms-btn terms-btn-prev"
          onClick={handlePreviousStep}
        >
          Back
        </button>
        {/* <button className="terms-btn terms-btn-next" onClick={handleNextStep}>
          Next
        </button> */}
      </div>
    </div>
  );
};
