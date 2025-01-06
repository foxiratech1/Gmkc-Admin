import currentData from "../../json/shipmentData";
import { useState } from "react";
import Tooltip from "../../utils/Tooltip";
import OpenModalButton from "../../utils/OpenModalBtn";
import { AiFillDelete } from "react-icons/ai";
import DeleteModal from "../../utils/DeleteModal";

const table_head = [
  { head: "Id" },
  { head: "Customer Name" },
  { head: "Email" },
  { head: "Phone" },
  { head: "Order Date & Time" },
  { head: "Vehicle Type" },
  { head: "Pickup Location" },
  { head: "Pickup Date & Time" },
  { head: "Drop Off Location" },
  { head: "Action" },
];

const Table = () => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [data, setData] = useState(currentData);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleOpenDeleteModal = (index) => {
    setDeleteModalOpen(true);
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    const updatedData = data.filter((_, index) => index !== deleteIndex);
    console.log("updatedData", updatedData);
    setData(updatedData);
    setDeleteModalOpen(false);
  };

  return (
    <div className="rounded-lg mt-6">
      <h1 className="text-2xl mb-5 font-semibold text-[#333843] leading-7">
        Shipment
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-black">
            <tr className="text-white">
              {table_head.map((item, index) => (
                <th
                  key={index}
                  className="px-2 py-3 text-sm font-semibold text-left"
                >
                  {item.head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={index} className="bg-white border-b border-[#C2C2C2]">
                <td className="p-2">
                  <p className="w-10 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                    {user.id}
                  </p>
                </td>
                <td className="p-2">
                  <Tooltip text={user.customerName} position="top">
                    <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {user.customerName}
                    </p>
                  </Tooltip>
                </td>
                <td className="p-2">
                  <Tooltip text={user.email} position="top">
                    <p className="w-56 overflow-hidden text-sm text-ellipsis whitespace-wrap">
                      {user.email}
                    </p>
                  </Tooltip>
                </td>
                <td className="p-2">
                  <Tooltip text={user.phone} position="top">
                    <p className="w-28 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {user.phone}
                    </p>
                  </Tooltip>
                </td>
                <td className="p-2">
                  <Tooltip
                    text={`${user.orderDate} ${user.orderTime}`}
                    position="top"
                  >
                    <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {`${user.orderDate} ${user.orderTime}`}
                    </p>
                  </Tooltip>
                </td>
                <td className="p-2">
                  <Tooltip text={user.vehicleType} position="top">
                    <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {user.vehicleType}
                    </p>
                  </Tooltip>
                </td>
                <td className="p-2">
                  <Tooltip text={user.pickupLocation} position="top">
                    <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {user.pickupLocation}
                    </p>
                  </Tooltip>
                </td>
                <td className="p-2">
                  <Tooltip
                    text={`${user.pickupDate} ${user.pickupTime}`}
                    position="top"
                  >
                    <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {`${user.pickupDate} ${user.pickupTime}`}
                    </p>
                  </Tooltip>
                </td>
                <td className="p-2">
                  <Tooltip text={user.dropOffLocation} position="top">
                    <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {user.dropOffLocation}
                    </p>
                  </Tooltip>
                </td>
                <td className="p-2">
                  <p className="w-16 overflow-hidden text-sm text-ellipsis whitespace-nowrap flex gap-5 item-center">
                    <button className="mt-2">
                      <OpenModalButton size={20} user={user} />
                    </button>

                    <button onClick={() => handleOpenDeleteModal(index)}>
                      <AiFillDelete size={20} color="#BFA75D" />
                    </button>
                    {isDeleteModalOpen && (
                      <DeleteModal
                        title="Confirm Delete"
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={confirmDelete}
                      >
                        <p>Are you sure you want to delete this item?</p>
                      </DeleteModal>
                    )}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
