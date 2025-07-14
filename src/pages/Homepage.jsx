import axios from "axios";
import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";


function Homepage() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState(0);
  const [isLoading, setIsLoading] = useState({
    events: true,
  });

  const getEvents = async () => {
    setIsLoading({ ...isLoading, events: true });
    try {
      const params = {
        status: status,
      };

      const response = await axios.get("tiket_event/get_event", { params });
      console.log("Response", response.data.data);
      setEvents(response.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading({ ...isLoading, events: false });
    }
  };

  useEffect(() => {
    getEvents();
  }, [status]);

  return (
    <div>
      {/* Header Section */}
      <div className="homepage-header">
        <h1 className="homepage-header-title"> FTL EVENTS </h1>
        <p className="homepage-header-desc">
          Fun and unforgettable experiences that inspire and to elevate your fitness journey.
        </p>
        <div className="homepage-header-btn-group">
          <button
            onClick={() => setStatus(1)}
            className={`homepage-header-btn${status === 1 ? ' active' : ''}`}
          >
            UPCOMING
          </button>
          <button
            onClick={() => setStatus(-1)}
            className={`homepage-header-btn${status === -1 ? ' active' : ''}`}
          >
            PAST
          </button>
          <button
            onClick={() => setStatus(0)}
            className={`homepage-header-btn${status === 0 ? ' active' : ''}`}
          >
            ALL
          </button>
        </div>
      </div>
      {/* End Header Section */}
      
      {/* Event List Section */}
      <div className="event-list-container">
        {isLoading.events ? (
          <div className="loading">Loading events...</div>
        ) : (
          <div className="event-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
      {/* End Event List Section */}
    </div>
  );
}

export default Homepage;
