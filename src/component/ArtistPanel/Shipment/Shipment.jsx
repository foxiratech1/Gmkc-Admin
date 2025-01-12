import React, { useEffect, useState } from "react";
import shipmentData from "../../json/shipmentData";
import arrow from "../../../assets/downnn.png";
import Tooltip from "../../utils/Tooltip";
import { IoEyeOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { IoEye } from "react-icons/io5";
import DeleteModal from "../../utils/DeleteModal";
import OpenModalButton from "../../utils/OpenModalBtn";
import { useSelector } from "react-redux";
import { GetAllShipmentData } from "./https/GetAllshipment";
import LoadingPage from "../../Loader";
import { Pagination } from "../../pagination";
import { EditShipmentStop } from "./https/updateStop";
import { DeleteShipment } from "./https/shipmentDelete";

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
  // const [data, setData] = useState(shipmentData);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10
  const { data, isLoading, isError, error } = GetAllShipmentData({
    token,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const {mutateAsync,isPending} = EditShipmentStop()
  const {mutateAsync:deleteShipment} = DeleteShipment()

  useEffect(() => {
    if (data) {
      setCurrentPage(data.paginationData.page);
    }
  }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // console.log(data)
  const openModal = (detail,id) => {
    console.log(detail)
    console.log(id,"idddddd")
    setUpdatedStopsId(id)
    setSelectedCustomer(detail);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCustomer(null);
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
      console.log(stopFinal,"stopfine\al")
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
      
    
    console.log(updatedData,"stoooooooo")
    await mutateAsync({updatedData,updatedStopsId,token})
    console.log("Updated Data to Save:", updatedData);
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
                        <div key={detail.collectionInfo.contactNumber}>
                          <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {detail.collectionInfo.name}
                          </p>
                          {/* <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {detail.deliveryInfo.deliveryAddress}
                          </p> */}
                        </div>
                      ) : null
                    ))}

                    {/* <Tooltip text={user.customerName} position="top">
                      <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                        
                      </p>
                    </Tooltip> */}
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.email} position="top">
                      <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {user.email}
                      </p>
                    </Tooltip>
                  </td>
                  <td className="p-2">
                  {user?.contactDetail?.map((detail) => (
                      detail.collectionInfo ? (
                        <div key={detail.collectionInfo.contactNumber}>
                          <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {detail.collectionInfo.contactNumber}
                          </p>
                          {/* <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {detail.deliveryInfo.deliveryAddress}
                          </p> */}
                        </div>
                      ) : null
                    ))}
                    {/* <Tooltip text={user.phone} position="top">
                      <p className="w-24 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {user.phone}
                      </p>
                    </Tooltip> */}
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.orderDate} position="top">
                      <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {`${user.orderDate} ${user.orderTime}`}
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
                          {/* <p className="w-36 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                            {detail.deliveryInfo.deliveryAddress}
                          </p> */}
                        </div>
                      ) : null
                    ))}
                    {/* <Tooltip text={user.pickupLocation} position="top">
                      <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-wrap line-clamp-2">
                        {user.pickupLocation}
                      </p>
                    </Tooltip> */}
                  </td>
                  <td className="p-2">
                    <Tooltip text={user.pickUpDateAndTime} position="top">
                      <p className="w-40 overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                        {`${user.pickUpDateAndTime} ${user.pickupTime}`}
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
                        <img
                          src={arrow}
                          alt="Arrow"
                          onClick={() => openModal(detail,user._id)}
                          className="ml-2 flex-shrink-0 w-4 h-4"
                        />
                          </p>
                          
                        </div>
                        </Tooltip>
                      ) : null
                    ))}
                    {/* <Tooltip text={user.dropOffLocation} position="top">
                      <p className="w-48 overflow-hidden text-sm text-ellipsis whitespace-nowrap flex items-center">
                        <span className="flex-grow overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                          {user.dropOffLocation}
                        </span>
                        <img
                          src={arrow}
                          alt="Arrow"
                          onClick={() => openModal(user)}
                          className="ml-2 flex-shrink-0 w-4 h-4"
                        />
                      </p>
                    </Tooltip> */}
                  </td>
                  <td className="p-2">
                    <p className="w-16 overflow-hidden text-sm text-ellipsis whitespace-nowrap flex gap-5 item-center">
                      <OpenModalButton size={20} user={user} />
                      <button onClick={() => handleOpenDeleteModal(user._id)}>
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
          onPageChange={handlePageChange}
        />
      </div>

      {modalIsOpen && selectedCustomer && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white md:p-8 p-4 rounded-lg shadow-lg sm:max-w-lg w-[70%] sm:ml-0 ml-10 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Delivery Detail</h2>
               {/* {
                selectedCustomer?.collectionInfo?.collectionAddress
               } */}
             <p>
              <p className="font-semibold text-lg">Pickup Location:</p>
              {selectedCustomer?.collectionInfo?.collectionAddress}
            </p>

            {/* <div className="mt-4">
              {editedSteps && editedSteps.length > 0 ? (
                <>  
                  <ul className="mt-2">
                    {editedSteps.slice(0, 2).map((step, idx) => (
                      <div
                        key={idx}
                        className="mt-4 border border-[#BFA75D] shadow-lg border border-gray-100 p-2 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-gray-800">
                            Intermediate Stop : {step.stepNumber}
                          </p>
                          <FaEdit
                            size={20}
                            color="#BFA75D"
                            className="cursor-pointer"
                            onClick={() => handleEditClick(idx)}
                          />
                        </div>
                        {editMode === idx ? (
                          <>
                            <input
                              type="text"
                              className="w-full p-2 border mt-1 rounded"
                              value={step.userName}
                              onChange={(e) =>
                                handleInputChange(e, idx, "userName")
                              }
                              placeholder="Name"
                            />
                            <input
                              type="email"
                              className="w-full p-2 border mt-1 rounded"
                              value={step.email}
                              onChange={(e) =>
                                handleInputChange(e, idx, "email")
                              }
                              placeholder="Email"
                            />
                            <input
                              type="text"
                              className="w-full p-2 border mt-1 rounded"
                              value={step.phone}
                              onChange={(e) =>
                                handleInputChange(e, idx, "phone")
                              }
                              placeholder="Phone"
                            />
                            <input
                              type="text"
                              className="w-full p-2 border mt-1 rounded"
                              value={step.address}
                              onChange={(e) =>
                                handleInputChange(e, idx, "address")
                              }
                              placeholder="Address"
                            />
                          </>
                        ) : (
                          <>
                            <p className="text-sm">Name: {step.userName}</p>
                            <p className="text-sm">Email: {step.email}</p>
                            <p className="text-sm">Phone: {step.phone}</p>
                            <p className="text-sm">Address: {step.address}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </ul>

                  <div className="mt-4 border border-[#BFA75D] shadow-lg border border-gray-100 p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-900">
                        Final Stop
                      </p>
                      <FaEdit
                        size={20}
                        color="#BFA75D"
                        className="cursor-pointer"
                        onClick={() => handleEditClick(2)}
                      />
                    </div>
                    {editMode === 2 ? (
                      <>
                        <input
                          type="text"
                          className="w-full p-2 border mt-1 rounded"
                          value={editedSteps[2].userName}
                          onChange={(e) => handleInputChange(e, 2, "userName")}
                          placeholder="Name"
                        />
                        <input
                          type="email"
                          className="w-full p-2 border mt-1 rounded"
                          value={editedSteps[2].email}
                          onChange={(e) => handleInputChange(e, 2, "email")}
                          placeholder="Email"
                        />
                        <input
                          type="text"
                          className="w-full p-2 border mt-1 rounded"
                          value={editedSteps[2].phone}
                          onChange={(e) => handleInputChange(e, 2, "phone")}
                          placeholder="Phone"
                        />
                        <input
                          type="text"
                          className="w-full p-2 border mt-1 rounded"
                          value={editedSteps[2].address}
                          onChange={(e) => handleInputChange(e, 2, "address")}
                          placeholder="Address"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-sm">
                          Name: {editedSteps[2].userName}
                        </p>
                        <p className="text-sm">Email: {editedSteps[2].email}</p>
                        <p className="text-sm">Phone: {editedSteps[2].phone}</p>
                        <p className="text-sm">
                          Address: {editedSteps[2].address}
                        </p>
                      </>
                    )}
                  </div>
                </> 
              ) : (
                <p>No intermediate steps available.</p>
              )}
            </div> */}
            
                    <p className="font-semibold text-lg pt-3">Drop Location:</p>
                    
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
            <div>
              <input
                type="text"
                className="w-full p-2 border mt-1 rounded"
                value={stop.stopOneName || ""}
                onChange={(e) => handleInputChange(e, index, "stopOneName")}
                placeholder="Stop One Name"
                disabled={disableStopInputs}
              />
              <input
                type="email"
                className="w-full p-2 border mt-1 rounded"
                value={stop.stopOneEmail || ""}
                onChange={(e) => handleInputChange(e, index, "stopOneEmail")}
                placeholder="Stop One Email"
                disabled={disableStopInputs}
              />
              <input
                type="text"
                className="w-full p-2 border mt-1 rounded"
                value={stop.stopOneContactNumber || ""}
                onChange={(e) => handleInputChange(e, index, "stopOneContactNumber")}
                placeholder="Stop One Contact Number"
                disabled={disableStopInputs}
              />
              <input
                type="text"
                className="w-full p-2 border mt-1 rounded"
                value={stop.stopOneAddress || ""}
                onChange={(e) => handleInputChange(e, index, "stopOneAddress")}
                placeholder="Stop One Address"
                disabled={disableStopInputs}
              />
            </div>
          ) : (
            <div className="mt-4 border border-[#BFA75D] shadow-lg p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium text-gray-800">
                  Intermediate Stop One: {index + 1}
                </p>
                <FaEdit
                  size={20}
                  color="#BFA75D"
                  className="cursor-pointer"
                  onClick={() => handleEditClick(index)}
                />
              </div>
              <div className="flex gap-3 flex-wrap py-1">
                <p>Name:</p>
                <p>{stop.stopOneName || ""}</p>
              </div>
              <div className="flex gap-3 flex-wrap py-1">
                <p>Email:</p>
                <p>{stop.stopOneEmail || ""}</p>
              </div>
              <div className="flex gap-3 flex-wrap py-1">
                <p>Contact Number:</p>
                <p>{stop.stopOneContactNumber || ""}</p>
              </div>
              <div className="flex gap-3 flex-wrap py-1">
                <p>Address:</p>
                <p>{stop.stopOneAddress || ""}</p>
              </div>
            </div>
          )
        )}

        {isStopTwo && (
          editMode === index ? (
            <div>
              <input
                type="text"
                className="w-full p-2 border mt-1 rounded"
                value={stop.stopTwoName || ""}
                onChange={(e) => handleInputChange(e, index, "stopTwoName")}
                placeholder="Stop Two Name"
                disabled={disableStopInputs}
              />
              <input
                type="email"
                className="w-full p-2 border mt-1 rounded"
                value={stop.stopTwoEmail || ""}
                onChange={(e) => handleInputChange(e, index, "stopTwoEmail")}
                placeholder="Stop Two Email"
                disabled={disableStopInputs}
              />
              <input
                type="text"
                className="w-full p-2 border mt-1 rounded"
                value={stop.stopTwoContactNumber || ""}
                onChange={(e) => handleInputChange(e, index, "stopTwoContactNumber")}
                placeholder="Stop Two Contact Number"
                disabled={disableStopInputs}
              />
              <input
                type="text"
                className="w-full p-2 border mt-1 rounded"
                value={stop.stopTwoAddress || ""}
                onChange={(e) => handleInputChange(e, index, "stopTwoAddress")}
                placeholder="Stop Two Address"
                disabled={disableStopInputs}
              />
            </div>
          ) : (
            <div className="mt-4 border border-[#BFA75D] shadow-lg p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium text-gray-800">
                  Intermediate Stop Two: {index + 1}
                </p>
                <FaEdit
                  size={20}
                  color="#BFA75D"
                  className="cursor-pointer"
                  onClick={() => handleEditClick(index)}
                />
              </div>
              <div className="flex gap-3 flex-wrap py-1">
                <p>Name:</p>
                <p>{stop.stopTwoName || ""}</p>
              </div>
              <div className="flex gap-3 flex-wrap py-1">
                <p>Email:</p>
                <p>{stop.stopTwoEmail || ""}</p>
              </div>
              <div className="flex gap-3 flex-wrap py-1">
                <p>Contact Number:</p>
                <p>{stop.stopTwoContactNumber || ""}</p>
              </div>
              <div className="flex gap-3 flex-wrap py-1">
                <p>Address:</p>
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
          <div className="mt-4 border border-[#BFA75D] shadow-lg border border-gray-100 p-2 rounded-lg">
                        <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-900">
                        Final Stop
                      </p>
                      <FaEdit
                        size={20}
                        color="#BFA75D"
                        className="cursor-pointer"
                        onClick={() => handleEditClick(2)}
                      />
                    </div>
                    
                    {editMode === 2 ? (
  <>
    <input
      type="text"
      className="w-full p-2 border mt-1 rounded"
      value={finalStep[0]?.deliveryName || selectedCustomer?.deliveryInfo?.deliveryName || ''}
      onChange={(e) => handleInputChangeFinal(e, 0, 'deliveryName')}
      placeholder="Name"
    />
    <input
      type="email"
      className="w-full p-2 border mt-1 rounded"
      value={finalStep[0]?.deliveryEmail || selectedCustomer?.deliveryInfo?.deliveryEmail || ''}
      onChange={(e) => handleInputChangeFinal(e, 0, 'deliveryEmail')}
      placeholder="Email"
    />
    <input
      type="text"
      className="w-full p-2 border mt-1 rounded"
      value={finalStep[0]?.deliveryContactNumber || selectedCustomer?.deliveryInfo?.deliveryContactNumber || ''}
      onChange={(e) => handleInputChangeFinal(e, 0, 'deliveryContactNumber')}
      placeholder="Phone"
    />
    <input
      type="text"
      className="w-full p-2 border mt-1 rounded"
      value={finalStep[0]?.deliveryAddress || selectedCustomer?.deliveryInfo?.deliveryAddress || ''}
      onChange={(e) => handleInputChangeFinal(e, 0, 'deliveryAddress')}
      placeholder="Address"
    />
  </>
) : (
  <div>
    <p className="text-sm py-1">Name: {selectedCustomer?.deliveryInfo?.deliveryName}</p>
    <p className="text-sm py-1">Phone: {selectedCustomer?.deliveryInfo?.deliveryContactNumber}</p>
    <p className="text-sm py-1">Email: {selectedCustomer?.deliveryInfo?.deliveryEmail}</p>
    <p className="text-sm py-1">Address: {selectedCustomer?.deliveryInfo?.deliveryAddress}</p>
  </div>
)}

                  </div>
               

{/* try end */}



                        {/* <div className="mt-4 border border-[#BFA75D] shadow-lg border border-gray-100 p-2 rounded-lg">
                        <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-900">
                        Final Stop
                      </p>
                      <FaEdit
                        size={20}
                        color="#BFA75D"
                        className="cursor-pointer"
                        onClick={() => handleEditClick(2)}
                      />
                    </div>
                    <div>
                    <p className="text-sm py-1">
                          Name: {selectedCustomer?.deliveryInfo?.deliveryName}
                        </p>
                        <p className="text-sm py-1">Phone: {selectedCustomer?.deliveryInfo?.deliveryContactNumber}</p>
                        <p className="text-sm py-1">Email: {selectedCustomer?.deliveryInfo?.deliveryEmail}</p>
                        <p className="text-sm py-1">
                          Address: {selectedCustomer?.deliveryInfo?.deliveryAddress}
                        </p>
                    </div>
               </div> */}

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
        </div>
      )}
    </>
  );
};

export default ShipmentTable;
