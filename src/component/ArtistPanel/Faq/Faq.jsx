import React, { useState, useEffect } from "react";
import DeleteModal from "../../utils/DeleteModal";
import FAQList from "./FaqList";
import FAQModal from "./FaqModal";

const FaqForm = () => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toggledIndex, setToggledIndex] = useState(null);

  useEffect(() => {
    const storedFaqs = JSON.parse(localStorage.getItem("faqs"));
    if (storedFaqs) {
      setFaqs(storedFaqs);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("faqs", JSON.stringify(faqs));
  }, [faqs]);

  const toggleAccordion = (index) => {
    setToggledIndex(index === toggledIndex ? null : index);
  };

  const handleSaveFaq = () => {
    if (newQuestion && newAnswer) {
      const updatedFaqs =
        editingIndex !== null
          ? faqs.map((faq, index) =>
              index === editingIndex
                ? { question: newQuestion, answer: newAnswer }
                : faq
            )
          : [...faqs, { question: newQuestion, answer: newAnswer }];

      setFaqs(updatedFaqs);
      setNewQuestion("");
      setNewAnswer("");
      setEditingIndex(null);
      setAddModalOpen(false);
    }
  };

  const handleOpenEditForm = (index) => {
    setNewQuestion(faqs[index].question);
    setNewAnswer(faqs[index].answer);
    setEditingIndex(index);
    setAddModalOpen(true);
  };

  const handleOpenDeleteModal = (index) => {
    setDeleteIndex(index);
    setDeleteModalOpen(true);
  };

  const confirmDeleteFaq = () => {
    const updatedFaqs = faqs.filter((_, index) => index !== deleteIndex);
    setFaqs(updatedFaqs);
    setDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  const handleReset = () => {
    setNewQuestion("");
    setNewAnswer("");
    setEditingIndex(null);
    setAddModalOpen(true);
  };

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
