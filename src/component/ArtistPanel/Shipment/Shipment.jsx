import React, { useEffect, useState } from "react";
import shipmentData from "../../json/shipmentData";
import arrow from "../../../assets/downnn.png";
import Tooltip from "../../utils/Tooltip";
import { IoEyeOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { IoEye } from "react-icons/io5";
import DeleteModal from "../../utils/DeleteModal";
import OpenModalButton from "../../utils/OpenModalBtn";

const table_head = [
  {
    head: "Id",
  },
  {
    head: "Customer Name",
  },
  {
    head: "Email",
  },
  {
    head: "Phone",
  },
  {
    head: "Order Date & Time",
  },
  {
    head: "Vehicle Type",
  },
  {
    head: "Pickup Location",
  },
  {
    head: "Pickup Date & Time",
  },
  {
    head: "Drop Off Location",
  },
  {
    head: "Action",
  },
];

const ShipmentTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editedSteps, setEditedSteps] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [data, setData] = useState(shipmentData);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const openModal = (customerData) => {
    setSelectedCustomer(customerData);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCustomer(null);
  };

  useEffect(() => {
    if (selectedCustomer?.steps) {
      setEditedSteps([...selectedCustomer.steps]);
    }
  }, [selectedCustomer]);

  const handleEditClick = (stepIndex) => {
    setEditMode(stepIndex);
  };

  const handleInputChange = (e, stepIndex, field) => {
    const updatedSteps = [...editedSteps];
    updatedSteps[stepIndex][field] = e.target.value;
    setEditedSteps(updatedSteps);
  };

  const handleSave = () => {
    console.log("Updated Steps:", editedSteps);
    setEditMode(null);
  };

  const handleOpenDeleteModal = (index) => {
    setDeleteModalOpen(true);
    setDeleteIndex(index);
  };

  const confirmDelete = () => {
    const updatedData = data.filter((_, index) => index !== deleteIndex);
    setData(updatedData);
    setDeleteModalOpen(false);
  };
  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-10">Shipment</h1>
        <div className="overflow-x-auto">
          <table className="table-auto bg-white w-full border-collapse border border-gray-300">
            <thead className="bg-black text-white text-left">
              <tr className="text-white">
                {table_head.map((item, index) => (
                  <th className="px-2 py-3 text-sm font-semibold text-left">
                    {item.head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((user, index) => (
                <tr key={index} className="border-t border-gray-300">
                  <td className="px-2 py-3 text-[#12223D] font-normal">
                    <p className="w-10 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {user.id}
                    </p>
                  </td>
                  <td className="px-2 py-3 text-[#12223D] font-normal">
                    <Tooltip text={user.customerName} position="top">
                      <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                        {user.customerName}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.email} position="top">
                      <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {user.email}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.phone} position="top">
                      <p className="w-24 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {user.phone}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.orderDate} position="top">
                      <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {`${user.orderDate} ${user.orderTime}`}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.vehicleType} position="top">
                      <p className="w-24 overflow-hidden text-sm text-ellipsis whitespace-nowrap ">
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
                    <Tooltip text={user.pickupDate} position="top">
                      <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {`${user.pickupDate} ${user.pickupTime}`}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.dropOffLocation} position="top">
                      <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-nowrap flex items-center">
                        <span className="flex-grow overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                          {user.dropOffLocation}
                        </span>
                        <img
                          src={arrow}
                          alt="Arrow"
                          onClick={() => openModal(user)}
                          className="ml-2 flex-shrink-0 w-4 h-4"
                        />
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <p className="w-16 overflow-hidden text-sm text-ellipsis whitespace-nowrap flex gap-5 item-center">
                      <OpenModalButton size={20} user={user} />
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

      {modalIsOpen && selectedCustomer && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white md:p-8 p-4 rounded-lg shadow-lg sm:max-w-lg w-[70%] sm:ml-0 ml-10 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Delivery Detail</h2>

            <p>
              <p className="font-semibold text-lg">Pickup Location:</p>
              {selectedCustomer.pickupLocation}
            </p>

            <div className="mt-4">
              {editedSteps && editedSteps.length > 0 ? (
                <>
                  <ul className="mt-2">
                    {editedSteps.slice(0, 2).map((step, idx) => (
                      <div
                        key={idx}
                        className="mt-4 border border-[#BFA75D] shadow-lg border border-gray-100 p-2 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-gray-800">
                            Intermediate Stop : {step.stepNumber}
                          </p>
                          <FaEdit
                            size={20}
                            color="#BFA75D"
                            className="cursor-pointer"
                            onClick={() => handleEditClick(idx)}
                          />
                        </div>
                        {editMode === idx ? (
                          <>
                            <input
                              type="text"
                              className="w-full p-2 border mt-1 rounded"
                              value={step.userName}
                              onChange={(e) =>
                                handleInputChange(e, idx, "userName")
                              }
                              placeholder="Name"
                            />
                            <input
                              type="email"
                              className="w-full p-2 border mt-1 rounded"
                              value={step.email}
                              onChange={(e) =>
                                handleInputChange(e, idx, "email")
                              }
                              placeholder="Email"
                            />
                            <input
                              type="text"
                              className="w-full p-2 border mt-1 rounded"
                              value={step.phone}
                              onChange={(e) =>
                                handleInputChange(e, idx, "phone")
                              }
                              placeholder="Phone"
                            />
                            <input
                              type="text"
                              className="w-full p-2 border mt-1 rounded"
                              value={step.address}
                              onChange={(e) =>
                                handleInputChange(e, idx, "address")
                              }
                              placeholder="Address"
                            />
                          </>
                        ) : (
                          <>
                            <p className="text-sm">Name: {step.userName}</p>
                            <p className="text-sm">Email: {step.email}</p>
                            <p className="text-sm">Phone: {step.phone}</p>
                            <p className="text-sm">Address: {step.address}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </ul>

                  <div className="mt-4 border border-[#BFA75D] shadow-lg border border-gray-100 p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-900">
                        Final Stop
                      </p>
                      <FaEdit
                        size={20}
                        color="#BFA75D"
                        className="cursor-pointer"
                        onClick={() => handleEditClick(2)}
                      />
                    </div>
                    {editMode === 2 ? (
                      <>
                        <input
                          type="text"
                          className="w-full p-2 border mt-1 rounded"
                          value={editedSteps[2].userName}
                          onChange={(e) => handleInputChange(e, 2, "userName")}
                          placeholder="Name"
                        />
                        <input
                          type="email"
                          className="w-full p-2 border mt-1 rounded"
                          value={editedSteps[2].email}
                          onChange={(e) => handleInputChange(e, 2, "email")}
                          placeholder="Email"
                        />
                        <input
                          type="text"
                          className="w-full p-2 border mt-1 rounded"
                          value={editedSteps[2].phone}
                          onChange={(e) => handleInputChange(e, 2, "phone")}
                          placeholder="Phone"
                        />
                        <input
                          type="text"
                          className="w-full p-2 border mt-1 rounded"
                          value={editedSteps[2].address}
                          onChange={(e) => handleInputChange(e, 2, "address")}
                          placeholder="Address"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-sm">
                          Name: {editedSteps[2].userName}
                        </p>
                        <p className="text-sm">Email: {editedSteps[2].email}</p>
                        <p className="text-sm">Phone: {editedSteps[2].phone}</p>
                        <p className="text-sm">
                          Address: {editedSteps[2].address}
                        </p>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p>No intermediate steps available.</p>
              )}
            </div>

            {editMode !== null && (
              <button
                className="mt-4 bg-[#BFA75D] font-medium text-white py-2 px-4 rounded mr-2"
                onClick={handleSave}
              >
                Save
              </button>
            )}
            <button
              className="mt-4 bg-black font-medium text-white py-2 px-4 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShipmentTable;
