import React from 'react';
import Carousel from './Carousel';
import AuctionCarousel from './AuctionCarousel';
import '.././src/css/home.css'
const Home: React.FC = () => {

  return(
    <div className="min-h-screen bg-gray-50 flex flex-col w-full py-4 px-0">
      <div className="w-full bg-white rounded-none shadow-none p-0 animate-fadeIn">
        <Carousel/>
      </div>
      <div className="w-full flex flex-col items-center mt-4">
        <h2 className="font-extrabold text-3xl text-center mb-1 tracking-tight text-gray-800">Live Auctions</h2>
        <div className="w-16 h-1 bg-green-500 rounded-full mb-2"></div>
        <div className="w-full bg-white rounded-none shadow-none p-0 animate-fadeIn">
          <AuctionCarousel />
        </div>
      </div>
    </div>
  )
}
export default Home;
