// import React, { useEffect, useState } from "react";
// import halfForm from "../../json/halfForm";
// import Tooltip from "../../utils/Tooltip";
// import { useSelector } from "react-redux";
// import { GetRequestData } from "./https/GetRequistList";
// import LoadingPage from "../../Loader";
// import Pagination from "../../paginaton";

// const tableHead = [
//   { head: "Id" },
//   { head: "Email" },
//   { head: "Vehicle Type" },
//   { head: "Order Date & Time" },
//   { head: "Pickup Date & Time" },
//   { head: "From" },
//   { head: "To" },
//   { head: "Note" },
// ];

// const Request = () => {
//   const {token} = useSelector((state) => state.user)
//   const [requestData,setRequestData] = useState([])
//   const [currentPage, setCurrentPage] = useState(1);
//   const {data,isLoading,isError,error} = GetRequestData({token})
//   const ITEMS_PER_PAGE = 10

//   useEffect(() => {
//      if(data){
//       setRequestData(data)
//      }
//   },[data])

//   const totalPages = Math.ceil(requestData.length / ITEMS_PER_PAGE);
//   const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
//   const currentData = requestData.slice(startIdx, startIdx + ITEMS_PER_PAGE);
//   console.log(requestData)

//   if(isLoading){
//     return <LoadingPage/>
//   }
//   if(isError){
//     return <p>{error?.response?.data?.message}</p>
//   }

//   return (
//     <>
//       <div className="w-full">
//         <h1 className="text-2xl font-semibold mb-10">Requests</h1>
//         <div className=" overflow-x-auto">
//           <table className="table-auto bg-white w-full border-collapse border border-gray-300">
//             <thead className="bg-black text-white text-left">
//               <tr className="text-white">
//                 {tableHead.map((item, index) => (
//                   <th
//                     key={index}
//                     className="px-2 py-3 text-sm font-semibold text-left"
//                   >
//                     {item.head}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {currentData.map((data, index) => (
//                 <tr key={index} className="border-t border-gray-300">
//                   <td className="px-2 py-3 text-[#12223D] font-normal">
//                     <p className="w-10 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
//                       {data.shipmentId}
//                     </p>
//                   </td>
//                   <td className="px-2 py-3 text-[#12223D] font-normal">
//                     <Tooltip text={data.email} position="top">
//                       <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace- line-clamp-2">
//                         {data.email}
//                       </p>
//                     </Tooltip>
//                   </td>
// <td className="px-2 py-3 text-[#12223D] font-normal">
//   <Tooltip text={data.vehicle} position="top">
//     <p className="w-24 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
//       {data.vehicleType}
//     </p>
//   </Tooltip>
// </td>
//                   <td className="p-2">
//                     <Tooltip text={data.timeAnddate} position="top">
//                       <p className="w-32 text-sm text-ellipsis whitespace-nowrap">
//                         {data.orderDate}
//                       </p>
//                     </Tooltip>
//                   </td>
//                   <td className="p-2">
//                     <Tooltip text={data.timeAnddate} position="top">
//                       <p className="w-32 text-sm text-ellipsis whitespace-nowrap">
//                         {data.pickUpDateAndTime}
//                       </p>
//                     </Tooltip>
//                   </td>
//                   <td className="p-2">
//                     <Tooltip text={data.pickup} position="top">
//                       <p className="w-44 text-sm overflow-hidden text-ellipsis whitespace-wrap line-clamp-2">
//                         {data.collectionAddress}
//                       </p>
//                     </Tooltip>
//                   </td>
//                   <td className="p-2">
//                     <Tooltip text={data.dropOf} position="top">
//                       <p className="w-44 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
//                         {data.deliveryAddress}
//                       </p>
//                     </Tooltip>
//                   </td>
//                   <td className="p-2">
//                     <Tooltip text={data.notes} position="top">
//                       <p className="w-44 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
//                         {data.notes}
//                       </p>
//                     </Tooltip>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {/* <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={setCurrentPage}
//         /> */}
//       </div>
//     </>
//   );
// };

// export default Request;

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

const tableHead = [
  { head: "Id" },
  { head: "Email" },
  { head: "Vehicle Type" },
  { head: "Order Date & Time" },
  { head: "Pickup Date & Time" },
  { head: "From" },
  { head: "To" },
  { head: "Note" },
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

  // Open modal handler for Send Price
  const openModal = (id, email) => {
    setIsModalOpen(true);
    setCurrentRequest({ id, email });
  };

  // Close modal handler
  const closeModal = () => setIsModalOpen(false);

  // Handle Send Price submit
  const handleSubmit = () => {
    const { id, email } = currentRequest;
    handleSendEmail(id, email, price);
    closeModal(); // Close the modal after sending the price
  };

  // Handle Send Price Email
  const handleSendEmail = async (id, email, price) => {
    try {
      const response = await axios.post(
        `${requestendpoints.Send_Email_Quote}/${id}`,
        { email: email, price: price }, // send price along with the email and id
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowConfirmModal(false);
      toast.success("Price sent successfully!");
    } catch (error) {
      console.error("Error sending price:", error);
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
      console.error("Error rejecting quote:", error);
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
      console.error("Error accepting quote:", error);
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

  // Modal for confirming rejection
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
                        <Tooltip text={request.email} position="top">
                          <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.email}
                          </p>
                        </Tooltip>
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
                        <Tooltip
                          text={request.collectionAddress}
                          position="top"
                        >
                          <p className="w-44 text-sm overflow-hidden text-ellipsis whitespace-wrap line-clamp-2">
                            {request.collectionAddress}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Tooltip text={request.deliveryAddress} position="top">
                          <p className="w-44 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.deliveryAddress}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Tooltip text={request.notes} position="top">
                          <p className="w-44 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.notes}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="px-1 py-2 flex gap-2">
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl mb-4">Enter Price</h2>
            <input
              type="number"
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
