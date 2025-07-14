import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import './EventDetailPage.css';
import { FiChevronLeft } from 'react-icons/fi';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detailEvent, setDetailEvent] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getDetailEvent = async () => {
    setIsLoading({ ...isLoading, events: true });
    try {
      const response = await axios.get(`tiket_event/get_event/${id}`);
      console.log("Response", response.data.data);
      setDetailEvent(response.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading({ ...isLoading, events: false });
    }
  };

  useEffect(() => {
    getDetailEvent();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const images = Array.isArray(detailEvent.image)
    ? detailEvent.image
    : [];

  const settings = {
    centerMode: true,
    centerPadding: "120px", // atur sesuai lebar potongan yang diinginkan
    slidesToShow: 1,
    arrows: true,
    dots: true,
    infinite: images.length > 1,
    speed: 500,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          centerPadding: "40px",
        }
      },
      {
        breakpoint: 600,
        settings: {
          centerPadding: "0px",
        }
      }
    ]
  };

  return (
    <div className="event-detail-container">
      <button 
        onClick={handleBack}
        className="back-button"
      >
        <FiChevronLeft /> Back to home
      </button>

      <div className="event-detail-content">
        <div>
          <h2 className="event-detail-title">{detailEvent?.event_name || detailEvent?.title}</h2>
          <h5 className="event-detail-subtitle">{detailEvent?.subtittle}</h5>
          <p className="event-detail-description">{detailEvent?.description}</p>
        </div>
        
        <div className='carousel-container'>
          {images.length > 0 ? (
            <Slider {...settings}>
              {images.map((img, idx) => (
                <div key={idx}>
                  <img
                    src={img}
                    alt={`Event ${idx + 1}`}
                    className="carousel-image"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="no-image-placeholder">
              <p>No images available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
