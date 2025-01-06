// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ component: Component, ...rest }) => {
//   const isLoggedIn = !!localStorage.getItem("token");

//   return isLoggedIn ? (
//     <Component {...rest} /> 
//   ) : (
//     <Navigate to="/sign-in" />
//   );
// };

// export default ProtectedRoute;


import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  return isLoggedIn ? (
    <Component {...rest} /> 
  ) : (
    <Navigate to="/sign-in" /> 
  );
};

export default ProtectedRoute;
