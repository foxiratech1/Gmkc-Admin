import { useSelector } from "react-redux";
import contactData from "../../json/contactData";
import { useEffect, useState } from "react";
import { GetInquiryData } from "./https/GetInquiryList";
import LoadingPage from "../../Loader";
import { Pagination } from "../../pagination";

const table_head = [
  // {
  //   head: "Id",
  // },
  {
    head: "Name",
  },
  {
    head: "Email",
  },
  {
    head: "Phone Number",
  },
  {
    head: "Subject",
  },
  {
    head: "Message",
  },
];

const Inquiry = () => {
  const {token} = useSelector((state) => state.user)
  const [inquiryData,setInquiryData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10
  const {data,isLoading,isError,error} = GetInquiryData({token,page: currentPage,
    limit: ITEMS_PER_PAGE,})

  useEffect(() => {
    if(data){
      setInquiryData(data?.data)
      setCurrentPage(data?.paginationData?.page);
    }
  },[data])

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  if(isLoading){
    return <LoadingPage/>
  }
  if(isError){
    return <p>{error?.response?.data?.message}</p>
  }
  return (
    <>  
    {
      inquiryData?.length > 0 ? 
      <div>
      <div className="w-full overflow-x-auto">
        <h1 className="text-2xl font-semibold mb-10">Inquiry</h1>
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
            {inquiryData.map((user, index) => (
              <tr key={index} className="border-t border-gray-300">
                {/* <td className="px-2 py-3 text-[#12223D] font-normal">
                  <p className="w-12 overflow-hidden text-sm text-ellipsis whitespace-wrap  line-clamp-2">
                    {user._id}
                  </p>
                </td> */}
                <td className="px-2 py-3 text-[#12223D] font-normal">
                  <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap  line-clamp-2">
                    {user.name}
                  </p>
                </td>
                <td className="px-2 py-3">
                  <p className="w-64 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                    {user.email}
                  </p>
                </td>
                <td className="px-2 py-3">
                  <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                    {user.phoneNumber}
                  </p>
                </td>
                <td className="px-2 py-3">
                  <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                    {user.subject}
                  </p>
                </td>
                <td className="px-2 py-3">
                  <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                    {user.message}
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
          totalCount = {data?.totalCount}
          onPageChange={handlePageChange}
        />
        </div> : 
        <div><p className="flex text-center text-gray-700">Inquiry list is empty</p></div>
    }
        
    </>
  );
};

export default Inquiry;
