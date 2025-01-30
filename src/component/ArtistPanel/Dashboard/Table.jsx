import { useEffect, useState } from "react";
import Tooltip from "../../utils/Tooltip";
import OpenModalButton from "../../utils/OpenModalBtn";
import { AiFillDelete } from "react-icons/ai";
import DeleteModal from "../../utils/DeleteModal";

import { useSelector } from "react-redux";
import { Pagination } from "../../pagination";
import LoadingPage from "../../Loader";
import { DeleteShipment } from "./https/deleteShipment";

const table_head = [
  { head: "Id" },
  { head: "Customer Name" },
  { head: "Email" },
  { head: "Phone" },
  { head: "Order Date & Time" },
  { head: "Vehicle Type" },
  { head: "Pickup Location" },
  { head: "Pickup Date & Time" },
  { head: "Drop Off Location" },
  { head: "Action" },
];

const Table = ({ shipmentData, currentPage, setCurrentPage, data }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  // const [shipmentData, setShipmentData] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const { token } = useSelector((state) => state.user);
  // const [currentPage, setCurrentPage] = useState(1);

  // const ITEMS_PER_PAGE = 10
  const { mutateAsync, isPending } = DeleteShipment();
  // const { data, isLoading, isError, error } = GetAllShipmentData({
  //   token,
  //   page: currentPage,
  //   limit: ITEMS_PER_PAGE,
  // });
  // useEffect(() => {
  //   if (data) {
  //     setShipmentData(data?.data)
  //     setCurrentPage(data.paginationData.page);
  //   }
  // }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteModalOpen(true);
    setDeleteIndex(id);
  };

  const confirmDeleteshipment = async () => {
    // console.log(deleteIndex,"ing")
    await mutateAsync({ id: deleteIndex, token });
    setDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  const confirmDelete = () => {
    const updatedData = data.filter((_, index) => index !== deleteIndex);
    console.log("updatedData", updatedData);
    setData(updatedData);
    setDeleteModalOpen(false);
  };
  //  if(isLoading){
  //   return <LoadingPage/>
  //  }

  //  if(isError){
  //   return <p>{error?.response?.data?.message}</p>
  //  }
  return (
    <div className="rounded-lg mt-6">
      <h1 className="text-2xl mb-5 font-semibold text-[#333843] leading-7">
        All Shipments
      </h1>
      {shipmentData?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-black">
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
              {shipmentData?.map((user, index) => (
                <tr key={index} className="bg-white border-b border-[#C2C2C2]">
                  <td className="p-2">
                    <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {user.shipmentId}
                    </p>
                  </td>
                  <td className="p-2">
                    {/* <Tooltip text={user.customerName} position="top">
                    <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {user.customerName}
                    </p>
                  </Tooltip> */}
                    {user.status === "accept" ? (
                      <p className="text-sm">
                        <p className="text-sm">Not Available</p>
                      </p>
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
                    <Tooltip text={user.email} position="top">
                      <p className="w-56 overflow-hidden text-sm text-ellipsis whitespace-wrap">
                        {user.email}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    {/* <Tooltip text={user.phone} position="top">
                    <p className="w-28 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {user.phone}
                    </p>
                  </Tooltip> */}
                    {user.status === "accept" ? (
                      <p className="text-sm">
                        <p className="text-sm">Not Available</p>
                      </p>
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
                  <td className="p-2">
                    <Tooltip text={`${user.orderDate}`} position="top">
                      <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                        {`${user.orderDate}`}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.vehicleType} position="top">
                      <p className="w-20 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                        {user.vehicleType}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    {/* <Tooltip text={user.pickupLocation} position="top">
                    <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                      {user.pickupLocation}
                    </p>
                  </Tooltip> */}
                    {user.status === "accept" ? (
                      <p className="text-sm">
                        <p className="text-sm">{user.collectionAddress}</p>
                      </p>
                    ) : (
                      user?.contactDetail?.map((detail) =>
                        detail.collectionInfo ? (
                          <Tooltip
                            key={detail.collectionInfo.collectionAddress}
                            text={detail.collectionInfo.collectionAddress}
                            position="top"
                          >
                            <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                              {detail.collectionInfo.collectionAddress}
                            </p>
                          </Tooltip>
                        ) : null
                      )
                    )}
                  </td>
                  <td className="p-2">
                    <Tooltip text={`${user.pickUpDateAndTime}`} position="top">
                      <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                        {`${
                          user.pickUpDateAndTime ? user.pickUpDateAndTime : null
                        }`}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    {user.status === "accept" ? (
                      <p className="text-sm">
                        <p className="text-sm">{user.deliveryAddress}</p>
                      </p>
                    ) : (
                      user?.contactDetail?.map((detail) =>
                        detail.deliveryInfo ? (
                          <Tooltip
                            key={detail.deliveryInfo.deliveryAddress}
                            text={detail.deliveryInfo.deliveryAddress}
                            position="top"
                          >
                            <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                              {detail.deliveryInfo.deliveryAddress}
                            </p>
                          </Tooltip>
                        ) : null
                      )
                    )}
                  </td>
                  <td className="p-2">
                    <p className="w-16 overflow-hidden text-sm text-ellipsis whitespace-nowrap flex gap-5 item-center">
                      <button className="mt-2">
                        <OpenModalButton size={20} user={user} />
                      </button>

                      <button onClick={() => handleOpenDeleteModal(user._id)}>
                        <AiFillDelete size={20} color="#BFA75D" />
                      </button>
                      {isDeleteModalOpen && (
                        <DeleteModal
                          title="Confirm Delete"
                          onClose={() => setDeleteModalOpen(false)}
                          onConfirm={confirmDeleteshipment}
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
      ) : (
        <div>
          <p className="flex items-center text-gray-700">
            Shipment list is empty
          </p>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={data?.paginationData?.totalPages}
        totalCount={data?.totalCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Table;
