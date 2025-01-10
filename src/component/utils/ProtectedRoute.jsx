import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const {token} = useSelector((state) => state.user)
 
  return token ? (
    <Component {...rest} /> 
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default ProtectedRoute;


// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
//   return isLoggedIn ? (
//     <Component {...rest} /> 
//   ) : (
//     <Navigate to="/sign-in" /> 
//   );
// };

// export default ProtectedRoute;
