import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import '../src/css/carousel.css'; // Import the custom CSS

interface Slide {
  id: number;
  content: JSX.Element;
}

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // To control auto-slide when user hovers
  const navigate = useNavigate();

  // Define your slides with custom components
  const slides: Slide[] = [
    {
      id: 1,
      content: (
        <div className="flex flex-col items-center justify-center w-full h-full gap-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">To see the weather updates now</h3>
          <button className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold shadow hover:bg-green-600 transition-all duration-200" onClick={() => navigate('/weather')}>
            Click Here
          </button>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="flex items-center justify-center w-full h-full">
          <img src='https://static.pib.gov.in/WriteReadData/userfiles/image/image002CIE6.jpg' className="max-h-40 md:max-h-52 rounded-lg object-contain shadow" alt="slide 2" />
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="flex items-center justify-center w-full h-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">To see the Government Schemes now</h3>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold shadow hover:bg-green-600 transition-all duration-200"
            onClick={() => window.open('https://agriwelfare.gov.in/en/Major', '_blank', 'noopener,noreferrer')}
          >
            Click Here
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        handleNext();
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isHovered, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true,
  });

  return (
    <div
      className="relative w-full h-56 md:h-64 bg-white rounded-xl shadow-md flex flex-col justify-center items-center overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...handlers}
    >
      <div className="w-full h-full flex items-center justify-center transition-all duration-500">
        {React.cloneElement(slides[currentIndex].content, {
          className: 'flex flex-col items-center justify-center w-full h-full',
        })}
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full border-2 border-green-500 transition-all duration-200 focus:outline-none ${index === currentIndex ? 'bg-green-500 scale-110 shadow' : 'bg-white hover:bg-green-100'}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      {/* Navigation arrows (optional, uncomment if needed) */}
      {/*
      <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-100 rounded-full p-2 shadow transition-all duration-200">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-green-100 rounded-full p-2 shadow transition-all duration-200">
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
      */}
    </div>
  );
};

export default Carousel;
