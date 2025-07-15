import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../src/configs/firebase";
import { getAuth } from "firebase/auth";
import Card from "./Card";
import Loader from "../shared/loader";
import search from "../../src/assets/shared/search.svg";
import cross from "../../src/assets/shared/cross.svg";
import { useNavigate } from "react-router-dom";

interface Auction {
  id: string;
  auctionEndDate: string;
  auctionStartDate: string;
  imageUrl: string;
  itemName: string;
  location: string;
  pricePerUnit: number;
  quantity: number;
  sellerEmail: string;
  sellerName: string | null;
  unit: string;
  auctionId: string;
}

const AuctionPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null); // State to store user role
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const auctionRef = collection(db, "auctions");
        const auctionSnapshot = await getDocs(auctionRef);
        const auctionList = auctionSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            location: typeof data.location === "string" ? data.location : "",
          };
        }) as Auction[];

        const now = new Date();
        const filteredAuctions = auctionList.filter((auction) => {
          const endDate = new Date(auction.auctionEndDate);
          return endDate >= now;
        });

        setAuctions(filteredAuctions);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            console.log(userData)
            setUserRole(userData.role || null); // Assuming userData has a `role` field
          } else {
            console.error("No user data found.");
          }
        } else {
          console.error("No user is currently logged in.");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchAuctions();
    fetchUserRole();
  }, []);

  const filteredAuctions = auctions.filter((auction) => {
    const searchLower = searchTerm.toLowerCase();
    const locationLower = auction.location.toLowerCase();
    const itemNameLower = auction.itemName.toLowerCase();

    return (
      locationLower.includes(searchLower) || itemNameLower.includes(searchLower)
    );
  });

  const handleAdd = () => {
    navigate('/add');
  };

  if (loading) {
    return <Loader/>;

  }

  return (
    <div>
      <div className="relative flex items-center justify-center m-4 mb-6">
        <input
          type="text"
          placeholder="Search by location or item name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 pl-12 pr-10 border border-gray-200 rounded-full w-full max-w-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
        />
        <div className="absolute left-4 flex items-center justify-center bg-gray-100 rounded-full p-2 pointer-events-none">
          <img src={search} alt="search" className="w-5 h-5 opacity-70" />
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-4 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors duration-150"
            tabIndex={-1}
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      {userRole !== "buyer" && ( // Conditionally render button
        <div className="w-full flex justify-end px-5">
          <button
            onClick={handleAdd}
            className="w-fit flex flex-row items-center gap-2 p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-lg"
          >
            <p>Add Auction</p>
            <img src={cross} alt="cross" className="invert" />
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 mb-[10%]">
        {filteredAuctions.length > 0 ? (
          filteredAuctions.map((auction) => (
            <div key={auction.id} className="transition-all duration-200 transform hover:scale-105 hover:shadow-xl">
              <Card auction={auction} searchLocation={searchTerm} />
            </div>
          ))
        ) : (
          <div>No active auctions available.</div>
        )}
      </div>
    </div>
  );
};

export default AuctionPage;
