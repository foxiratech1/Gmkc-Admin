import { useSelector } from "react-redux";
import { GetCustomerData } from "./https/GetCustomerData";
import { useEffect, useState } from "react";
import LoadingPage from "../../Loader";
import { Pagination } from "../../pagination";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { customerendpoints } from "../../../services/apis";
import { AiFillDelete } from "react-icons/ai";
import Tooltip from "../../utils/Tooltip";

const table_head = [
  {
    head: "Customer Id",
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
    head: "Action",
  },
];

const Customer = () => {
  const [customerData, setCustomerData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const ITEM_PER_PAGE = 10;
  const { token } = useSelector((state) => state.user);
  const { data, isLoading, isError, error } = GetCustomerData({
    token,
    page: currentPage,
    limit: ITEM_PER_PAGE,
  });

  useEffect(() => {
    setCustomerData(data?.data);
    setCurrentPage(data?.paginationData?.page);
  }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = (user) => {
    setSelectedCustomer(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${customerendpoints.CUSTOMER_Update}/${selectedCustomer._id}`,
        {
          contactDetail: [
            {
              collectionInfo: {
                collectionAddress:
                  selectedCustomer?.contactDetail?.[0]?.collectionInfo
                    ?.collectionAddress,
                name: selectedCustomer?.contactDetail?.[0]?.collectionInfo
                  ?.name,
                contactNumber:
                  selectedCustomer?.contactDetail?.[0]?.collectionInfo
                    ?.contactNumber,
                email:
                  selectedCustomer?.contactDetail?.[0]?.collectionInfo?.email,
              },
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        window.location.reload();
        closeModal();
      }
    } catch (error) {
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedCustomer((prevState) => {
      const updatedContactDetail = [...prevState.contactDetail];

      updatedContactDetail[0] = {
        ...updatedContactDetail[0],
        collectionInfo: {
          ...updatedContactDetail[0]?.collectionInfo,
          [name]: value,
        },
      };
      return {
        ...prevState,
        contactDetail: updatedContactDetail,
      };
    });
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await axios.put(
        `${customerendpoints.CUSTOMER_Delete}/${customerId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setCustomerData((prevData) =>
          prevData.filter((customer) => customer._id !== customerId)
        );
      }
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <div>{error?.response?.data?.message}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-10">Customers</h1>
      {customerData?.length > 0 ? (
        <div>
          <div className="w-full overflow-x-auto">
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
                {customerData?.map((user, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="px-2 py-3 text-[#12223D] font-normal">
                      <p className="w-24 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                        {user.shipmentId}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-[#12223D] font-normal">
                      {user.status === "accept" ? (
                        <p className="text-sm">Not Available</p>
                      ) : (
                        user?.contactDetail?.map((info) =>
                          info.collectionInfo ? (
                            <p className="w-24 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2 text-start">
                              {info.collectionInfo.name
                                ? info.collectionInfo.name
                                : "Not Available"}
                            </p>
                          ) : null
                        )
                      )}
                    </td>
                    <td className="p-2">
                      {user.status === "accept" ? (
                        <p className="text-sm">{user.email}</p>
                      ) : (
                        user?.contactDetail?.map((info) =>
                          info.collectionInfo ? (
                            <p className="w-44  text-sm text-start">
                              {info.collectionInfo.email
                                ? info.collectionInfo.email
                                : "Not Available"}
                            </p>
                          ) : null
                        )
                      )}
                    </td>
                    <td className="p-2">
                      {user.status === "accept" ? (
                        <p className="text-sm">Not Available</p>
                      ) : (
                        user?.contactDetail?.map((info) =>
                          info.collectionInfo ? (
                            <p className="w-54  text-sm text-ellipsis whitespace-wrap line-clamp-2 text-start">
                              {info.collectionInfo.contactNumber
                                ? info.collectionInfo.contactNumber
                                : "Not Available"}
                            </p>
                          ) : null
                        )
                      )}
                    </td>
                    <td className="space-x-5 flex items-center mt-3">
                      <FaEdit
                        size={20}
                        color="#BFA75D"
                        onClick={() => openModal(user)}
                      />
                      <button onClick={() => handleDeleteCustomer(user._id)}>
                        <AiFillDelete size={20} color="#BFA75D" />
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
        <div>
          <p className="flex text-center text-gray-500">
            Customer list is empty
          </p>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg md:p-6 p-3 w-full md:max-w-xl max-w-xs sm:ml-0 ml-10">
            <h2 className="text-xl font-semibold mb-4">Edit Customer</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={
                    selectedCustomer?.contactDetail?.[0]?.collectionInfo?.name
                  }
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={
                    selectedCustomer?.contactDetail?.[0]?.collectionInfo?.email
                  }
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Contact No.
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={
                    selectedCustomer?.contactDetail?.[0]?.collectionInfo
                      ?.contactNumber || ""
                  }
                  onChange={handleChange}
                  className="w-full border rounded p-2 mt-1"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-[#BFA75D] text-white px-4 py-2 rounded font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
