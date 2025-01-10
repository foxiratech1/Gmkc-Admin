import React, { useState, useEffect } from "react";
import DeleteModal from "../../utils/DeleteModal";
import FAQList from "./FaqList";
import FAQModal from "./FaqModal";
import { PostFaqMutation } from "./https/postfaqmutation";
import { useSelector } from "react-redux";
import { GetFaqList } from "./https/Getfaqlist";
import LoadingPage from "../../Loader";
import { DeleteFaq } from "./https/deletefaqs";
import { EditFaq } from "./https/updategaq";

const FaqForm = () => {
  const {token} = useSelector((state) => state.user)
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toggledIndex, setToggledIndex] = useState(null);
  const [isEdit,setIsEdit] = useState(false)
  const [editId,setEditId] = useState(null)
  const {mutateAsync:postfaqmutation,isPending:postPending} = PostFaqMutation()
  const {mutateAsync:deleteFaq} = DeleteFaq()
  const {mutateAsync:update} = EditFaq()
  const {data,isLoading,isError,error} = GetFaqList({token})
  
   useEffect(() => {
    if(data){
      setFaqs(data)
    }
   },[data])
  
  // useEffect(() => {
  //   const storedFaqs = JSON.parse(localStorage.getItem("faqs"));
  //   if (storedFaqs) {
  //     setFaqs(storedFaqs);
  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem("faqs", JSON.stringify(faqs));
  }, [faqs]);

  const toggleAccordion = (index) => {
    setToggledIndex(index === toggledIndex ? null : index);
  };

  const handleSaveFaq = async() => {
    if (newQuestion && newAnswer && !isEdit) {
        try{
          const faqSaveData = { question: newQuestion, answer: newAnswer }
          faqSaveData.token = token
        await  postfaqmutation(faqSaveData)
        }catch(error){
          console.error(error)
        }
      setNewQuestion("");
      setNewAnswer("");
      setEditingIndex(null);
      setAddModalOpen(false);
    }else{
      try{
         const faqUpdateSaveData = { question: newQuestion, answer: newAnswer }
         faqUpdateSaveData.token = token
         faqUpdateSaveData.id = editId
         console.log(faqUpdateSaveData)
         await update(faqUpdateSaveData)
      }catch(error){
        console.error(error)
      }
      setNewQuestion("");
      setNewAnswer("");
      setEditingIndex(null);
      setAddModalOpen(false);
      setEditId(null)
      setIsEdit(false)
    }
  };

  const handleOpenEditForm = (id,index) => {
    setNewQuestion(faqs[index].question);
    setNewAnswer(faqs[index].answer);
    setEditingIndex(index);
    setEditId(id)
    setIsEdit(true)
    setAddModalOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteIndex(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteFaq = async() => {
    await deleteFaq({'id': deleteIndex,token})
    setDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  const handleReset = () => {
    setNewQuestion("");
    setNewAnswer("");
    setEditingIndex(null);
    setAddModalOpen(true);
    setEditId(null)
    setIsEdit(false)
  };

  if(isLoading){
    return <LoadingPage/>
  }
  if(isError){
    return <p>{error?.response?.data?.message}</p>
  }

  return (
    <div className="mx-auto">
      <div className="flex sm:flex-row flex-col justify-between items-center gap-2 mb-10">
        <h1 className="text-2xl font-semibold">Frequently Asked Questions</h1>
        <button
          className="text-white bg-[#BFA75D] font-medium mt-2 rounded-md text-md px-5 py-3"
          onClick={() => handleReset()}
        >
          Add FAQ
        </button>
      </div>

      <FAQList
        faqs={faqs}
        toggledIndex={toggledIndex}
        toggleAccordion={toggleAccordion}
        onEdit={handleOpenEditForm}
        setEditId={setEditId}
        onDelete={handleOpenDeleteModal}
      />

      {isAddModalOpen && (
        <FAQModal
          title={editingIndex !== null ? "Edit FAQ" : "Add a New FAQ"}
          question={newQuestion}
          answer={newAnswer}
          setQuestion={setNewQuestion}
          setAnswer={setNewAnswer}
          onSave={handleSaveFaq}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          title="Confirm Delete"
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDeleteFaq}
        >
          <p>Are you sure you want to delete this item?</p>
        </DeleteModal>
      )}

   
    </div>
  );
};

export default FaqForm;
