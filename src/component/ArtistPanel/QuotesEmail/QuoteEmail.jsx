import React, { useEffect, useState } from "react";
import halfForm from "../../json/halfForm";
import Tooltip from "../../utils/Tooltip";
import { useSelector } from "react-redux";
import LoadingPage from "../../Loader";
import { Pagination } from "../../pagination";
import { GetQuoteData } from "../Shipment/https/QuotesEmailList";

const tableHead = [
  { head: "Shipment Id" },
  { head: "Cusotmer Name" },
  { head: "Cusotmer Email" },
  { head: "Cusotmer Contact No." },
  { head: "Cusotmer Address" },
  { head: "Delivery Name" },
  { head: "Delivery Email" },
  { head: "Delivery Contact No." },
  { head: "Delivery Address" },
];

const QuoteEmail = () => {
  const { token } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { data, isLoading, isError, error } = GetQuoteData({
    token,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    if (data) {
      setCurrentPage(data.paginationData.page);
    }
  }, []);

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
        <h1 className="text-2xl font-semibold mb-10">
          Quotes Email Information
        </h1>
        {data?.data?.length > 0 ? (
          <div>
            <div className="overflow-x-auto">
              <table className="table-auto bg-white w-full border-collapse border border-gray-300">
                <thead className="bg-black text-white text-left">
                  <tr>
                    {tableHead.map((item, index) => (
                      <th
                        key={index}
                        className="px-2 py-3 text-sm font-semibold text-center"
                      >
                        {item.head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.map(
                    ({ contactDetail, shipmentId }, index, item) => (
                      <tr key={index} className="border-t border-gray-300">
                        <td className="px-2 py-3 text-[#12223D] font-normal">
                          <Tooltip text={"collectionInfoname"} position="top">
                            <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2 text-center">
                              {shipmentId}
                            </p>
                          </Tooltip>
                        </td>
                        <td className="px-2 py-3 text-[#12223D] font-normal text-center">
                          <Tooltip
                            text={contactDetail.collectionInfo?.name}
                            position="top"
                          >
                            <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2 text-center">
                              {contactDetail.collectionInfo?.name}
                            </p>
                          </Tooltip>
                        </td>
                        <td className="px-2 py-3 text-[#12223D] font-normal text-center">
                          <Tooltip
                            text={contactDetail.collectionInfo?.email}
                            position="top"
                          >
                            <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2 text-center ">
                              {contactDetail.collectionInfo?.email}
                            </p>
                          </Tooltip>
                        </td>
                        <td className="px-2 py-3 text-[#12223D] font-normal text-center">
                          <Tooltip
                            text={contactDetail.collectionInfo?.contactNumber}
                            position="top"
                          >
                            <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2 text-center">
                              {contactDetail.collectionInfo?.contactNumber}
                            </p>
                          </Tooltip>
                        </td>
                        <td className="px-2 py-3 text-[#12223D] font-normal text-center">
                          <Tooltip
                            text={
                              contactDetail.collectionInfo?.collectionAddress
                            }
                            position="top"
                          >
                            <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2 text-center">
                              {contactDetail.collectionInfo?.collectionAddress}
                            </p>
                          </Tooltip>
                        </td>
                        <td className="px-2 py-3 text-[#12223D] font-normal text-center">
                          <Tooltip
                            text={contactDetail.deliveryInfo?.deliveryName}
                            position="top"
                          >
                            <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2 text-center">
                              {contactDetail.deliveryInfo?.deliveryName}
                            </p>
                          </Tooltip>
                        </td>
                        <td className="px-2 py-3 text-[#12223D] font-normal text-center">
                          <Tooltip
                            text={contactDetail.deliveryInfo?.deliveryEmail}
                            position="top"
                          >
                            <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2 text-center">
                              {contactDetail.deliveryInfo?.deliveryEmail}
                            </p>
                          </Tooltip>
                        </td>
                        <td className="px-2 py-3 text-[#12223D] font-normal text-center">
                          <Tooltip
                            text={
                              contactDetail.deliveryInfo?.deliveryContactNumber
                            }
                            position="top"
                          >
                            <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                              {
                                contactDetail.deliveryInfo
                                  ?.deliveryContactNumber
                              }
                            </p>
                          </Tooltip>
                        </td>
                        <td className="px-2 py-3 text-[#12223D] font-normal text-center">
                          <Tooltip
                            text={contactDetail.deliveryInfo?.deliveryAddress}
                            position="top"
                          >
                            <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                              {contactDetail.deliveryInfo?.deliveryAddress}
                            </p>
                          </Tooltip>
                        </td>
                      </tr>
                    )
                  )}
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

export default QuoteEmail;
