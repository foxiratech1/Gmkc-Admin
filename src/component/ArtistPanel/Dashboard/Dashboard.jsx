import { TbTruckDelivery } from "react-icons/tb";
import { MdHomeRepairService } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";
import Table from "./Table";


const stats = [
  {
    label: "Shipment",
    value: 1250,
    dash: <FaBoxes size={20} />,
  },
  { label: "Vehicles", value: 5200, dash: <TbTruckDelivery size={20} /> },
  // { label: "Services", value: 5130, dash: <MdHomeRepairService size={20} /> },
];

const Dashboard = () => {
  
  return (
    <>
        <div className="xl:w-[70%] w-[90%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 sm:gap-6 rounded-3xl">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="px-5 lg:px-10 py-6 sm:py-8 border bg-white border-gray-200 shadow-xl rounded-md flex gap-4 items-center"
            >
              <p className="w-12 h-12 bg-gray-300 flex items-center justify-center rounded-full">
                {stat.dash}
              </p>
              <div className="">
                <p className="text-md sm:text-lg text-[#667085] font-medium leading-5">
                  {stat.label}
                </p>
                <h2 className="text-lg sm:text-2xl font-semibold text-[#12223D]">
                  {stat.value}
                </h2>
              </div>
            </div>
          ))}
        </div>
      <>
        <Table />
      </>
    </>
  );
};

export default Dashboard;