import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import LoadingPage from "../../Loader";
import { Pagination } from "../../pagination";
import { GetUserData } from "./https/GetUserData";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import { userendpoints } from "../../../services/apis";

const table_head = [
  {
    head: "Name",
  },
  {
    head: "Email",
  },
  {
    head: "Created",
  },
  {
    head: "Phone",
  },
  {
    head: "Actions",
  },
];
const User = () => {
  const [customerData, setCustomerData] = useState([]);
  const [currentPage, setCurrentPage] = useState([]);
  const ITEM_PER_PAGE = 10;
  const { token } = useSelector((state) => state.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { data, isLoading, isError, error } = GetUserData({
    token,
    page: currentPage,
    limit: ITEM_PER_PAGE,
  });

  useEffect(() => {
    setCustomerData(data?.data);
    setCurrentPage(data?.paginationData?.page);
    console.log("Customer data set in useEffect:", data?.data);
  }, [data]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [isCreate, setIsCreate] = useState("");
  const [userId, setUserId] = useState("");
  const openModal = (user, val) => {
    setSelectedCustomer(user);
    setModalOpen(true);
    setUserId(user?._id);
    setIsCreate(val); // Set isCreate to "create"
    console.log("Modal Opened for User:", user?._id);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
    console.log("Modal Closed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", isCreate);

    try {
      let url =
        isCreate === "create"
          ? userendpoints.USER_Create
          : `${userendpoints.USER_Update}/${userId}`;
      let method = isCreate === "create" ? axios.post : axios.put;

      const response = await method(url, selectedCustomer, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setCustomerData(data?.data);
      }
      closeModal();
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await axios.delete(
        `${userendpoints.USER_Delete}/${customerId}`,
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
      console.error("Error deleting customer:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field Changed: ${name} = ${value}`);

    setSelectedCustomer((prevState) => {
      const updatedState = { ...prevState, [name]: value };
      return updatedState;
    });
  };

  if (isLoading) {
    console.log("Loading Data...");
    return <LoadingPage />;
  }

  if (isError) {
    console.log("Error:", error?.response?.data?.message);
    return <div>{error?.response?.data?.message}</div>;
  }

  return (
    <>
      <div className="flex sm:flex-row flex-col justify-between items-center gap-2 mb-10">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button
          className="text-white bg-[#BFA75D] font-medium mt-2 rounded-md text-md px-5 py-3"
          onClick={() => openModal(null, "create")}
        >
          Create User
        </button>
      </div>

      {customerData?.length > 0 ? (
        <div>
          <div className="w-full overflow-x-auto">
            <table className="table-auto bg-white w-full border-collapse border border-gray-300">
              <thead className="bg-black text-white text-left">
                <tr className="text-white">
                  {table_head.map((item, index) => (
                    <th
                      key={index}
                      className="px-2 py-3 text-sm  font-semibold text-left"
                    >
                      {item.head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customerData?.map((user, index) => (
                  <tr key={index} className="border-t border-gray-300 ">
                    <td className="px-2 py-3 text-[#12223D] font-normal ">
                      <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2 my-1">
                        {user.fullName}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-[#12223D] font-normal">
                      <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2  my-1">
                        {user.email}
                      </p>
                    </td>
                    <td className="p-2">
                      <p className="w-64 overflow-hidden text-sm text-ellipsis whitespace-nowrap  my-1">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="p-2">
                      <p className="w-64 overflow-hidden text-sm text-ellipsis whitespace-nowrap  my-1">
                        {user.phoneNumber == "undefined"
                          ? "Not Available"
                          : user.phoneNumber}
                      </p>
                    </td>
                    <td className="space-x-5 flex items-center ">
                      <FaEdit
                        size={20}
                        color="#BFA75D"
                        className=" my-1"
                        onClick={() => openModal(user)}
                      />
                      <button>
                        <AiFillDelete
                          size={20}
                          color="#BFA75D"
                          className=" my-1"
                          onClick={() => handleDeleteCustomer(user._id)}
                        />
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
          <p className="flex text-center text-gray-700">User list is empty</p>
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
                  name="fullName"
                  value={selectedCustomer?.fullName || ""}
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
                  value={selectedCustomer?.email || ""}
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
                  name="phoneNumber"
                  value={selectedCustomer?.phoneNumber || ""}
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
    </>
  );
};

export default User;
