import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import locationimg from "../../src/assets/shared/location.svg";

interface AuctionCardProps {
  auction: {
    itemName: string;
    quantity: number;
    pricePerUnit: number;
    auctionEndDate: string;
    imageUrl: string;
    auctionId: string;
    location: string;
    unit: string;
  };
  searchLocation: string; 
}

const Card: React.FC<AuctionCardProps> = ({ auction, searchLocation }) => {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);

  // Function to highlight the searched location term
  const highlightLocation = (location: string, searchTerm: string) => {
    if (!searchTerm) return location;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    const parts = location.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="backdrop-blur-md bg-white/70 border min-w-[320px] max-w-sm rounded-2xl overflow-hidden shadow-lg transition-transform duration-200 hover:scale-102 hover:shadow-2xl cursor-pointer flex flex-col"
      onClick={() =>
        navigate("/bid", {
          state: { auction },
        })
      }
    >
      {/* Image Section with Skeleton */}
      <div className="relative w-full h-40 bg-gray-100 flex items-center justify-center">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 rounded-t-2xl" />
        )}
        <img
          src={auction.imageUrl}
          alt={`Image of ${auction.itemName}`}
          className={`w-full h-full object-cover rounded-t-2xl transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow font-semibold">#{auction.auctionId}</span>
      </div>

      {/* Auction Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{auction.itemName}</h3>
        <div className="flex items-center gap-2 text-gray-700">
          <span className="text-green-600 font-semibold text-base">₹{auction.pricePerUnit}</span>
          <span className="text-xs text-gray-500">/{auction.unit ? auction.unit : "QT"}</span>
          <span className="ml-auto text-xs text-gray-500">Qty: {auction.quantity}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <img src={locationimg} alt="Location icon" className="w-4 h-4" />
          <span className="truncate">{highlightLocation(auction.location, searchLocation)}</span>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>Ends: {new Date(auction.auctionEndDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
