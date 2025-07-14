import React from "react";
import { format } from "date-fns";

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, "HH:mm");
  };

  return (
    <div className="event-card">
      <div className="event-card-image">
        <img src={event?.cover} alt={event?.event_name} />
      </div>
      <div className="event-card-content">
        <h3 className="event-card-title">{event?.event_name}</h3>
        <p className="event-card-subtitle">{event?.subtittle}</p>
        <p className="event-card-description">{event?.description}</p>
        {/* <div className="event-card-details">
          <div className="event-card-detail-item">
            <i className="fas fa-calendar"></i>
            <span>{formatDate(event?.event_date)}</span>
          </div>
          <div className="event-card-detail-item">
            <i className="fas fa-clock"></i>
            <span>{formatTime(event?.event_date)} WIB</span>
          </div>
          <div className="event-card-detail-item">
            <i className="fas fa-map-marker-alt"></i>
            <span>{event?.subtittle}</span>
          </div>
        </div> */}
        <div className="event-card-footer">
          <a href={`/${event?.id}`} className="event-card-button">
            Details <i className="bi bi-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
