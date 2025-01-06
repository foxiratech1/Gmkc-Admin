import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useForm } from "react-hook-form";
import DeleteModal from "../../utils/DeleteModal";

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

const VehicleModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false);
    setCurrentVehicle(null);
    reset();
  };

  const onSubmit = (data) => {
    if (editMode && currentVehicle) {
      setVehicleData(
        vehicleData.map((item) =>
          item.id === currentVehicle.id
            ? {
                ...item,
                Vehicle: data.vehicleImage[0] || item.Vehicle,
                Vehiclename: data.vehicleName,
                Length: data.length,
                Height: data.height,
                Width: data.width,
                Pallets: data.pallets,
                MaximumWeight: data.maxWeight,
              }
            : item
        )
      );
    } else {
      setVehicleData([
        ...vehicleData,
        {
          id: vehicleData.length + 1,
          Vehicle: URL.createObjectURL(data.vehicleImage[0]),
          Vehiclename: data.vehicleName,
          Length: data.length,
          Height: data.height,
          Width: data.width,
          Pallets: data.pallets,
          MaximumWeight: data.maxWeight,
        },
      ]);
    }

    closeModal();
  };

  const handleEdit = (vehicle) => {
    setEditMode(true);
    setCurrentVehicle(vehicle);
    openModal();
    setValue("vehicleName", vehicle.Vehiclename);
    setValue("length", vehicle.Length);
    setValue("height", vehicle.Height);
    setValue("width", vehicle.Width);
    setValue("pallets", vehicle.Pallets);
    setValue("maxWeight", vehicle.MaximumWeight);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteModalOpen(true);
    // setDeleteIndex(index);
    setDeleteVehicleId(id);
  };

  // const openDeleteModal = (id) => {
  //   setDeleteVehicleId(id);
  // };

  const confirmDelete = () => {
    setVehicleData(vehicleData.filter((item) => item.id !== deleteVehicleId));
    setDeleteVehicleId(null);
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modalOverlay") {
      closeModal();
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          id="modalOverlay"
          className="text-white bg-[#BFA75D] font-medium rounded-md text-md px-5 py-2.5"
          onClick={openModal}
        >
          Add Vehicle
        </button>
      </div>

      {modalIsOpen && (
        <div
          id="modalOverlay"
          onClick={handleClickOutside}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg w-full md:max-w-2xl max-w-sm max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {editMode ? "Edit Vehicle" : "Add Vehicle"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="w-full">
                <label className="block mb-2 text-sm font-medium mt-2">
                  Vehicle Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("vehicleImage", {
                    required: !editMode ? "Vehicle image is required" : false,
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.vehicleImage && (
                  <p className="text-red-500 text-sm">
                    {errors.vehicleImage.message}
                  </p>
                )}

                <label className="block mb-2 text-sm font-medium mt-2">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  {...register("vehicleName", {
                    required: "Vehicle name is required",
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.vehicleName && (
                  <p className="text-red-500 text-sm">
                    {errors.vehicleName.message}
                  </p>
                )}

                <label className="block mb-2 text-sm font-medium mt-2">
                  Length
                </label>
                <input
                  type="number"
                  {...register("length", {
                    required: "Length is required",
                    valueAsNumber: true,
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.length && (
                  <p className="text-red-500 text-sm">
                    {errors.length.message}
                  </p>
                )}

                <label className="block mb-2 text-sm font-medium mt-2">
                  Height
                </label>
                <input
                  type="number"
                  {...register("height", {
                    required: "Height is required",
                    valueAsNumber: true,
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.height && (
                  <p className="text-red-500 text-sm">
                    {errors.height.message}
                  </p>
                )}

                <label className="block mb-2 text-sm font-medium mt-2">
                  Width
                </label>
                <input
                  type="number"
                  {...register("width", {
                    required: "Width is required",
                    valueAsNumber: true,
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.width && (
                  <p className="text-red-500 text-sm">{errors.width.message}</p>
                )}

                <label className="block mb-2 text-sm font-medium mt-2">
                  Pallets
                </label>
                <input
                  type="number"
                  {...register("pallets", {
                    required: "Pallets is required",
                    valueAsNumber: true,
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.pallets && (
                  <p className="text-red-500 text-sm">
                    {errors.pallets.message}
                  </p>
                )}

                <label className="block mb-2 text-sm font-medium mt-2">
                  Maximum Weight
                </label>
                <input
                  type="number"
                  {...register("maxWeight", {
                    required: "Maximum Weight is required",
                    valueAsNumber: true,
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.maxWeight && (
                  <p className="text-red-500 text-sm">
                    {errors.maxWeight.message}
                  </p>
                )}

                <div className="flex justify-end mt-4 space-x-4">
                  <button
                    type="submit"
                    className="bg-[#BFA75D] font-semibold text-white px-6 py-2 rounded"
                  >
                    {editMode ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-black text-white font-semibold px-6 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* {deleteVehicleId !== null && (
        <>
          <DeleteModal title="Confirm Delete">
            <p>Are you sure you want to delete this FAQ?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={confirmDelete}
                className="bg-[#BFA75D] text-white py-2 px-4 rounded font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteVehicleId(null)}
                className="ml-3 py-2 px-4 rounded bg-black text-white font-medium"
              >
                Cancel
              </button>
            </div>
          </DeleteModal>
        </>
      )} */}

      <div className="overflow-x-auto mt-8">
        <table className="table-auto bg-white w-full border-collapse border border-gray-300">
          <thead className="bg-black text-white">
            <tr className="text-white">
              {table_head.map((item, index) => (
                <th className="px-2 py-3 text-sm font-semibold text-left">
                  {item.head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicleData.map((item) => (
              <tr key={item.id} className="border-t border-gray-300">
                <td className="p-2 w-16">
                  <img
                    src={item.Vehicle}
                    alt="vehicle"
                    className="w-10 h-10 object-contain"
                  />
                </td>
                <td className="w-36 p-2 text-[#12223D] font-normal">
                  <p className="line-clamp-2">{item.Vehiclename}</p>
                </td>
                <td className="p-2 w-16">{item.Length}</td>
                <td className="p-2 w-16">{item.Height}</td>
                <td className="p-2 w-16">{item.Width}</td>
                <td className="p-2 w-16">{item.Pallets}</td>
                <td className="p-2 w-16">{item.MaximumWeight}</td>
                <td className="p-2 w-10">
                  <div className="flex gap-5">
                    <FaEdit
                      size={20}
                      color="#BFA75D"
                      onClick={() => handleEdit(item)}
                    />

                    <button onClick={() => handleOpenDeleteModal(item.id)}>
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default VehicleModal;
