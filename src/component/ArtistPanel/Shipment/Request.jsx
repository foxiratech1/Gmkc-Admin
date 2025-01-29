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

const tableHead = [
  { head: "Id" },
  { head: "Email" },
  { head: "Vehicle Type" },
  { head: "Order Date & Time" },
  { head: "Pickup Date & Time" },
  { head: "From" },
  { head: "To" },
  { head: "Note" },
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

  return (
    <>
      <div className="w-full h-full">
        <h1 className="text-2xl font-semibold mb-10">Quotes</h1>
        {data?.data?.length > 0 ? (
          <div>
            <div className="overflow-x-auto">
              <table className="table-auto bg-white w-full border-collapse border border-gray-300">
                <thead className="bg-black text-white text-left">
                  <tr>
                    {tableHead.map((item, index) => (
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
                  {data?.data?.map((request, index) => (
                    <tr key={index} className="border-t border-gray-300">
                      <td className="px-2 py-3 text-[#12223D] font-normal">
                        <Tooltip text={request.shipmentId} position="top">
                          <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.shipmentId}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="px-2 py-3 text-[#12223D] font-normal">
                        <Tooltip text={request.email} position="top">
                          <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.email}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="px-2 py-3 text-[#12223D] font-normal">
                        <Tooltip text={request.vehicleType} position="top">
                          <p className="w-24 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.vehicleType}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="p-2">
                        <Tooltip text={request.orderDate} position="top">
                          <p className="w-32 text-sm text-ellipsis whitespace-nowrap">
                            {request.orderDate}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="p-2">
                        <Tooltip
                          text={request.pickUpDateAndTime}
                          position="top"
                        >
                          <p className="w-32 text-sm text-ellipsis whitespace-nowrap">
                            {request.pickUpDateAndTime}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="p-2">
                        <Tooltip
                          text={request.collectionAddress}
                          position="top"
                        >
                          <p className="w-44 text-sm overflow-hidden text-ellipsis whitespace-wrap line-clamp-2">
                            {request.collectionAddress}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="p-2">
                        <Tooltip text={request.deliveryAddress} position="top">
                          <p className="w-44 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.deliveryAddress}
                          </p>
                        </Tooltip>
                      </td>
                      <td className="p-2">
                        <Tooltip text={request.notes} position="top">
                          <p className="w-44 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {request.notes}
                          </p>
                        </Tooltip>
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
          <div>
            <p className="flex text-center text-gray-700">
              Request list is empty
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Request;
