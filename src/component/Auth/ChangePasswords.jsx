import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { authendpoints } from "../../services/apis";
import toast from "react-hot-toast";

const ChangePasswordUI = () => {
  const navigate = useNavigate();
  const [currentPasswordType, setCurrentPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");
  const [reEnterPasswordType, setReEnterPasswordType] = useState("password");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handlePasswordToggle = (type, setType) => {
    setType(type === "password" ? "text" : "password");
  };

  const { token } = useSelector((state) => state.user);
  const onSubmit = async (data) => {
    if (!token) {
      console.error("Token not found");
      return;
    }

    try {
      const response = await axios.post(
        `${authendpoints.CHANGE_PASSWORD}`,
        {
          currentPassword: data.currentpass,
          newPassword: data.newpassword,
          confirmPassword: data.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("responseresponse", response);

      if (response.status === 200) {
        console.log("Password changed successfully");
        navigate("/");
        reset();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen font-raleway">
      <div className="w-full max-w-md p-5 bg-white rounded shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-10">
          Change Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <label className="text-sm font-raleway bg-white absolute -top-3 left-2 px-2">
              Enter Current Password
            </label>
            <div className="flex items-center">
              <input
                type={currentPasswordType}
                {...register("currentpass", {
                  required: "Current Password is required",
                })}
                placeholder="***********"
                className="w-full px-3 py-3 border border-gray-400 rounded-md outline-none"
              />
              {currentPasswordType === "password" ? (
                <FaEyeSlash
                  className="-ml-8 cursor-pointer"
                  onClick={() =>
                    handlePasswordToggle(
                      currentPasswordType,
                      setCurrentPasswordType
                    )
                  }
                />
              ) : (
                <FaEye
                  className="-ml-8 cursor-pointer"
                  onClick={() =>
                    handlePasswordToggle(
                      currentPasswordType,
                      setCurrentPasswordType
                    )
                  }
                />
              )}
            </div>
            {errors.currentpass && (
              <p className="text-red-500">{errors.currentpass.message}</p>
            )}
          </div>

          <div className="relative">
            <label className="text-sm font-raleway bg-white absolute -top-3 left-2 px-2">
              New Password
            </label>
            <div className="flex items-center">
              <input
                type={newPasswordType}
                {...register("newpassword", {
                  required: "New Password is required",
                })}
                placeholder="***********"
                className="w-full px-3 py-3 border border-gray-400 rounded-md outline-none"
              />
              {newPasswordType === "password" ? (
                <FaEyeSlash
                  className="-ml-8 cursor-pointer"
                  onClick={() =>
                    handlePasswordToggle(newPasswordType, setNewPasswordType)
                  }
                />
              ) : (
                <FaEye
                  className="-ml-8 cursor-pointer"
                  onClick={() =>
                    handlePasswordToggle(newPasswordType, setNewPasswordType)
                  }
                />
              )}
            </div>
            {errors.newpassword && (
              <p className="text-red-500">{errors.newpassword.message}</p>
            )}
          </div>

          <div className="relative">
            <label className="text-sm font-raleway bg-white absolute -top-3 left-2 px-2">
              Confirm Password
            </label>
            <div className="flex items-center">
              <input
                type={reEnterPasswordType}
                {...register("confirmPassword", {
                  required: "Please re-enter your password",
                })}
                placeholder="***********"
                className="w-full px-3 py-3 border border-gray-400 rounded-md outline-none"
              />
              {reEnterPasswordType === "password" ? (
                <FaEyeSlash
                  className="-ml-8 cursor-pointer"
                  onClick={() =>
                    handlePasswordToggle(
                      reEnterPasswordType,
                      setReEnterPasswordType
                    )
                  }
                />
              ) : (
                <FaEye
                  className="-ml-8 cursor-pointer"
                  onClick={() =>
                    handlePasswordToggle(
                      reEnterPasswordType,
                      setReEnterPasswordType
                    )
                  }
                />
              )}
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-md font-bold mt-6"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordUI;
