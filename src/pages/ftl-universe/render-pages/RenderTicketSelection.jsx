import React, { useState } from "react";
import "../pages/RegistrationPages.css";
import { formatPrice } from "../../../utils/PriceUtils";

export const RenderTicketSelection = ({
  timeLeft,
  isSelecting,
  selectedTicket,
  handleSelectTicket,
  ticketEvent,
}) => {
  // Filter tickets based on status
  const filteredTickets = ticketEvent?.filter(ticket => ticket.status !== -1) || [];

  return (
    <>
      {/* Hero Section with Countdown */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">
            <img
              src="/images/Universe Logo - Transparent.png"
              alt="FTL Universe Logo"
            />
          </div>
          <div className="hero-text">
            <h1 className="hero-title">FTL UNIVERSE</h1>
            <p className="hero-subtitle">The Ultimate Fitness Experience</p>
            <p className="hero-description">
              Join us for an extraordinary journey where fitness meets
              innovation. Don't miss out on this once-in-a-lifetime event.
            </p>
          </div>
          {/* Countdown Timer */}
          <div className="countdown-section">
            <h2 className="countdown-title">Event Starts In</h2>
            <div className="countdown-timer">
              <div className="countdown-item">
                <div className="countdown-number">{timeLeft.days}</div>
                <div className="countdown-label">Days</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <div className="countdown-number">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <div className="countdown-label">Hours</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <div className="countdown-number">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <div className="countdown-label">Minutes</div>
              </div>
              <div className="countdown-separator">:</div>
              <div className="countdown-item">
                <div className="countdown-number">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <div className="countdown-label">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Ticket Selection Section */}
      <div className="ticket-section">
        <div className="ticket-header">
          <h2 className="ticket-section-title">Choose Your Ticket</h2>
          <p className="ticket-section-subtitle">
            Select the perfect ticket for your FTL Universe experience
          </p>
        </div>
        <div className="ticket-grid">
          {filteredTickets?.slice(0, 3).map((tic) => (
            <div
              className={`ticket-card-new ${
                selectedTicket?.uuid === tic?.uuid ? "ticket-card-selected" : ""
              } ${tic?.status === 0 ? "ticket-card-locked" : ""}`}
              key={tic?.uuid}
            >
              <div className="ticket-card-header">
                <div className="ticket-type">{tic?.title}</div>
                {tic?.status === 1 && ( //ubah jadi 0
                  <div className="ticket-badge locked">
                    <span className="lock-icon">🔒</span>
                    Locked
                  </div>
                )}
                {tic?.status === 0 && ( //ubah jadi 1
                  <div className="ticket-badge">Available</div>
                )}
              </div>
              {tic?.description && (
                <div className="ticket-description">
                  {tic.description}
                </div>
              )}
              <div className="ticket-dates">
                <div className="date-range">
                  <span className="date-label">Available:</span>
                  <span className="date-value">
                    {new Date(tic?.start_date).toLocaleDateString()} - {new Date(tic?.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {/* <div className="ticket-price-section">
                <div className="price-label">Starting from</div>
                <div className="price-amount">
                  <span className="currency">Rp</span>
                  <span className="amount">
                    {formatPrice(tic?.package_price[0].price)}
                  </span>
                  <span className="price-period">/class</span>
                </div>
              </div> */}
              <button
                // className={`ticket-select-btn ${
                //   isSelecting && selectedTicket?.uuid === tic?.uuid
                //     ? "ticket-select-btn-loading"
                //     : ""
                // } ${tic?.status === 0 ? "ticket-select-btn-disabled" : ""}`}
                // onClick={() => tic?.status === 1 && handleSelectTicket(tic)}
                // disabled={isSelecting || tic?.status === 0}

                className={`ticket-select-btn ${
                  isSelecting && selectedTicket?.uuid === tic?.uuid
                    ? "ticket-select-btn-loading"
                    : ""
                } ${tic?.status === 0 ? "ticket-select-btn-disabled" : ""}`}
                onClick={() => tic?.status === 0 && handleSelectTicket(tic)}
                disabled={isSelecting || tic?.status === -1}
              >
                {isSelecting && selectedTicket?.uuid === tic?.uuid
                  ? "Selecting..."
                  : tic?.status === 1 //ubah jadi 0
                  ? "Locked"
                  : "Select Ticket"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
