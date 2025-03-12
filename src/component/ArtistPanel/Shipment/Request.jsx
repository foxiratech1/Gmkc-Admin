import React, { useEffect, useState } from "react";
import halfForm from "../../json/halfForm";
import Tooltip from "../../utils/Tooltip";
import { useSelector } from "react-redux";
import { GetRequestData } from "./https/GetRequistList";
import LoadingPage from "../../Loader";
import { Pagination } from "../../pagination";
import { requestendpoints } from "../../../services/apis";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoEye } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";

const tableHead = [
  { head: "Id" },
  { head: "Email" },
  { head: "Vehicle Type" },
  { head: "Order Date & Time" },
  { head: "Pickup Date & Time" },
  { head: "From" },
  { head: "To" },
  { head: "Note" },
  { head: "View" },
  { head: "Actions" },
];

const Request = () => {
  const { token } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { data, isLoading, isError, error } = GetRequestData({
    token,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [quoteIdToReject, setQuoteIdToReject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState("");
  const navigate = useNavigate();
  const [currentRequest, setCurrentRequest] = useState({
    id: null,
    email: null,
  });
  const [showModal1, setShowModal1] = useState(false);
  const [currentRequest1, setCurrentRequest1] = useState(null);

  const openModal1 = (id, data) => {
    console.log("datadata", data);

    setCurrentRequest1({ id, data });
    setShowModal1(true);
  };

  const closeModal1 = () => {
    setShowModal1(false);
    setCurrentRequest1(null);
  };

  const openModal = (id, email) => {
    setIsModalOpen(true);
    setCurrentRequest({ id, email });
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = () => {
    const { id, email } = currentRequest;
    handleSendEmail(id, email, price);
    closeModal();
  };

  const handleSendEmail = async (id, email, price) => {
    try {
      const response = await axios.post(
        `${requestendpoints.Send_Email_Quote}/${id}`,
        { email: email, price: price },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowConfirmModal(false);
      setPrice("");
      toast.success("Price sent successfully!");
    } catch (error) {
      setShowConfirmModal(false);
    }
  };

  const handleRejectQuote = async (id) => {
    try {
      const response = await axios.delete(
        `${requestendpoints.Reject_Quote}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowConfirmModal(false);
      toast.success("Quote rejected successfully!");
      window.location.reload();
    } catch (error) {
      setShowConfirmModal(false);
    }
  };

  const handleAcceptQuote = async (id) => {
    try {
      const response = await axios.put(
        `${requestendpoints.Accept_Quote}/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/shipment");
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (data) {
      setCurrentPage(data.paginationData.page);
    }
  }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <LoadingPage />;
  }
  if (isError) {
    return <p>{error?.response?.data?.message}</p>;
  }

  const ConfirmRejectModal = ({ isOpen, onClose, onConfirm, id }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-lg">
          <h3 className="text-lg font-semibold mb-4">
            Are you sure you want to reject this quote?
          </h3>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md mr-2"
              onClick={() => onConfirm(id)}
            >
              Confirm
            </button>
            <button
              className="px-4 py-2 bg-gray-300 text-black rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full h-full p-4">
        <h1 className="text-3xl font-semibold mb-6 text-[#1D3557]">Quotes</h1>
        {data?.data?.length > 0 ? (
          <div>
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="table-auto bg-white w-full border-collapse border border-gray-300 rounded-lg">
                <thead className="bg-black text-white text-left">
                  <tr>
                    {tableHead.map((item, index) => (
                      <th
                        key={index}
                        className="px-4 py-4 text-sm font-semibold text-center"
                      >
                        {item.head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.map((request, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-300 hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 text-[#12223D] font-normal">
                        <Tooltip text={request.shipmentId} position="top">
                          <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.shipmentId}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-4 text-[#12223D] font-normal">
                        {request.quoteStatus === "half" ? (
                          <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.email}
                          </p>
                        ) : (
                          request?.contactDetail?.map((detail) =>
                            detail.collectionInfo ? (
                              <div key={detail.collectionInfo.email}>
                                <Tooltip
                                  text={detail.collectionInfo.email}
                                  position="top"
                                >
                                  <p className="w-56 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                                    {detail.collectionInfo.email
                                      ? detail.collectionInfo.email
                                      : "Not Available"}
                                  </p>
                                </Tooltip>
                              </div>
                            ) : null
                          )
                        )}
                      </td>
                      <td className="px-4 py-4 text-[#12223D] font-normal">
                        <Tooltip text={request.vehicleType} position="top">
                          <p className="w-24 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.vehicleType}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-4">
                        <Tooltip text={request.orderDate} position="top">
                          <p className="w-32 text-sm text-ellipsis whitespace-nowrap">
                            {request.orderDate}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-4">
                        <Tooltip
                          text={request.pickUpDateAndTime}
                          position="top"
                        >
                          <p className="w-32 text-sm text-ellipsis whitespace-nowrap">
                            {request.pickUpDateAndTime}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {request.quoteStatus === "half" ? (
                          <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.collectionAddress}
                          </p>
                        ) : (
                          request?.contactDetail?.map((detail) =>
                            detail.collectionInfo ? (
                              <div
                                key={detail.collectionInfo.collectionAddress}
                              >
                                <Tooltip
                                  text={detail.collectionAddress}
                                  position="top"
                                >
                                  <p className="w-56 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                                    {detail.collectionInfo.collectionAddress
                                      ? detail.collectionInfo.collectionAddress
                                      : "Not Available"}
                                  </p>
                                </Tooltip>
                              </div>
                            ) : null
                          )
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {request.quoteStatus === "half" ? (
                          <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.deliveryAddress}
                          </p>
                        ) : (
                          request?.contactDetail?.map((detail) =>
                            detail.deliveryInfo ? (
                              <div key={detail.deliveryInfo.deliveryAddress}>
                                <Tooltip
                                  text={detail.deliveryAddress}
                                  position="top"
                                >
                                  <p className="w-56 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                                    {detail.deliveryInfo.deliveryAddress
                                      ? detail.deliveryInfo.deliveryAddress
                                      : "Not Available"}
                                  </p>
                                </Tooltip>
                              </div>
                            ) : null
                          )
                        )}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <Tooltip text={request.notes} position="top">
                          <p className="w-44 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.notes}
                          </p>
                        </Tooltip>
                      </td>
                      <td>
                        <button
                          onClick={() => openModal1(request._id, request)}
                          className="text-yellow-300 text-[20px] hover:cursor-pointer"
                        >
                          <MdOutlineRemoveRedEye size={20} />
                        </button>
                      </td>

                      <td className="px-1 py-2 flex gap-2 mt-3">
                        <button
                          className=" bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition duration-200"
                          onClick={() => handleAcceptQuote(request._id)}
                          style={{ padding: "5px 14px" }}
                        >
                          Accept
                        </button>
                        <button
                          className=" bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition duration-200"
                          onClick={() => {
                            setQuoteIdToReject(request._id);
                            setShowConfirmModal(true);
                          }}
                          style={{ padding: "5px 14px" }}
                        >
                          Reject
                        </button>
                        <button
                          className=" bg-[#BFA75D] text-white text-sm rounded-md hover:bg-[#BFA75D] transition duration-200 "
                          style={{ padding: "5px 14px", width: "100px" }}
                          onClick={() => openModal(request._id, request.email)}
                        >
                          Send Price
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={data?.paginationData?.totalPages}
              totalCount={data?.totalCounts}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="flex justify-center text-gray-700">
            <p>No requests available</p>
          </div>
        )}
      </div>

      <ConfirmRejectModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleRejectQuote}
        id={quoteIdToReject}
      />

      {showModal1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[95%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Quotes Stops Detail</h2>

            {/* Pickup Location */}
            <div className="mb-4 bg-gray-300 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">Pickup Location:</h3>
                <p>
                  Name:{" "}
                  {
                    currentRequest1?.data?.contactDetail[0]?.collectionInfo
                      ?.name
                  }
                </p>
                <p>
                  Email:{" "}
                  {
                    currentRequest1?.data?.contactDetail[0]?.collectionInfo
                      ?.email
                  }
                </p>
                <p>
                  Contact:{" "}
                  {
                    currentRequest1?.data?.contactDetail[0]?.collectionInfo
                      ?.contactNumber
                  }
                </p>
                <p>
                  Address:{" "}
                  {
                    currentRequest1?.data?.contactDetail[0]?.collectionInfo
                      ?.collectionAddress
                  }
                </p>
                <p>
                  Stairs:{" "}
                  {
                    currentRequest1?.data?.contactDetail[0]?.collectionInfo
                      ?.stairs
                  }
                </p>
              </div>
            </div>

            {/* Intermediate Stops */}
            <div className="mb-4 bg-gray-200 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Intermediate Stops:</h3>
              {currentRequest1?.data?.contactDetail[0]?.deliveryInfo
                .intermediateStops?.length > 0 ? (
                currentRequest1?.data?.contactDetail[0]?.deliveryInfo.intermediateStops.map(
                  (stop, index) => (
                    <div
                      key={index}
                      className="bg-gray-300 p-3 rounded-lg mb-2 flex justify-between items-center"
                    >
                      <div>
                        <p>Name: {stop.stopName}</p>
                        <p>Email: {stop.stopEmail}</p>
                        <p>Contact: {stop.stopContactNumber}</p>
                        <p>Address: {stop.stopAddress}</p>
                        <p>Stairs: {stop.stairs}</p>
                      </div>
                    </div>
                  )
                )
              ) : (
                <p>No intermediate stops</p>
              )}
            </div>
            <div className="mb-4 bg-gray-300 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">Delivery Location:</h3>
                <p>
                  Name:{" "}
                  {
                    currentRequest1?.data?.contactDetail[0]?.deliveryInfo
                      ?.deliveryName
                  }
                </p>
                <p>
                  Email:{" "}
                  {
                    currentRequest1?.data?.contactDetail[0]?.deliveryInfo
                      ?.deliveryEmail
                  }
                </p>
                <p>
                  Contact:{" "}
                  {
                    currentRequest1?.data?.contactDetail[0]?.deliveryInfo
                      ?.deliveryContactNumber
                  }
                </p>
                <p>
                  Address:{" "}
                  {
                    currentRequest1?.data?.contactDetail[0]?.deliveryInfo
                      ?.deliveryAddress
                  }
                </p>
                <p>
                  Stairs:{" "}
                  {
                    currentRequest1?.data?.contactDetail[0]?.deliveryInfo
                      ?.deliveryStairs
                  }
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={closeModal1}
                className="mt-4 bg-black font-medium text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl mb-4">Enter Price</h2>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#BFA75D] text-white px-4 py-2 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Request;
