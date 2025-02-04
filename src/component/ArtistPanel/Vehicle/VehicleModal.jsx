import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { useForm } from "react-hook-form";
import DeleteModal from "../../utils/DeleteModal";

import toast from "react-hot-toast";
import postVehicleData from "./https/addvehiclemutation";
import { useSelector } from "react-redux";
import { GetVehicleData } from "./https/GetVehicleList";
import LoadingPage from "../../Loader";
import UpdateVehicleData from "./https/updateVehicle";
import DeleteVehicle from "./https/deletevehicle";
import { Pagination } from "../../pagination";

const table_head = [
  {
    head: "Vehicle Image",
  },
  {
    head: "Vehicle Name",
  },
  {
    head: "length",
  },
  {
    head: "height",
  },
  {
    head: "width",
  },
  {
    head: "pallets",
  },
  {
    head: "Maximum Weight",
  },
  {
    head: "Action",
  },
];

const VehicleModal = () => {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteVehicleId, setDeleteVehicleId] = useState(null);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState([]);
  const { token } = useSelector((state) => state.user);
  const ITEM_PER_PAGE = 10;

  const { mutateAsync, isPending } = postVehicleData();
  const { data, isLoading, isError, error } = GetVehicleData({
    token,
    page: currentPage,
    limit: ITEM_PER_PAGE,
  });
  const { mutateAsync: updateMutation, isPending: updatepending } =
    UpdateVehicleData();
  const { mutateAsync: deletvehicle } = DeleteVehicle();
  useEffect(() => {
    if (data) {
      setVehicleData(data?.data);
      setCurrentPage(data?.paginationData?.page);
    }
  }, [data]);

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

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (data.vehicalImg[0]) {
      formData.append("vehicalImg", data.vehicalImg[0]);
    }
    formData.append("name", data.name);
    formData.append("length", data.length);
    formData.append("height", data.height);
    formData.append("width", data.width);
    formData.append("pallets", data.pallets);
    formData.append("maxWeight", data.maxWeight);
    formData.append("_id", data._id);
    formData.append("token", token);

    if (editMode && currentVehicle) {
      try {
        await updateMutation(formData);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        console.log(formData, "formData");
        await mutateAsync(formData);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "error accure");
      }
    }

    closeModal();
  };

  const handleEdit = (vehicle) => {
    setEditMode(true);
    setCurrentVehicle(vehicle);
    openModal();
    setValue(
      "vehicalImg",
      `${BASE_URL}/images/vehicalImg/${vehicle.vehicalImg}`
    );
    setValue("name", vehicle.name);
    setValue("length", vehicle.length);
    setValue("height", vehicle.height);
    setValue("width", vehicle.width);
    setValue("pallets", vehicle.pallets);
    setValue("maxWeight", vehicle.maxWeight);
    setValue("_id", vehicle._id);
  };

  const handleOpenDeleteModal = async (id) => {
    setDeleteModalOpen(true);

    setDeleteVehicleId(id);
  };

  // const openDeleteModal = (id) => {
  //   setDeleteVehicleId(id);
  // };

  const confirmDelete = async (id) => {
    await deletvehicle({ id: deleteVehicleId, token });
    setDeleteVehicleId(null);
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modalOverlay") {
      closeModal();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <LoadingPage />;
  }
  if (isError) {
    return <div>{error?.response?.data?.message}</div>;
  }

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
                  {...register("vehicalImg", {
                    required: !editMode ? "Vehicle image is required" : false,
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.vehicalImg && (
                  <p className="text-red-500 text-sm">
                    {errors.vehicalImg.message}
                  </p>
                )}

                <label className="block mb-2 text-sm font-medium mt-2">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Vehicle name is required",
                    maxLength: {
                      value: 30,
                      message: "Vehicle name cannot exceed 30 characters",
                    },
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}

                <label className="block mb-2 text-sm font-medium mt-2">
                  Length
                </label>
                <input
                  type="text"
                  {...register("length", {
                    required: "Length is required",
                    maxLength: {
                      value: 30,
                      message: "Length cannot exceed 30 characters",
                    },
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
                  type="text"
                  {...register("height", {
                    required: "Height is required",
                    maxLength: {
                      value: 30,
                      message: "Height cannot exceed 30 characters",
                    },
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
                  type="text"
                  {...register("width", {
                    required: "Width is required",
                    maxLength: {
                      value: 30,
                      message: "Width cannot exceed 30 characters",
                    },
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
                  type="text"
                  {...register("pallets", {
                    required: "Pallets is required",
                    maxLength: {
                      value: 30,
                      message: "Pallets cannot exceed 30 characters",
                    },
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
                  type="text"
                  {...register("maxWeight", {
                    required: "Maximum Weight is required",
                    maxLength: {
                      value: 30,
                      message: "Maximum Weight cannot exceed 30 characters",
                    },
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
                    {editMode
                      ? updatepending
                        ? "...Loading"
                        : "Update"
                      : isPending
                      ? "...Loading"
                      : "Submit"}
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
      {vehicleData?.length > 0 ? (
        <div>
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
                {vehicleData?.map((item) => (
                  <tr key={item.id} className="border-t border-gray-300">
                    <td className="p-2 w-16">
                      <img
                        // src={item.Vehicle}
                        src={`${BASE_URL}/images/vehicalImg/${item.vehicalImg}`}
                        alt="vehical"
                        className="w-20 h-10 object-contain"
                      />
                    </td>
                    <td className="w-36 p-2 text-[#12223D] font-normal">
                      <p className="line-clamp-2">{item.name}</p>
                    </td>
                    <td className="p-2 w-16">{item.length}</td>
                    <td className="p-2 w-16">{item.height}</td>
                    <td className="p-2 w-16">{item.width}</td>
                    <td className="p-2 w-16">{item.pallets}</td>
                    <td className="p-2 w-16">{item.maxWeight}</td>
                    <td className="p-2 w-10">
                      <div className="flex gap-5">
                        <FaEdit
                          size={20}
                          color="#BFA75D"
                          onClick={() => handleEdit(item)}
                        />

                        <button onClick={() => handleOpenDeleteModal(item._id)}>
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
          <Pagination
            currentPage={currentPage}
            totalPages={data?.paginationData?.totalPages}
            onPageChange={handlePageChange}
            totalCount={data?.totalCount}
          />
        </div>
      ) : (
        <div>
          <p className=" flex item-center text-gray-700">
            Vehicle list is empty
          </p>
        </div>
      )}
    </>
  );
};

export default VehicleModal;
