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
  const [selectedCustomer, setSelectedCustomer] = useState([]);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [statuss, setStatus] = useState("");
  const [shipmentIds, setShipmentIds] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editableCollectionInfo, setEditableCollectionInfo] = useState({
    name: "",
    email: " ",
    contactNumber: "",
    collectionAddress: "",
  });

  const [editableDeliveryInfo, setEditableDeliveryInfo] = useState({
    deliveryName: "",
    deliveryEmail: "",
    deliveryContactNumber: "",
    deliveryAddress: "",
  });

  const [editableIntermediateStops2, setEditableIntermediateStops2] = useState({
    stopTwoName: "",
    stopTwoEmail: "",
    stopTwoContactNumber: "",
    stopTwoAddress: "",
  });

  const [editableIntermediateStops, setEditableIntermediateStops] = useState([
    {
      stopName1: "",
      stopEmail1: "",
      stopContactNumber1: "",
      stopAddress1: "",
    },
  ]);
  const [intermediateStops, setIntermediateStops] = useState([
    { stopName: "", stopEmail: "", stopContactNumber: "", stopAddress: "" },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedStops = [...intermediateStops];
    updatedStops[index][field] = value;
    setIntermediateStops(updatedStops);
  };

  const handleAddStop = () => {
    setIntermediateStops([
      ...intermediateStops,
      { stopName: "", stopEmail: "", stopContactNumber: "", stopAddress: "" },
    ]);
  };
  const handleRemoveStop = (index) => {
    const updatedStops = editableIntermediateStops.filter(
      (_, i) => i !== index
    );
    setEditableIntermediateStops(updatedStops);
  };

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

  if (isLoading) {
    return <LoadingPage />;
  }
  if (isError) {
    return <p>{error?.response?.data?.message}</p>;
  }
  const handleClick = async (user, stat) => {
    try {
      setIsModalOpen(true);
      const response = await axios.get(
        `${shipmentendpoints.SHIPMENT_DELIVERY_DETAIL}/${user}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.data) {
        const obj = {};
        const res = response.data.data;
        setShipmentIds(res._id);
        if (res.quoteStatus === "half") {
          obj.contactDetail = [];
          const contactDetail = {};

          contactDetail.collectionInfo = {
            name: "",
            email: res.email,
            contactNumber: "",
            collectionAddress: res.collectionAddress,
          };
          contactDetail.deliveryInfo = {
            deliveryName: "",
            deliveryEmail: "",
            deliveryContactNumber: "",
            deliveryAddress: res.deliveryAddress,
          };
          contactDetail.intermediateStops = {
            stopName: res.stopName,
            stopEmail: res.stopEmail,
            stopContactNumber: res.stopContactNumber,
            stopAddress: res.stopAddress,
          };

          obj.contactDetail.push(contactDetail);
        } else {
          obj.contactDetail = [];
          const contactDetail = {};

          contactDetail.collectionInfo = {
            name: res.contactDetail?.[0]?.collectionInfo.name,
            email: res.contactDetail?.[0]?.collectionInfo.email,
            contactNumber: res.contactDetail?.[0]?.collectionInfo.contactNumber,
            collectionAddress:
              res.contactDetail?.[0]?.collectionInfo.collectionAddress,
          };
          contactDetail.deliveryInfo = {
            deliveryName: res.contactDetail?.[0]?.deliveryInfo.deliveryName,
            deliveryEmail: res.contactDetail?.[0]?.deliveryInfo.deliveryEmail,
            deliveryContactNumber:
              res.contactDetail?.[0]?.deliveryInfo.deliveryContactNumber,
            deliveryAddress:
              res.contactDetail?.[0]?.deliveryInfo.deliveryAddress,
          };
          contactDetail.intermediateStops = {
            stopName: res.stopName,
            stopEmail: res.stopEmail,
            stopContactNumber: res.stopContactNumber,
            stopAddress: res.stopAddress,
          };
          obj.contactDetail.push(contactDetail);
        }

        setSelectedCustomer(response.data.data);

        preFillData(obj);
        if (stat == "half") {
          setStatus(response.data.data.quoteStatus);
        }
        localStorage.setItem("formId", response.data.data._id);
        setIsModalOpen(true);
      } else {
      }
    } catch (error) {
      throw error;
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

  const preFillData = (customerData) => {
    setEditableCollectionInfo({
      ...customerData?.contactDetail?.[0]?.collectionInfo,
    });

    setEditableDeliveryInfo({
      ...customerData?.contactDetail?.[0]?.deliveryInfo,
    });

    if (customerData?.contactDetail?.[0]?.deliveryInfo?.intermediateStops) {
      const stopsData =
        customerData.contactDetail[0].deliveryInfo.intermediateStops;
      const formattedStops = stopsData.map((stop) => ({
        stopName: stop.stopName || "",
        stopEmail: stop.stopEmail || "",
        stopContactNumber: stop.stopContactNumber || "",
        stopAddress: stop.stopAddress || "",
      }));
      setIntermediateStops(formattedStops);
    }
  };

  const handleEditClick = (mode) => {
    console.log("selectedCustomerselectedCustomer", selectedCustomer);

    setEditMode(mode);
    preFillData(selectedCustomer);
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        contactDetail: {
          collectionInfo: editableCollectionInfo,
          deliveryInfo: {
            ...editableDeliveryInfo,
            intermediateStops,
          },
          quoteStatus: statuss,
        },
      };

      const response = await axios.put(
        `${shipmentendpoints.UPDATE_SHIPMENT_STOP}/${shipmentIds}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditMode(null);
      if (response.status === 200) {
        // setIsModalOpen(false);
        // window.location.reload();
        closeModal();
      }
    } catch (error) {
      throw error;
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
                        {user.quoteStatus === "half" ? (
                          <p className="text-sm">Not Available</p>
                        ) : (
                          user?.contactDetail?.map((detail) =>
                            detail?.collectionInfo ? (
                              <div key={detail?.collectionInfo.name}>
                                <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                                  {detail?.collectionInfo.name
                                    ? detail?.collectionInfo.name
                                    : "Not Available"}
                                </p>
                              </div>
                            ) : null
                          )
                        )}
                      </td>
                      <td className="p-2">
                        {user.quoteStatus === "half" ? (
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
                        {user.quoteStatus === "half" ? (
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
                        {user.quoteStatus === "half" ? (
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
                        {user.quoteStatus === "half" ? (
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
                              "Not Available"
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
                                : "Not Available"
                            }`}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="p-2">
                        {user.quoteStatus === "half" ? (
                          <p className="w-90 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {user?.deliveryAddress}
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
                              handleClick(user._id, user.quoteStatus === "half")
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
                          value={
                            editableCollectionInfo.name ||
                            selectedCustomer?.contactDetail?.[0]?.collectionInfo
                              ?.name
                          }
                          onChange={(e) =>
                            handleInputChangeCollection(e, "name")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Name"
                        />
                        <input
                          type="email"
                          value={
                            editableCollectionInfo.email ||
                            selectedCustomer.contactDetail?.[0]?.collectionInfo
                              .email
                          }
                          onChange={(e) =>
                            handleInputChangeCollection(e, "email")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Email"
                        />
                        <input
                          type="number"
                          value={
                            editableCollectionInfo.contactNumber ||
                            selectedCustomer?.contactDetail?.[0]?.collectionInfo
                              ?.contactNumber
                          }
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
                              {selectedCustomer.quoteStatus == "half"
                                ? "Not Available"
                                : selectedCustomer.contactDetail?.[0]
                                    .collectionInfo.name}
                            </p>
                            <p className="py-1">
                              Email :{" "}
                              {selectedCustomer.quoteStatus == "half"
                                ? selectedCustomer.email
                                : selectedCustomer?.contactDetail?.[0]
                                    ?.collectionInfo?.email}
                            </p>
                            <p className="py-1">
                              Contact:{" "}
                              {selectedCustomer.quoteStatus == "half"
                                ? "Not Available"
                                : selectedCustomer?.contactDetail?.[0]
                                    ?.collectionInfo?.contactNumber}
                            </p>
                            <p className="py-1">
                              Address:{" "}
                              {selectedCustomer.quoteStatus == "half"
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
                  <p className="font-semibold text-md">Intermediate Stops:</p>
                  <div className="py-[4px] px-7 bg-gray-400 text-black font-semibold rounded-md mt-4 text-[14px]">
                    {editMode === 3 ? (
                      <>
                        {intermediateStops.map((stop, index) => (
                          <div
                            key={index}
                            className="mb-2 py-3 border p-2 rounded bg-gray-300 mt-4"
                          >
                            <input
                              type="text"
                              value={stop.stopName}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "stopName",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                              placeholder="Stop Name"
                            />
                            <input
                              type="email"
                              value={stop.stopEmail}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "stopEmail",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                              placeholder="Stop Email"
                            />
                            <input
                              type="number"
                              value={stop.stopContactNumber}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "stopContactNumber",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                              placeholder="Stop Contact Number"
                            />
                            <input
                              type="text"
                              value={stop.stopAddress}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "stopAddress",
                                  e.target.value
                                )
                              }
                              className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                              placeholder="Stop Address"
                            />
                          </div>
                        ))}
                        <div className="w-full flex justify-end my-2">
                          <button
                            onClick={handleAddStop}
                            className="mt-4 bg-black font-medium text-white py-2 px-4 rounded"
                          >
                            Add Stop
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex py-4">
                        <div className="w-full">
                          {selectedCustomer?.contactDetail?.[0]?.deliveryInfo?.intermediateStops?.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="mb-2 border p-2 rounded bg-gray-300 ml-[1rem]
"
                              >
                                <p className="py-1 pt-2">
                                  Name: {item.stopName}
                                </p>
                                <p className="py-1">Email: {item.stopEmail}</p>
                                <p className="py-1">
                                  Contact: {item.stopContactNumber}
                                </p>
                                <p className="py-1">
                                  Address: {item.stopAddress}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                        <FaEdit
                          onClick={() => handleEditClick(3)}
                          className="text-[20px] ml-3 mt-3"
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
                          value={editableDeliveryInfo.deliveryEmail || " "}
                          onChange={(e) =>
                            handleInputChangeDelivery(e, "deliveryEmail")
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Email"
                        />
                        <input
                          type="number"
                          value={
                            editableDeliveryInfo.deliveryContactNumber || " "
                          }
                          onChange={(e) =>
                            handleInputChangeDelivery(
                              e,
                              "deliveryContactNumber"
                            )
                          }
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          placeholder="Contact Number"
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
                              {selectedCustomer.quoteStatus == "half"
                                ? "Not Available"
                                : selectedCustomer?.contactDetail?.[0]
                                    ?.deliveryInfo?.deliveryName}
                            </p>
                            <p className="py-1">
                              Email:{" "}
                              {selectedCustomer.quoteStatus == "half"
                                ? "Not Available"
                                : selectedCustomer?.contactDetail?.[0]
                                    ?.deliveryInfo?.deliveryEmail}
                            </p>
                            <p className="py-1">
                              Contact:{" "}
                              {selectedCustomer.quoteStatus == "half"
                                ? "Not Available"
                                : selectedCustomer?.contactDetail?.[0]
                                    ?.deliveryInfo?.deliveryContactNumber}
                            </p>
                            <p className="py-1">
                              Address:{" "}
                              {selectedCustomer.quoteStatus == "half"
                                ? selectedCustomer.deliveryAddress
                                : selectedCustomer?.contactDetail?.[0]
                                    ?.deliveryInfo?.deliveryAddress}
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

                          {user.phoneNumber == undefined ? (
                            <p>{user.phoneNumber}</p>
                          ) : (
                            "not available"
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-7">Customer is not available</div>
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
