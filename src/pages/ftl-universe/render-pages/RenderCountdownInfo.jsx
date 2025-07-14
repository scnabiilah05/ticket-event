import React from 'react';

export const RenderCountdownInfo = ({
  timeLeft = { days: 14, hours: 12, minutes: 25, seconds: 42 },
  onSeeGallery,
  onBuyTicket,
  eventDate = '13 SEPTEMBER 2025',
  locations = ['MULTI PURPOSE HALL', 'AGORA MALL', 'JAKARTA'],
  handleNextStep,
}) => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-logo">
          <img src="/images/Universe Logo - Transparent.png" alt="FTL Universe Logo" />
        </div>
        <div className="hero-text">
          <div className="hero-title">{eventDate}</div>
          <div className="hero-location-row">
            <span>{locations[0]}</span>
            <span className="hero-location-sep">|</span>
            <span>{locations[1]}</span>
            <span className="hero-location-sep">|</span>
            <span>{locations[2]}</span>
          </div>
        </div>
        <div className="hero-btn-row">
          <button className="hero-btn hero-btn-gallery" onClick={onSeeGallery}>See Gallery</button>
          <button className="hero-btn hero-btn-ticket" onClick={handleNextStep}>Buy Ticket</button>
        </div>
        <div className="countdown-section">
          <div className="countdown-title">COUNTDOWN TO <b>FTL UNIVERSE 2025</b></div>
          <div className="countdown-timer">
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.days}</div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.hours}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.minutes}</div>
              <div className="countdown-label">Minutes</div>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.seconds}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
