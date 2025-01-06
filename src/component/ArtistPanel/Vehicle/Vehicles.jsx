import React from "react";
import VehicleModal from "./VehicleModal";

const table_head = [
  {
    head: "Vehicle Image",
  },
  {
    head: "Vehicle Name",
  },
  {
    head: "Length",
  },
  {
    head: "Height",
  },
  {
    head: "Width",
  },
  {
    head: "Pallets",
  },
  {
    head: "Maximum Weight",
  },
  {
    head: "Action",
  },
];
const Vehicles = () => {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-10">Vehicle</h1>
      <div className="p-2 bg-white rounded-lg mt-6">
        <VehicleModal />
      </div>
    </>
  );
};

export default Vehicles;
