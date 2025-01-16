import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import LoadingPage from "../../Loader";
import { Pagination } from "../../pagination";
import { GetUserData } from "./https/GetUserData";


const table_head = [
  
  {
    head: "Customer Name",
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
];

const User = () => {
  const [customerData,setCustomerData] = useState([])
  const [currentPage,setCurrentPage] = useState([])
  const ITEM_PER_PAGE = 10
  const {token} = useSelector((state) => state.user)
  const {data,isLoading,isError,error} = GetUserData({token,
    page:currentPage,
    limit:ITEM_PER_PAGE,
  })

  useEffect(() => {
     setCustomerData(data?.data)
     setCurrentPage(data?.paginationData?.page)
  },[data])

  console.log(customerData,"data")
   const handlePageChange = (page) => {
     setCurrentPage(page)
   }
   
  if(isLoading){
    return <LoadingPage/>
  }
  if(isError){
    return <div>{error?.response?.data?.message}</div>
  }
  return (
    <> 
    <h1 className="text-2xl font-semibold mb-10">Customer</h1>
    {
      customerData?.length > 0 ? 
      <div>
      <div className="w-full overflow-x-auto">
        
        <table className="table-auto bg-white w-full border-collapse border border-gray-300">
          <thead className="bg-black text-white text-left">
            <tr className="text-white">
              {table_head.map((item, index) => (
                <th key={index} className="px-2 py-3 text-sm  font-semibold text-left">
                  {item.head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customerData?.map((user, index) => (
              <tr key={index} className="border-t border-gray-300">
                <td className="px-2 py-3 text-[#12223D] font-normal">
                  <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                    {user.firstName} {user.lastName}
                  </p>
                </td>
                <td className="px-2 py-3 text-[#12223D] font-normal">
                <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                    {user.email} 
                  </p>
                </td>
                <td className="p-2">
                  <p className="w-64 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                  </p>
                </td>
                <td className="p-2">
                
                <p className="w-64 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                    {user.phoneNumber ? user.phoneNumber : 'null'}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination 
        currentPage={currentPage}
        totalPages={data?.paginationData?.totalPages}
        totalCount = {data?.totalCounts}
        onPageChange={handlePageChange}
      />
      </div> : <div><p className="flex text-center text-gray-700">User list is empry</p></div>
    }
      
    </>
  );
};

export default User;




