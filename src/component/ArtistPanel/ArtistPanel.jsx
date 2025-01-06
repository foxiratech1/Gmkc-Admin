import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import React from "react";
import Shipment from "./Shipment/Shipment";
import Dashboard from "./Dashboard/Dashboard";
import Vehicles from "./Vehicle/Vehicles";
import Customer from "./Customer/Customer";
import FaqForm from "./Faq/Faq";
import Inquiry from "./Inquiry/Inquiry";
import Request from "./Shipment/Request";

const ArtistPanel = () => {
  return (
    <div className="flex w-full h-screen bg-gray-200">
      <div className="xl:w-[15%] lg:w-[20%] md:w-[10%] sm:w-[10%] w-[20%]">
        <Sidebar />
      </div>
      <div className="xl:w-[80%] lg:w-[78%] md:w-[88%] sm:w-[85%] w-[78%] container mx-auto mt-5">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="shipment" element={<Shipment />} />
          <Route path="request" element={<Request />} />
          <Route path="faq" element={<FaqForm />} />
          <Route path="vehicles" element={<Vehicles />} />  
          <Route path="customer" element={<Customer />} />  
          <Route path="inquiry" element={<Inquiry />} />
        </Routes>
      </div>
    </div>
  );
};

export default ArtistPanel;
