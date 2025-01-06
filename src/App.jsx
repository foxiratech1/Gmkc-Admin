// // import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// // import ArtistPanel from "./component/ArtistPanel/ArtistPanel";
// // import Navbar from "./component/Auth/Navbar";
// // import SignIn from "./component/Auth/SignIn";
// // import Otp from "./component/Auth/Otp";
// // import ChangePassword from "./component/Auth/ChangePassword";
// // import ForgetPassword from "./component/Auth/ForgetPassword";
// // import ResetPassword from "./component/Auth/ResetPassword";
// // import ProtectedRoute from "./component/utils/ProtectedRoute";

// // function App() {
// //   return (
// //     <>
// //       <ProtectedRoute>
// //         <Router>
// //           <Navbar />
// //           <Routes>
// //             <Route path="/*" element={<ArtistPanel />} />
// //             <Route path="/sign-in" element={<SignIn />} />
// //             <Route path="/forget-password" element={<ForgetPassword />} />
// //             <Route path="/otp" element={<Otp />} />
// //             <Route path="/change-password" element={<ChangePassword />} />
// //             <Route path="/reset-password" element={<ResetPassword />} />
// //           </Routes>
// //         </Router>
// //       </ProtectedRoute>
// //     </>
// //   );
// // }

// // export default App;

// // import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// // import ArtistPanel from "./component/ArtistPanel/ArtistPanel";
// // import Navbar from "./component/Auth/Navbar";
// // import SignIn from "./component/Auth/SignIn";
// // import Otp from "./component/Auth/Otp";
// // import ChangePassword from "./component/Auth/ChangePassword";
// // import ForgetPassword from "./component/Auth/ForgetPassword";
// // import ResetPassword from "./component/Auth/ResetPassword";
// // import ProtectedRoute from "./component/utils/ProtectedRoute";

// // function App() {
// //   return (
// //     <Router>
// //       <Navbar />
// //       <Routes>
// //         {/* Public routes */}
// //         <Route path="/sign-in" element={<SignIn />} />
// //         <Route path="/forget-password" element={<ForgetPassword />} />
// //         <Route path="/otp" element={<Otp />} />
// //         <Route path="/change-password" element={<ChangePassword />} />
// //         <Route path="/reset-password" element={<ResetPassword />} />

// //         {/* Protected routes */}
// //         <Route
// //           path="/*"
// //           element={
// //             <ProtectedRoute component={ArtistPanel} />
// //           }
// //         />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;

// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import ArtistPanel from "./component/ArtistPanel/ArtistPanel";
// import Navbar from "./component/Auth/Navbar";
// import SignIn from "./component/Auth/SignIn";
// import Otp from "./component/Auth/Otp";
// import ChangePassword from "./component/Auth/ChangePassword";
// import ForgetPassword from "./component/Auth/ForgetPassword";
// import ResetPassword from "./component/Auth/ResetPassword";
// import ProtectedRoute from "./component/utils/ProtectedRoute";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         {/* Public routes */}
//         <Route path="/sign-in" element={<SignIn />} />
//         <Route path="/forget-password" element={<ForgetPassword />} />
//         <Route path="/otp" element={<Otp />} />
//         <Route path="/change-password" element={<ChangePassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />

//         {/* Protected routes */}
//         <Route
//           path="/*"
//           element={
//             <ProtectedRoute component={ArtistPanel} />
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ArtistPanel from "./component/ArtistPanel/ArtistPanel";
import Navbar from "./component/Auth/Navbar";
import SignIn from "./component/Auth/SignIn";
import Otp from "./component/Auth/Otp";
import ChangePassword from "./component/Auth/ChangePassword";
import ForgetPassword from "./component/Auth/ForgetPassword";
import ResetPassword from "./component/Auth/ResetPassword";
import ProtectedRoute from "./component/utils/ProtectedRoute";
import Dashboard from "./component/ArtistPanel/Dashboard/Dashboard";

function App() {
  const isLoggedIn = false;

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/*" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} component={ArtistPanel} />
          }
        />
        {/* <Route
          path="/*"
          element={
            <ArtistPanel/>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
