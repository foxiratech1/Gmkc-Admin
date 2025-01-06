import { useState } from "react";
import { IoEye } from "react-icons/io5";
import CommonModal from "./CommonModal";

const OpenModalButton = ({ user }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <>
      <button onClick={openModal}>
        <IoEye size={16} color="#BFA75D" />
      </button>

      <CommonModal isOpen={modalIsOpen} onClose={closeModal}>
        <div className="h-[60vh]">
          <h1 className="text-2xl font-semibold text-center mb-10">
            Customer Details
          </h1>
          <div className="space-y-4">
            <p className="w-full flex gap-5">
              <strong className="!w-[25%]">ID:</strong>
              <span> {user.id}</span>
            </p>
            <p className="w-full flex gap-5">
              <strong className="!w-[25%]">Name:</strong>
              <span> {user.customerName}</span>
            </p>
            <p className="w-full flex gap-5">
              <strong className="!w-[25%]">Email:</strong>
              <span> {user.email}</span>
            </p>
            <p className="w-full flex gap-5">
              <strong className="!w-[25%]">Phone:</strong>
              <span> {user.phone}</span>
            </p>
            <p className="w-full flex gap-5">
              <strong className="!w-[25%]">Order Date:</strong>
              <span>
                {" "}
                {user.orderDate} {user.orderTime}
              </span>
            </p>
            <p className="w-full flex gap-5">
              <strong className="!w-[25%]">Vehicle Type:</strong>
              <span> {user.vehicleType}</span>
            </p>
            <p className="w-full flex gap-5">
              <strong className="!w-[25%]">Pickup Location:</strong>
              <span> {user.pickupLocation}</span>
            </p>
            <p className="w-full flex gap-5">
              <strong className="!w-[25%]">Pickup Date & Time:</strong>
              <span>
                {" "}
                {user.pickupDate} {user.pickupTime}
              </span>
            </p>
            <p className="w-full flex gap-5">
              <strong className="!w-[25%]">Drop Off Location:</strong>
              <span> {user.dropOffLocation}</span>
            </p>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default OpenModalButton;
