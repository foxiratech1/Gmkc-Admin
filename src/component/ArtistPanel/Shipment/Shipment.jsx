import React, { useEffect, useState } from "react";
import shipmentData from "../../json/shipmentData";
import arrow from "../../../assets/downnn.png";
import Tooltip from "../../utils/Tooltip";
import { IoEyeOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import DeleteModal from "../../utils/DeleteModal";
import OpenModalButton from "../../utils/OpenModalBtn";
import { useSelector } from "react-redux";
import { GetAllShipmentData } from "./https/GetAllshipment";
import LoadingPage from "../../Loader";
import { Pagination } from "../../pagination";
import { EditShipmentStop } from "./https/updateStop";
import { DeleteShipment } from "./https/shipmentDelete";
import { GetSingleShipmentData } from "./https/GetShipmentDetails";
import axios from "axios";
import { shipmentendpoints } from "../../../services/apis";

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
  const { token } = useSelector((state) => state.user);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { data, isLoading, isError, error } = GetAllShipmentData({
    token,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const { data: popupdata } = GetSingleShipmentData({ token, userId });
  const { mutateAsync, isPending } = EditShipmentStop(userId);
  const { mutateAsync: deleteShipment } = DeleteShipment();
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [statuss, setStatus] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editableCollectionInfo, setEditableCollectionInfo] = useState({
    name: "",
    email: "",
    contactNumber: "",
    collectionAddress: "",
  });

  const [editableDeliveryInfo, setEditableDeliveryInfo] = useState({
    deliveryName: "",
    deliveryEmail: "",
    deliveryContactNumber: "",
    deliveryAddress: "",
  });

  const [editableIntermediateStops, setEditableIntermediateStops] = useState({
    stopOneName: "",
    stopOneEmail: "",
    stopOneContactNumber: "",
    stopOneAddress: "",
  });
  const [editableIntermediateStops2, setEditableIntermediateStops2] = useState({
    stopTwoName: "",
    stopTwoEmail: "",
    stopTwoContactNumber: "",
    stopTwoAddress: "",
  });

  useEffect(() => {
    if (data) {
      setCurrentPage(data.paginationData.page);
    }
  }, [data]);

  useEffect(() => {
    if (popupdata) {
      setCustomerData(popupdata);
    }
  }, [popupdata, userId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteModalOpen(true);
    setDeleteIndex(id);
  };

  const confirmDelete = async () => {
    await deleteShipment({ id: deleteIndex, token });
    setDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  const handleOpenModal = (shipment) => {
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShipment(null);
  };

  if (isLoading) {
    return <LoadingPage />;
  }
  if (isError) {
    return <p>{error?.response?.data?.message}</p>;
  }
  const handleClick = async (user, stat) => {
    try {
      console.log("948585490", stat);
      setIsModalOpen(true);
      const response = await axios.get(
        `${shipmentendpoints.SHIPMENT_DELIVERY_DETAIL}/${user}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the response contains the necessary data
      if (response?.data?.data) {
        // Set the data to selectedCustomer and open the modal
        setSelectedCustomer(response.data.data);
        preFillData(response.data.data);
        if (stat == "accept") {
          setStatus(response.data.data.status);
        }
        localStorage.setItem("formId", response.data.data._id);
        setIsModalOpen(true);
      } else {
        console.error("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching shipment delivery details:", error);
    }
  };

  const handleInputChangeCollection = (e, field) => {
    setEditableCollectionInfo({
      ...editableCollectionInfo,
      [field]: e.target.value,
    });
  };

  const handleInputChangeDelivery = (e, field) => {
    setEditableDeliveryInfo({
      ...editableDeliveryInfo,
      [field]: e.target.value,
    });
  };
  const handleInputChangeIntermediateStop = (e, field) => {
    setEditableIntermediateStops({
      ...editableIntermediateStops,
      [field]: e.target.value,
    });
  };
  const handleInputChangeIntermediateStop2 = (e, field) => {
    setEditableIntermediateStops2({
      ...editableIntermediateStops2,
      [field]: e.target.value,
    });
  };

  const preFillData = (customerData) => {
    setEditableCollectionInfo({
      ...customerData?.contactDetail?.[0]?.collectionInfo,
    });
    setEditableDeliveryInfo({
      ...customerData?.contactDetail?.[0]?.deliveryInfo,
    });
    setEditableIntermediateStops({
      stopOneName:
        customerData?.contactDetail?.[0]?.deliveryInfo?.intermediateStops
          .intermediateStopOne.stopOneName,
      stopOneEmail:
        customerData?.contactDetail?.[0]?.deliveryInfo?.intermediateStops
          .intermediateStopOne.stopOneEmail,
      stopOneContactNumber:
        customerData?.contactDetail?.[0]?.deliveryInfo?.intermediateStops
          .intermediateStopOne.stopOneContactNumber,
      stopOneAddress:
        customerData?.contactDetail?.[0]?.deliveryInfo?.intermediateStops
          ?.intermediateStopOne.stopOneAddress,
    });
    setEditableIntermediateStops2({
      stopTwoName:
        customerData?.contactDetail?.[0]?.deliveryInfo?.intermediateStops
          .intermediateStopTwo.stopTwoName,
      stopTwoEmail:
        customerData?.contactDetail?.[0]?.deliveryInfo?.intermediateStops
          .intermediateStopTwo.stopTwoEmail,
      stopTwoContactNumber:
        customerData?.contactDetail?.[0]?.deliveryInfo?.intermediateStops
          .intermediateStopTwo.stopTwoContactNumber,
      stopTwoAddress:
        customerData?.contactDetail?.[0]?.deliveryInfo?.intermediateStops
          ?.intermediateStopTwo.stopTwoAddress,
    });
  };

  const handleEditClick = (mode) => {
    setEditMode(mode);
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        contactDetail: {
          collectionInfo: editableCollectionInfo,
          deliveryInfo: {
            ...editableDeliveryInfo,
            intermediateStops: {
              intermediateStopOne: editableIntermediateStops,
              intermediateStopTwo: editableIntermediateStops2,
            },
          },
          status: statuss,
        },
      };

      const response = await axios.put(
        `${shipmentendpoints.UPDATE_SHIPMENT_STOP}/${selectedCustomer._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200) {
        setEditMode(null);
        setIsModalOpen(false);
        closeModal();
      }
    } catch (error) {
      console.error("Error updating shipment data:", error);
    }
  };
  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-10">Shipment</h1>
        {data?.data?.length > 0 ? (
          <div>
            <div className="overflow-x-auto">
              <table className="table-auto bg-white w-full border-collapse border border-gray-300">
                <thead className="bg-black text-white text-left">
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
                  {data?.data?.map((user, index) => (
                    <tr key={index} className="border-t border-gray-300">
                      <td className="px-2 py-3 text-[#12223D] font-normal">
                        <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                          {user.shipmentId}
                        </p>
                      </td>
                      <td className="px-2 py-3 text-[#12223D] font-normal">
                        {user.status === "accept" ? (
                          <p className="text-sm">Not Available</p>
                        ) : (
                          user?.contactDetail?.map((detail) =>
                            detail.collectionInfo ? (
                              <div key={detail.collectionInfo.name}>
                                <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                                  {detail.collectionInfo.name}
                                </p>
                              </div>
                            ) : null
                          )
                        )}
                      </td>
                      <td className="p-2">
                        {user.status === "accept" ? (
                          <p className="w-90 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {user.email}
                          </p>
                        ) : (
                          user?.contactDetail?.map((detail) =>
                            detail.collectionInfo ? (
                              <div key={detail.collectionInfo.email}>
                                <p className="w-90 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                                  {detail.collectionInfo.email}
                                </p>
                              </div>
                            ) : null
                          )
                        )}
                      </td>
                      <td className="px-2 py-3 text-[#12223D] font-normal">
                        {user.status === "accept" ? (
                          <p className="text-sm">Not Available</p>
                        ) : (
                          user?.contactDetail?.map((detail) =>
                            detail.collectionInfo ? (
                              <div key={detail.collectionInfo.contactNumber}>
                                <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                                  {detail.collectionInfo.contactNumber}
                                </p>
                              </div>
                            ) : null
                          )
                        )}
                      </td>
                      <td className="px-2 py-3 text-[#12223D] font-normal">
                        {user.status === "accept" ? (
                          <p className="text-sm">{user.orderDate}</p>
                        ) : (
                          <>
                            <Tooltip text={user.orderDate} position="top">
                              <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                                {`${user.orderDate}`}
                              </p>
                            </Tooltip>
                          </>
                        )}
                      </td>
                      <td className="p-2">
                        <Tooltip text={user.vehicleType} position="top">
                          <p className="w-24 overflow-hidden text-sm text-ellipsis whitespace-nowrap ">
                            {user.vehicleType}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="p-2">
                        {user.status === "accept" ? (
                          <p className="w-90 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {user.collectionAddress}
                          </p>
                        ) : (
                          user?.contactDetail?.map((detail) =>
                            detail.collectionInfo ? (
                              <div
                                key={detail.collectionInfo.collectionAddress}
                              >
                                <p className="w-90 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                                  {detail.collectionInfo.collectionAddress}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm">Not Available</p>
                            )
                          )
                        )}
                      </td>
                      <td className="p-2">
                        <Tooltip text={user.pickUpDateAndTime} position="top">
                          <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                            {`${
                              user.pickUpDateAndTime
                                ? user.pickUpDateAndTime
                                : null
                            }`}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="p-2">
                        {user.status === "accept" ? (
                          <p className="w-90 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {user.collectionAddress}
                          </p>
                        ) : (
                          user?.contactDetail?.map((detail) =>
                            detail.deliveryInfo ? (
                              <div key={detail.deliveryInfo.deliveryAddress}>
                                <p className="w-90 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                                  {detail.deliveryInfo.deliveryAddress}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm">Not Available</p>
                            )
                          )
                        )}
                      </td>
                      <td className="p-2">
                        <p className="w-16 overflow-hidden text-sm text-ellipsis whitespace-nowrap flex gap-5 item-center justify-end">
                          <MdOutlineRemoveRedEye
                            className="text-yellow-300 text-[20px] hover:cursor-pointer"
                            onClick={() =>
                              handleClick(user._id, user.status === "accept")
                            }
                          />
                          <button
                            onClick={() => handleOpenDeleteModal(user._id)}
                          >
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
            <Pagination
              currentPage={currentPage}
              totalPages={data.paginationData.totalPages}
              totalCount={data?.totalCount}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div>
            <p className="flex items-center text-gray-700">
              Shipment list is empty
            </p>
          </div>
        )}
      </div>

      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex mt-3 justify-center">
          <div
            className="bg-white md:p-8 p-4 rounded-lg shadow-lg md:max-w-[70%] w-[70%] sm:ml-0 ml-10 overflow-y-auto "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:grid grid-cols-2 gap-3">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Shipment Delivery Detail
                </h2>

                <div>
                  <p className="font-semibold text-md">Pickup Location:</p>
                  <div className="py-[4px] px-7 bg-gray-400 text-black font-semibold rounded-md mt-1 text-[14px]">
                    {editMode === 1 ? (
                      <>
                        <input
                          type="text"
                          value={editableCollectionInfo.name}
                          onChange={(e) =>
                            handleInputChangeCollection(e, "name")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Name"
                        />
                        <input
                          type="email"
                          value={editableCollectionInfo.email}
                          onChange={(e) =>
                            handleInputChangeCollection(e, "email")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Email"
                        />
                        <input
                          type="text"
                          value={editableCollectionInfo.contactNumber}
                          onChange={(e) =>
                            handleInputChangeCollection(e, "contactNumber")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Contact Number"
                        />
                        <input
                          type="text"
                          value={editableCollectionInfo.collectionAddress}
                          onChange={(e) =>
                            handleInputChangeCollection(e, "collectionAddress")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Address"
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <div>
                            <p className="py-1 pt-2">
                              Name:{" "}
                              {selectedCustomer.status == "accept"
                                ? "Not Available"
                                : selectedCustomer?.contactDetail?.[0]
                                    ?.collectionInfo?.name}
                            </p>
                            <p className="py-1">
                              Email :{" "}
                              {selectedCustomer.status == "accept"
                                ? selectedCustomer.email
                                : selectedCustomer?.contactDetail?.[0]
                                    ?.collectionInfo?.email}
                            </p>
                            <p className="py-1">
                              Contact:{" "}
                              {selectedCustomer.status == "accept"
                                ? "Not Available"
                                : selectedCustomer?.contactDetail?.[0]
                                    ?.collectionInfo?.contactNumber}
                            </p>
                            <p className="py-1">
                              Address:{" "}
                              {selectedCustomer.status == "accept"
                                ? selectedCustomer.collectionAddress
                                : selectedCustomer?.contactDetail?.[0]
                                    ?.collectionInfo?.collectionAddress}
                            </p>
                          </div>

                          <FaEdit
                            onClick={() => handleEditClick(1)}
                            className="text-[20px] mt-3"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-md">Intermediate Stops 1:</p>
                  <div className="py-[4px] px-7 bg-gray-400 text-black font-semibold rounded-md mt-1 text-[14px]">
                    {editMode === 3 ? (
                      <div>
                        <input
                          type="text"
                          value={editableIntermediateStops?.stopOneName}
                          onChange={(e) =>
                            handleInputChangeIntermediateStop(e, "stopOneName")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Stop Name"
                        />

                        <input
                          type="email"
                          value={editableIntermediateStops?.stopOneEmail}
                          onChange={(e) =>
                            handleInputChangeIntermediateStop(e, "stopOneEmail")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Stop Email"
                        />

                        <input
                          type="text"
                          value={
                            editableIntermediateStops?.stopOneContactNumber
                          }
                          onChange={(e) =>
                            handleInputChangeIntermediateStop(
                              e,
                              "stopOneContactNumber"
                            )
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Stop Contact Number"
                        />

                        <input
                          type="text"
                          value={editableIntermediateStops?.stopOneAddress}
                          onChange={(e) =>
                            handleInputChangeIntermediateStop(
                              e,
                              "stopOneAddress"
                            )
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Stop Address"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <div>
                          <p className="py-1 pt-2">
                            Name:
                            {
                              selectedCustomer?.contactDetail?.[0]?.deliveryInfo
                                ?.intermediateStops?.intermediateStopOne
                                ?.stopOneName
                            }
                          </p>
                          <p className="py-1">
                            Email:
                            {
                              selectedCustomer?.contactDetail?.[0]?.deliveryInfo
                                ?.intermediateStops?.intermediateStopOne
                                ?.stopOneEmail
                            }
                          </p>
                          <p className="py-1">
                            Contact No.:
                            {
                              selectedCustomer?.contactDetail?.[0]?.deliveryInfo
                                ?.intermediateStops?.intermediateStopOne
                                ?.stopOneContactNumber
                            }
                          </p>
                          <p className="py-1">
                            Address:
                            {
                              selectedCustomer?.contactDetail?.[0]?.deliveryInfo
                                ?.intermediateStops?.intermediateStopOne
                                ?.stopOneAddress
                            }
                          </p>
                        </div>
                        <FaEdit
                          onClick={() => handleEditClick(3)}
                          className="text-[20px] mt-3"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-semibold text-md">Intermediate Stops 2:</p>
                  <div className="py-[4px] px-7 bg-gray-400 text-black font-semibold rounded-md mt-1 text-[14px]">
                    {editMode === 4 ? (
                      <div>
                        <input
                          type="text"
                          value={editableIntermediateStops2.stopTwoName}
                          onChange={(e) =>
                            handleInputChangeIntermediateStop2(e, "stopTwoName")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Stop Name"
                        />

                        <input
                          type="email"
                          value={editableIntermediateStops2.stopTwoEmail}
                          onChange={(e) =>
                            handleInputChangeIntermediateStop2(
                              e,
                              "stopTwoEmail"
                            )
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Stop Email"
                        />

                        <input
                          type="text"
                          value={
                            editableIntermediateStops2?.stopTwoContactNumber
                          }
                          onChange={(e) =>
                            handleInputChangeIntermediateStop2(
                              e,
                              "stopTwoContactNumber"
                            )
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Stop Contact Number"
                        />

                        <input
                          type="text"
                          value={editableIntermediateStops2?.stopTwoAddress}
                          onChange={(e) =>
                            handleInputChangeIntermediateStop2(
                              e,
                              "stopTwoAddress"
                            )
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Stop Address"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <div>
                          <p className="py-1 pt-2">
                            Name:
                            {
                              selectedCustomer?.contactDetail?.[0]?.deliveryInfo
                                ?.intermediateStops?.intermediateStopTwo
                                ?.stopTwoName
                            }
                          </p>
                          <p className="py-1">
                            Email:
                            {
                              selectedCustomer?.contactDetail?.[0]?.deliveryInfo
                                ?.intermediateStops?.intermediateStopTwo
                                ?.stopTwoEmail
                            }
                          </p>
                          <p className="py-1">
                            Contact No.:
                            {
                              selectedCustomer?.contactDetail?.[0]?.deliveryInfo
                                ?.intermediateStops?.intermediateStopTwo
                                ?.stopTwoContactNumber
                            }
                          </p>
                          <p className="py-1">
                            Address:
                            {
                              selectedCustomer?.contactDetail?.[0]?.deliveryInfo
                                ?.intermediateStops?.intermediateStopTwo
                                ?.stopTwoAddress
                            }
                          </p>
                        </div>
                        <FaEdit
                          onClick={() => handleEditClick(4)}
                          className="text-[20px] mt-3"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-md">Delivery Location:</p>
                  <div className="py-[4px] px-7 bg-gray-400 text-black font-semibold rounded-md mt-1 text-[14px]">
                    {editMode === 2 ? (
                      <>
                        <input
                          type="text"
                          value={editableDeliveryInfo.deliveryName || ""}
                          onChange={(e) =>
                            handleInputChangeDelivery(e, "deliveryName")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Delivery Name"
                        />
                        <input
                          type="email"
                          value={editableDeliveryInfo.deliveryEmail || ""}
                          onChange={(e) =>
                            handleInputChangeDelivery(e, "deliveryEmail")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Email"
                        />
                        <input
                          type="text"
                          value={
                            editableDeliveryInfo.deliveryContactNumber || ""
                          }
                          onChange={(e) =>
                            handleInputChangeDelivery(
                              e,
                              "deliveryContactNumber"
                            )
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Phone"
                        />
                        <input
                          type="text"
                          value={editableDeliveryInfo.deliveryAddress || ""}
                          onChange={(e) =>
                            handleInputChangeDelivery(e, "deliveryAddress")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Address"
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <div>
                            <p className="py-1 pt-2">
                              Name:{" "}
                              {
                                selectedCustomer?.contactDetail?.[0]
                                  ?.deliveryInfo?.deliveryName
                              }
                            </p>
                            <p className="py-1">
                              Email:{" "}
                              {
                                selectedCustomer?.contactDetail?.[0]
                                  ?.deliveryInfo?.deliveryEmail
                              }
                            </p>
                            <p className="py-1">
                              Contact:{" "}
                              {
                                selectedCustomer?.contactDetail?.[0]
                                  ?.deliveryInfo?.deliveryContactNumber
                              }
                            </p>
                            <p className="py-1">
                              Address:{" "}
                              {
                                selectedCustomer?.contactDetail?.[0]
                                  ?.deliveryInfo?.deliveryAddress
                              }
                            </p>
                          </div>

                          <FaEdit
                            onClick={() => handleEditClick(2)}
                            className="text-[20px] mt-3"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="pt-10 font-semibold text-md">Order Detail</p>
                <div
                  className="p-4 mt-2 bg-gray-300 rounded-md text-[14px] font-semibold "
                  style={{ paddingBottom: "11rem", paddingTop: "2rem" }}
                >
                  <div className="flex gap-2 px-3 py-1">
                    <h4 className="pr-[5.3rem]">Oredre Id:</h4>
                    <p>{selectedCustomer?.shipmentId}</p>
                  </div>
                  <div className="flex gap-2 px-3 py-1">
                    <h4 className="pr-5">Oredre date & Time:</h4>
                    <p>{selectedCustomer?.orderDate}</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-md font-semibold py-1 mt-1">
                    Customer Details
                  </h2>
                  {selectedCustomer?.customerDetail?.length > 0 ? (
                    selectedCustomer?.customerDetail?.map((user, index) => (
                      <div
                        className="p-4 mt-2 bg-gray-300 rounded-md text-[14px] font-semibold "
                        style={{ paddingBottom: "10rem", paddingTop: "2rem" }}
                        key={index}
                      >
                        <div className="flex gap-2 px-3 py-1">
                          <h4 className="pr-[3.3rem]">name:</h4>
                          <p>
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                        <div className="flex overflow-clip gap-2 px-3 py-1">
                          <h4 className="pr-[3.3rem]">Email:</h4>
                          <p>{user.email}</p>
                        </div>
                        <div className="flex gap-2 px-3 py-1">
                          <h4 className="pr-[2.7rem]">Mobile:</h4>
                          <p>{user.phoneNumber}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-7">This is not customer</div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                className="mt-4 bg-[#BFA75D] font-medium text-white py-2 px-4 rounded mr-2"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="mt-4 bg-black font-medium text-white py-2 px-4 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShipmentTable;
