import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { promotionEmailSendApi } from "../../../services/apis";
import { IoMdClose } from "react-icons/io";
const Promotion = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [popupVisible, setPopupVisible] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const data = sendToAll
      ? { subject, message }
      : { email: emailAddress, subject, message };
    const params = {
      sendToAll,
    };

    try {
      const response = await axios.post(
        promotionEmailSendApi.ADMIN_EMAIL_SEND,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params,
        }
      );

      setEmailSent(true);
      setPopupVisible(true);
    } catch (error) {
      throw error;
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setEmailSent(false);
    setEmailAddress("");
    setSubject("");
    setMessage("");
    setSendToAll(false);
  };

  return (
    <div className="flex justify-start p-4">
      <div className="bg-white w-full shadow-lg rounded-lg p-6">
        <div>
          <h2 className="text-3xl font-medium text-[black] text-center mb-6">
            Promotions Email
          </h2>
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="sendToAll"
                checked={sendToAll}
                onChange={() => setSendToAll(!sendToAll)}
                className="mr-2"
              />
              <label
                htmlFor="sendToAll"
                className="text-gray-700 font-semibold"
              >
                Send to all customers
              </label>
            </div>

            {!sendToAll && (
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[black]"
                  required={!sendToAll}
                />
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="subject"
                className="block text-gray-700 font-semibold mb-2"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[black]"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-gray-700 font-semibold mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[black]"
                required
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="flex text-white bg-[#BFA75D] font-medium mt-2 rounded-md text-md px-5 py-3"
              >
                Send Email
              </button>
            </div>
          </form>
        </div>
      </div>

      {popupVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6  shadow-lg w-96">
            <div className=" text-end w-full flex justify-end cursor-pointer">
              <IoMdClose onClick={closePopup} />
            </div>
            <h2 className="text-2xl font-bold text-green-600 text-center">
              Success!
            </h2>
            <p className="text-gray-600 mt-2 text-center">
              The email has been sent successfully{" "}
              {sendToAll ? "to all customers" : `to ${emailAddress}`}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotion;
