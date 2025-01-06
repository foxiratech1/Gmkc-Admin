import React, { useState } from "react";
// import signin from "../assets/signin.png";
import signImg from "../../assets/signin.png";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import email_icon from "../../assets/email_icon.png";
import logo from "../../assets/logo_2.png";
import password_icon from "../../assets/password_icon'.png";
import visible_icon from "../../assets/visible_icon.png";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const navigate = useNavigate()

  const redireToDashboard = ()=>{
    navigate("/forget-password")
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const togglePasswordVisibility1 = () => {
    setShowPassword1((prev) => !prev);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Submitted: ", data);
  };
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side: Image Section */}
      <div className="md:w-1/2 relative">
        <img
          src={signImg}
          alt="Containers"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-10 left-10 text-white text-2xl xl:text-4xl font-bold ">
          <p>Your Gateway to any</p>
          <p>Destination in the World.</p>
        </div>
      </div>

      {/* Right Side: Form Section */}
      <div className="md:w-1/2 bg-[#f2f2f2] flex items-center justify-center  relative">
        <div className="max-w-md w-full px-8 mt-10 md:mt-0">
          {/* Form */}
          <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
            Sign In{" "}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1 font-semibold">
                Email
              </label>
              <div className="flex relative items-center justify-between">
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                  placeholder="johndoe@gmail.com"
                  className="w-full border-gray-300 p-3 rounded-md"
                />

                <div className="absolute right-2">
                  <img src={email_icon} alt="" />{" "}
                </div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors?.email?.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="md:w-full">
                <label className="block text-gray-700 mb-1 font-semibold">
                  Password
                </label>
                <div className="flex justify-between items-center relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    placeholder="********"
                    className="w-full border-gray-300 p-3 rounded-md"
                  />
                  <div
                    className="absolute right-2 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    <img
                      className="w-6"
                      src={showPassword ? visible_icon : password_icon}
                      alt={showPassword ? "Hide password" : "Show password"}
                    />
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between w-full mb-4  ">
              <div className=" flex items-center">
                <input type="checkbox" name="rememberMe" className="w-4 h-4" />
                <label className="ml-2 text-gray-700 font-bold">
                  Remember me
                </label>
              </div>

              <Link
                to="/forget-password"
                className="text-sm text-red-500 md:border-b border-red-500 text-center md:text-right "
              >
                Forget Password
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-black text-white p-3 rounded-md font-bold"
              onClick={redireToDashboard}
            >
              Sign In
            </button>

            {/* Already a member */}
            {/* <div className="text-center mt-4 text-gray-600">
              Don’t have an account?
              <a
                href="/sign-up"
                className="text-yellow-600 hover:underline font-semibold"
              >
                Sign Up
              </a>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
