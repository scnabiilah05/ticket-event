import React from "react";
import "../pages/RegistrationPages.css";

export const RenderTicketSelection = ({
  timeLeft = { days: 14, hours: 12, minutes: 25, seconds: 42 },
  isSelecting,
  selectedTicket,
  handleSelectTicket,
  ticketEvent = [],
}) => {
  // Ambil 3 jenis ticket: member, non-member, normal
  const memberTicket = ticketEvent[0] || {};
  const nonMemberTicket = ticketEvent[1] || {};
  const normalTicket = ticketEvent[2] || {};

  return (
    <div className="ticket-landing-bg">
      {/* Header Section */}
      <div className="ticket-landing-header-row">
        <div className="ticket-landing-header-left">
          <h1 className="ticket-landing-title">READY TO JOIN FTL UNIVERSE?</h1>
          <p className="ticket-landing-subtitle">
            Begin your journey sooner to unlock the best available offers — giving you peace of mind before the FTL Universe unfolds.
          </p>
        </div>
        <img
          src="/images/Universe Logo - Transparent.png"
          alt="FTL Universe Logo"
          className="ticket-landing-logo"
        />
      </div>
      <div className="ticket-landing-divider" />

      {/* Ticket Cards Grid */}
      <div className="ticket-landing-grid">
        {/* Member Only */}
        <div className="ticket-landing-card">
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
          <div className="ticket-landing-type-badge early">Early Bird</div>
          <div className="ticket-landing-card-title">MEMBER ONLY</div>
          <button
            className="ticket-landing-btn"
            onClick={() => handleSelectTicket(memberTicket)}
          >
            Buy Ticket
          </button>
        </div>
        {/* Non Member */}
        <div className="ticket-landing-card">
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
          <div className="ticket-landing-type-badge early">Early Bird</div>
          <div className="ticket-landing-card-title">NON - MEMBER</div>
          <button
            className="ticket-landing-btn"
            onClick={() => handleSelectTicket(nonMemberTicket)}
          >
            Buy Ticket
          </button>
        </div>
        {/* Normal Price */}
        <div className="ticket-landing-card">
          <div className="ticket-landing-type-badge general">General Sale</div>
          <div className="ticket-landing-card-title">NORMAL PRICE</div>
          <button className="ticket-landing-btn disabled" disabled>
            <span className="ticket-landing-btn-lock">🔒</span> Buy Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
