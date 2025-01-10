import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import logo from "../../assets/logo.png";
import { AiOutlineDashboard } from "react-icons/ai";
import { GrDeliver } from "react-icons/gr";
import { FaRegUser, FaBoxes } from "react-icons/fa";
import LogoutModal from "../utils/LogoutModal";
import { LuMessageSquareQuote } from "react-icons/lu";
import { LuNotebookPen } from "react-icons/lu";
import { FaRegQuestionCircle } from "react-icons/fa";
import { HiMiniArrowLeftStartOnRectangle } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { setIsAuthorized, setToken } from "../../store/userSlice/userSlice";

export const sections = [
  {
    key: "dashboard",
    icon: <AiOutlineDashboard size={28} />,
    label: "Dashboard",
    path: "",
  },
  {
    key: "shipment",
    icon: <FaBoxes size={28} />,
    label: "Shipment",
    path: "shipment",
  },
  {
    key: "request",
    icon: <LuMessageSquareQuote size={28} />,
    label: "Requests",
    path: "request",
  },
  {
    key: "vehicle",
    icon: <GrDeliver size={28} />,
    label: "Vehicles",
    path: "vehicles",
  },
  {
    key: "customer",
    icon: <FaRegUser size={28} />,
    label: "Customer",
    path: "customer",
  },
  {
    key: "inquiry",
    icon: <LuNotebookPen size={28} />,
    label: "Inquiry",
    path: "inquiry",
  },
  {
    key: "users",
    icon: <FaRegUser size={28} />,
    label: "Users",
    path: "users",
  },
  {
    key: "faq",
    icon: <FaRegQuestionCircle size={28} />,
    label: "Faq",
    path: "faq",
  },
];

const SideBar = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const redirectToHome = () => {
    navigate("/");
  };
  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };

  const handleSectionClick = (key) => {
    setActiveSection(activeSection === key ? null : key);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const logoutHendler = () => {
      dispatch(setToken(''))
      dispatch(setIsAuthorized(false))
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSideBar}
        ></div>
      )}
 
      <div className="flex transition-all duration-300 h-full">
        <div
          className={`fixed lg:static top-0 left-0 h-full z-40 transition-all duration-300 bg-black text-white flex flex-col ${
            isOpen ? "w-72 px-2 bg-black" : "w-20 px-3 mx-2"
          } ${
            isOpen ? "translate-x-0" : "-translate-x-[20%]"
          } lg:translate-x-0`}
        >
          <button
            onClick={toggleSideBar}
            className="absolute lg:hidden block top-2 -right-5 bg-white text-black shadow-lg p-3 rounded-full transform hover:scale-110"
          >
            {isOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
          </button>
          <div className="px-10 py-2 lg:hidden block">
              <img
                src={logo}
                alt="logo"
                className="w-44"
                onClick={redirectToHome}
              />
          </div>

          <div className="flex relative flex-col justify-between h-auto mt-12">
            <ul>
              {sections.map((section) => (
                <li key={section.key}>
                  <>
                    <Link
                      to={`/${section.path}`}
                      className={`flex py-3 hover:bg-[#BFA75D] items-center gap-5 mt-2 px-3 rounded-md ${
                        location.pathname === `/${section.path}`
                          ? "bg-[#BFA75D] w-full hover:bg-[#BFA75D]"
                          : ""
                      }`}
                      onClick={() => handleSectionClick(section.key)}
                    >
                      <p>{section.icon}</p>
                      {(isOpen || window.innerWidth >= 1024) && (
                        <p>{section.label}</p>
                      )}
                    </Link>

                    {section.submenu &&
                      activeSection === section.key &&
                      (isOpen || window.innerWidth >= 1024) && (
                        <ul className="submenu pl-6 mt-2">
                          {section.submenu.map((submenuItem) => (
                            <li key={submenuItem.key}>
                              <Link
                                to={`/${submenuItem.path}`}
                                className={`flex my-2 hover:bg-[#BFA75D] py-2 items-center gap-2 px-3 rounded-md ${
                                  location.pathname === `/${submenuItem.path}`
                                    ? "bg-[#BFA75D]"
                                    : ""
                                }`}
                              >
                                <p>{submenuItem.icon}</p>
                                {(isOpen || window.innerWidth >= 1024) && (
                                  <p> {submenuItem.label}</p>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                  </>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <button
                onClick={handleModalToggle}
                className="flex items-center mt-2 space-x-4 px-3 py-3 w-full rounded-md hover:bg-[#BFA75D]"
              >
                <HiMiniArrowLeftStartOnRectangle size={28} />
                {(isOpen || window.innerWidth >= 1024) && <p>Log Out</p>}
              </button>
            </div>
          </div>
        </div>
        <LogoutModal
          isModalOpen={isModalOpen}
          handleModalToggle={handleModalToggle}
          logoutHendler={logoutHendler}
        />
      </div>
    </>
  );
};

export default SideBar;
