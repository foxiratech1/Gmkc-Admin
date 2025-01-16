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
  const {token} = useSelector((state) => state.user)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [editedSteps, setEditedSteps] = useState(null);
  const [finalStep,setFinalStep] = useState(null)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updatedStopsId, setUpdatedStopsId] = useState(null);
  const [userDetail,setUserDetail] = useState(null)
  const [userId,setUserId] = useState(null)
  const [customerData,setCustomerData] = useState([])
  // const [data, setData] = useState(shipmentData);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10
  const { data, isLoading, isError, error } = GetAllShipmentData({
    token,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const {data:popupdata} = GetSingleShipmentData({token,userId})
  const {mutateAsync,isPending} = EditShipmentStop()
  const {mutateAsync:deleteShipment} = DeleteShipment()
   
  useEffect(() => {
    if (data) {
      setCurrentPage(data.paginationData.page);
    }
  }, [data]);
  useEffect(() => {
    if(popupdata){
      setCustomerData(popupdata)
    }
  },[popupdata,userId])
   
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const openModal = (detail,user,id) => {
    setUserId(user._id)
    setUpdatedStopsId(id)
    setSelectedCustomer(detail);
    setUserDetail(user)
    setModalIsOpen(true);
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCustomer(null);
    // setUserId(null)
  };

  // useEffect(() => {
  //   if (selectedCustomer?.steps) {
  //     setEditedSteps([...selectedCustomer.steps]);
  //   }
  // }, [selectedCustomer]);

  const handleEditClick = (stepIndex) => {
    setEditMode(stepIndex);
  };
  useEffect(() => {
    if (selectedCustomer && selectedCustomer.deliveryInfo.intermediateStops) {
      const stopsArray = Object.values(selectedCustomer.deliveryInfo.intermediateStops);
      const stopFinal = (selectedCustomer?.deliveryInfo)
      
      setFinalStep(stopFinal)
      setEditedSteps(stopsArray);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedCustomer && selectedCustomer.deliveryInfo) {
        
        setFinalStep([selectedCustomer.deliveryInfo]); 
    }
}, [selectedCustomer]);


  
const handleInputChangeFinal = (e, index, field) => {
 
  let currentStep = Array.isArray(finalStep) ? finalStep : [];

  const updatedFinalStep = currentStep.map((step, idx) => {
      if (idx === index) {
          return { ...step, [field]: e.target.value };
      }
      return step;
  });

  setFinalStep(updatedFinalStep);
};





  const handleInputChange = (e, index, field) => {
    const currentSteps = Array.isArray(editedSteps) ? editedSteps : [];
    const updatedSteps = [...currentSteps];
  
    if (!updatedSteps[index]) {
      updatedSteps[index] = {};
    }
  
    updatedSteps[index][field] = e.target.value;
  
    setEditedSteps(updatedSteps);
  };
  const handleSave = async() => {
    // console.log("Updated Steps:", editedSteps);
     try{
      const updatedData = [];
      const deliveryInfo = {}
     editedSteps.forEach((step) => {
      const updatedStep = {};
      if (step.stopOneAddress) {
        updatedStep.stopOneAddress = step.stopOneAddress || "";
        updatedStep.stopOneContactNumber = step.stopOneContactNumber || "";
        updatedStep.stopOneEmail = step.stopOneEmail || "";
        updatedStep.stopOneName = step.stopOneName || "";
      }

      if (step.stopTwoAddress) {
        updatedStep.stopTwoAddress = step.stopTwoAddress || "";
        updatedStep.stopTwoContactNumber = step.stopTwoContactNumber || "";
        updatedStep.stopTwoEmail = step.stopTwoEmail || "";
        updatedStep.stopTwoName = step.stopTwoName || "";
      }
      
      updatedData.push(updatedStep);
    });
    finalStep.forEach((final) => {
      deliveryInfo.deliveryName = final.deliveryName || '';
      deliveryInfo.deliveryContactNumber = final.deliveryContactNumber || '';
      deliveryInfo.deliveryEmail = final.deliveryEmail || '';
      deliveryInfo.deliveryAddress = final.deliveryAddress || '';
      updatedData.push(deliveryInfo);
    }) 
      
    
   
    
    await mutateAsync({updatedData,updatedStopsId,token})
    
    
     }catch(error){
      console.error(error)
     }
    setEditMode(null);
    setUpdatedStopsId(null);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteModalOpen(true);
    setDeleteIndex(id);
  };

  const confirmDelete = async() => {
     await deleteShipment({'id': deleteIndex,token})
      setDeleteModalOpen(false);
      setDeleteIndex(null)
  };

  if(isLoading){
    return <LoadingPage/>
  }
  if(isError){
    return <p>{error?.response?.data?.message}</p>
  }
  return (
    <>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-10">Shipment</h1>
        {
          data?.data?.length > 0 ?
           <div>
          <div className="overflow-x-auto">
          <table className="table-auto bg-white w-full border-collapse border border-gray-300">
            <thead className="bg-black text-white text-left">
              <tr className="text-white">
                {table_head.map((item, index) => (
                  <th className="px-2 py-3 text-sm font-semibold text-left">
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
                  {user?.contactDetail?.map((detail) => (
                      detail.collectionInfo ? (
                        <div key={detail.collectionInfo.name}>
                          <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {detail.collectionInfo.name}
                          </p>
                          
                        </div>
                      ) : null
                    ))}

                    
                  </td>
                  <td className="p-2">
                    {/* <Tooltip text={user.email} position="top">
                      <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {user.email}
                      </p>
                    </Tooltip> */}
                    {user?.contactDetail?.map((detail) => (
                      detail.collectionInfo ? (
                        <Tooltip text={detail.collectionInfo.email} position="top" key={detail.collectionInfo.email}>
                          <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {detail.collectionInfo.email}
                          </p>
                        </Tooltip>
                      ) : null
                    ))}
                  </td>
                  <td className="p-2">
                  {user?.contactDetail?.map((detail) => (
                      detail.collectionInfo ? (
                        <div key={detail.collectionInfo.contactNumber}>
                          <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {detail.collectionInfo.contactNumber}
                          </p>
                          
                        </div>
                      ) : null
                    ))}
                    
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.orderDate} position="top">
                      <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {`${user.orderDate}`}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.vehicleType} position="top">
                      <p className="w-24 overflow-hidden text-sm text-ellipsis whitespace-nowrap ">
                        {user.vehicleType}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                  {user?.contactDetail?.map((detail) => (
                      detail.collectionInfo ? (
                        <div key={detail.collectionInfo.collectionAddress}>
                          <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {detail.collectionInfo.collectionAddress}
                          </p>
                          
                        </div>
                      ) : null
                    ))}
                    
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.pickUpDateAndTime} position="top">
                      <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {`${user.pickUpDateAndTime ? user.pickUpDateAndTime : null}`}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                  {user?.contactDetail?.map((detail) => (
                      detail.deliveryInfo ? (
                        <Tooltip text={detail.deliveryInfo.deliveryAddress} position="top">
                        <div key={detail.deliveryInfo.deliveryAddress}>
                          <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-nowrap flex items-center">
                          <span className="flex-grow overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                          {detail.deliveryInfo.deliveryAddress}
                          </span>
                        {/* <img
                          src={arrow}
                          alt="Arrow"
                          onClick={() => openModal(detail,user._id)}
                          className="ml-2 flex-shrink-0 w-4 h-4"
                        /> */}
                          </p>
                          
                        </div>
                        </Tooltip>
                      ) : null
                    ))}
                    
                  </td>
                  <td className="p-2">
                    <p className="w-16 overflow-hidden text-sm text-ellipsis whitespace-nowrap flex gap-5 item-center justify-end">
                    {user?.contactDetail?.map((detail) => (
                      detail.deliveryInfo ? (
                        <div key={detail.deliveryInfo.deliveryAddress}>
                        {/* <img
                          src={arrow}
                          alt="Arrow"
                          onClick={() => openModal(detail,user,user._id)}
                          className="ml-2 flex-shrink-0 w-4 h-4"
                        /> */}
                        <MdOutlineRemoveRedEye onClick={() => openModal(detail,user,user._id)} className="text-yellow-300 text-[20px] hover:cursor-pointer"/>
                        </div>
                        
                      ) : null
                    ))}
                      {/* <OpenModalButton size={20} user={user} /> */}
                      <button onClick={() => handleOpenDeleteModal(user._id)} className="">
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
            </div> : 
        <div><p className="flex items-center text-gray-700">Shipment list is empty</p></div>
        }
      </div>

      {modalIsOpen && selectedCustomer && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex mt-3 justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white md:p-8 p-4 rounded-lg shadow-lg md:max-w-[70%] w-[70%] sm:ml-0 ml-10 overflow-y-auto md:grid grid-cols-2 gap-3"
            onClick={(e) => e.stopPropagation()}
          >
             <div>
            <h2 className="text-xl font-semibold mb-4">Shipment Detail</h2>
               {/* {
                selectedCustomer?.collectionInfo?.collectionAddress
               } */}
             <div>
              <p className="font-semibold text-md">Pickup Location:</p>
              <div className="py-[4px] px-7 bg-gray-400 text-black font-semibold rounded-md mt-1 text-[14px]">
                 <div className="flex gap-2 py-[2px]">
                 <h3 className="pr-6">Name:</h3>
                 <p>{selectedCustomer?.collectionInfo?.name}</p>
                 </div>
                 <div className="flex gap-2 py-[2px]">
                 <h3 className="pr-7">Email:</h3>
                 <p>{selectedCustomer?.collectionInfo?.email}</p>
                 </div>
                 <div className="flex gap-2 py-[2px]">
                 <h3 className="pr-4">Mobile:</h3>
                 <p>{selectedCustomer?.collectionInfo?.contactNumber}</p>
                 </div>
                 <div className="flex gap-2 py-[2px]">
                 <h3 className="pr-3">Address:</h3>
                 <p>{selectedCustomer?.collectionInfo?.collectionAddress}</p>
                 </div>
              </div>
          
            </div>
              <p className="font-semibold text-md pt-3">Drop Location:</p>
                    
              {!selectedCustomer?.deliveryInfo?.intermediateStops ||
              Object.keys(selectedCustomer.deliveryInfo.intermediateStops).length === 0 ? (
                <p>No intermediate stops available.</p>
              ) : (
                Object.values(selectedCustomer.deliveryInfo.intermediateStops).map((stop, index) => {
                  const isStopOne = stop.stopOneName || stop.stopOneEmail || stop.stopOneContactNumber || stop.stopOneAddress;
                  const isStopTwo = stop.stopTwoName || stop.stopTwoEmail || stop.stopTwoContactNumber || stop.stopTwoAddress;
                  
                  const disableStopInputs = !isStopOne && !isStopTwo;

              return (
                <div key={index}>
                  {isStopOne && (
                    editMode === index ? (
                      <div className="bg-gray-300 py-3 px-3 rounded-md mt-1">
                        <input
                          type="text"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={stop.stopOneName || ""}
                          onChange={(e) => handleInputChange(e, index, "stopOneName")}
                          placeholder="Stop One Name"
                          disabled={disableStopInputs}
                        />
                        <input
                          type="email"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={stop.stopOneEmail || ""}
                          onChange={(e) => handleInputChange(e, index, "stopOneEmail")}
                          placeholder="Stop One Email"
                          disabled={disableStopInputs}
                        />
                        <input
                          type="text"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={stop.stopOneContactNumber || ""}
                          onChange={(e) => handleInputChange(e, index, "stopOneContactNumber")}
                          placeholder="Stop One Contact Number"
                          disabled={disableStopInputs}
                        />
                        <input
                          type="text"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={stop.stopOneAddress || ""}
                          onChange={(e) => handleInputChange(e, index, "stopOneAddress")}
                          placeholder="Stop One Address"
                          disabled={disableStopInputs}
                        />
                      </div>
                    ) : (
                      <div className="mt-1 rounded-md text-black font-semibold py-2 px-7 bg-gray-200 text-[14px]">
                        <div className="flex items-center justify-between ">
                          <p className="text-md font-medium text-gray-800">
                            Intermediate Stop: {index + 1}
                          </p>
                          <FaEdit
                            size={20}
                            color="black"
                            className="cursor-pointer"
                            onClick={() => handleEditClick(index)}
                          />
                        </div>
                        <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-6">Name:</p>
                          <p>{stop.stopOneName || ""}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-7">Email:</p>
                          <p>{stop.stopOneEmail || ""}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-4">Mobile:</p>
                          <p>{stop.stopOneContactNumber || ""}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-3">Address:</p>
                          <p>{stop.stopOneAddress || ""}</p>
                        </div>
                      </div>
                    )
                  )}

                  {isStopTwo && (
                    editMode === index ? (
                      <div className="bg-gray-300 py-3 px-3 rounded-md mt-1">
                        <input
                          type="text"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={stop.stopTwoName || ""}
                          onChange={(e) => handleInputChange(e, index, "stopTwoName")}
                          placeholder="Stop Two Name"
                          disabled={disableStopInputs}
                        />
                        <input
                          type="email"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={stop.stopTwoEmail || ""}
                          onChange={(e) => handleInputChange(e, index, "stopTwoEmail")}
                          placeholder="Stop Two Email"
                          disabled={disableStopInputs}
                        />
                        <input
                          type="text"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={stop.stopTwoContactNumber || ""}
                          onChange={(e) => handleInputChange(e, index, "stopTwoContactNumber")}
                          placeholder="Stop Two Contact Number"
                          disabled={disableStopInputs}
                        />
                        <input
                          type="text"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={stop.stopTwoAddress || ""}
                          onChange={(e) => handleInputChange(e, index, "stopTwoAddress")}
                          placeholder="Stop Two Address"
                          disabled={disableStopInputs}
                        />
                      </div>
                    ) : (
                      <div className="mt-1 rounded-md text-black font-semibold py-2 px-7 bg-gray-200 text-[14px]">
                        <div className="flex items-center justify-between">
                          <p className="text-md font-medium text-gray-800">
                            Intermediate Stop: {index + 1}
                          </p>
                          <FaEdit
                            size={20}
                            color="black"
                            className="cursor-pointer"
                            onClick={() => handleEditClick(index)}
                          />
                        </div>
                        <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-6">Name:</p>
                          <p>{stop.stopTwoName || ""}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-7">Email:</p>
                          <p>{stop.stopTwoEmail || ""}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-4">Mobile:</p>
                          <p>{stop.stopTwoContactNumber || ""}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-3">Address:</p>
                          <p>{stop.stopTwoAddress || ""}</p>
                        </div>
                      </div>
                    )
                  )}   
                </div>
              );
            })
          )}

{/* try start*/}
                <div className="mt-1 rounded-md">
                    {/* <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-900 py-2">
                        Final Stop
                      </p>
                      <FaEdit
                        size={20}
                        color="#BFA75D"
                        className="cursor-pointer"
                        onClick={() => handleEditClick(2)}
                      />
                    </div> */}
                    {editMode === 2 ? (
                      <div className="bg-gray-300 py-3 px-3 rounded-md mt-1">
                        <input
                          type="text"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={finalStep[0]?.deliveryName || selectedCustomer?.deliveryInfo?.deliveryName || ''}
                          onChange={(e) => handleInputChangeFinal(e, 0, 'deliveryName')}
                          placeholder="Name"
                        />
                        <input
                          type="email"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={finalStep[0]?.deliveryEmail || selectedCustomer?.deliveryInfo?.deliveryEmail || ''}
                          onChange={(e) => handleInputChangeFinal(e, 0, 'deliveryEmail')}
                          placeholder="Email"
                        />
                        <input
                          type="text"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={finalStep[0]?.deliveryContactNumber || selectedCustomer?.deliveryInfo?.deliveryContactNumber || ''}
                          onChange={(e) => handleInputChangeFinal(e, 0, 'deliveryContactNumber')}
                          placeholder="Phone"
                        />
                        <input
                          type="text"
                          className="w-full p-1 px-2 border mt-1 rounded bg-gray-200 border-gray-400"
                          value={finalStep[0]?.deliveryAddress || selectedCustomer?.deliveryInfo?.deliveryAddress || ''}
                          onChange={(e) => handleInputChangeFinal(e, 0, 'deliveryAddress')}
                          placeholder="Address"
                        />
                      </div>
                    ) : (
                      <div className="mt-1 rounded-md text-black font-semibold py-2 px-7 bg-gray-400 text-[14px]">
                      <div className="flex items-center justify-between">
                      <p className="text-md font-medium text-gray-900 py-1">
                        Final Stop
                      </p>
                      <FaEdit
                        size={20}
                        color="black"
                        className="cursor-pointer"
                        onClick={() => handleEditClick(2)}
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-6">Name:</p>
                          <p>{selectedCustomer?.deliveryInfo?.deliveryName}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-7">Email:</p>
                          <p>{selectedCustomer?.deliveryInfo?.deliveryEmail}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-4">Mobile:</p>
                          <p>{selectedCustomer?.deliveryInfo?.deliveryContactNumber}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap py-[2px]">
                          <p className="pr-3">Address:</p>
                          <p>{selectedCustomer?.deliveryInfo?.deliveryAddress}</p>
                        </div>
                        {/* <p className="text-sm py-1">Name: {selectedCustomer?.deliveryInfo?.deliveryName}</p>
                        <p className="text-sm py-1">Phone: {selectedCustomer?.deliveryInfo?.deliveryContactNumber}</p>
                        <p className="text-sm py-1">Email: {selectedCustomer?.deliveryInfo?.deliveryEmail}</p>
                        <p className="text-sm py-1">Address: {selectedCustomer?.deliveryInfo?.deliveryAddress}</p> */}
                      </div>
                    )}

                 </div>
                        {editMode !== null && (
                          <button
                            className="mt-4 bg-[#BFA75D] font-medium text-white py-2 px-4 rounded mr-2"
                            onClick={handleSave}
                          >
                            Save
                          </button>
                        )}
                        <button
                          className="mt-4 bg-black font-medium text-white py-2 px-4 rounded"
                          onClick={closeModal}
                        >
                          Close
                        </button>
            </div>
            <div>
               <div>
                 <p className="pt-10 font-semibold text-md">Order Detail</p>
                 <div className="p-4 mt-2 bg-gray-300 rounded-md text-[14px] font-semibold py-2">
                    <div className="flex gap-2 px-3 py-1">
                      <h4 className="pr-[5.3rem]">Oredre Id:</h4>
                       <p>{userDetail?.shipmentId}</p>
                    </div>
                    <div className="flex gap-2 px-3 py-1">
                      <h4 className="pr-5">Oredre date & Time:</h4>
                       <p>{userDetail?.orderDate}</p>
                    </div>
                 </div>
                 <div>
                 <h2 className="text-md font-semibold py-1 mt-1">Customer Details</h2>
                    {customerData?.customerDetail?.length > 0 ? 
                      customerData?.customerDetail?.map((user,index) => (
                        <div className="p-4 mt-2 bg-gray-300 rounded-md text-[14px] font-semibold py-2" key={index}>
                        <div className="flex gap-2 px-3 py-1">
                          <h4 className="pr-[3.3rem]">name:</h4>
                          <p>{user.firstName} {user.lastName}</p>
                        </div>
                        <div className="flex overflow-clip gap-2 px-3 py-1">
                          <h4 className="pr-[3.3rem]">Email:</h4>
                          <p>{user.email}</p>
                        </div>
                        <div className="flex gap-2 px-3 py-1">
                          <h4 className="pr-[2.7rem]">Mobile:</h4>
                          <p>{user.phoneNumber}</p>
                        </div>
                 </div>
                      )) : <div className="px-7">This is not customer</div>
                    }
                 </div>
                 
              </div>
            </div>
            </div>
            
          </div>
                  )}
                </>
              );
            };

export default ShipmentTable;
