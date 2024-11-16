// import React, { useEffect } from 'react'
// import { useAuth } from './contexts/AuthProvider'
// import SignUp from './screens/SignUp';
// import Home from './Home';
// import { Route, Routes, useNavigate } from 'react-router-dom';
// import Login from './screens/Login';
// import NotFound from './NotFound';

// const App = () => {

//   const {authToken}=useAuth()

//   return (
//     <div>
//       <Routes>
//         {<Route path='/signup' element={!authToken?<SignUp />:<Home />} />}
//         {<Route path='/login' element={!authToken?<Login />:<Home />} />}
//         <Route path='/' element={<Home />} />
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </div>
//   )
// }

// export default App






// import React, { useEffect } from 'react';
// import { useAuth } from './contexts/AuthProvider';
// import SignUp from './screens/SignUp';
// import Home from './Home';
// import { Route, Routes, useNavigate } from 'react-router-dom';
// import Login from './screens/Login';
// import NotFound from './NotFound';

// const App = () => {
//   const { authToken } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Redirect to login if not authenticated
//     if (!authToken) {
//       navigate('/login');
//     }
//   }, [authToken, navigate]);

//   return (
//     <div>
//       <Routes>
//         <Route path='/signup' element={!authToken ? <SignUp /> : <Home />} />
//         <Route path='/login' element={!authToken ? <Login /> : <Home />} />
//         <Route path='/' element={<Home />} />
//         <Route path='*' element={<NotFound />} />
//       </Routes>
//     </div>
//   );
// };

// export default App;





import React from "react";
import { useAuth } from "./contexts/AuthProvider";
import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./screens/SignUp";
import Home from "./Home";
import Login from "./screens/Login";
import NotFound from "./NotFound";

const App = () => {
  const { authToken } = useAuth();

  return (
    <Routes>
      {/* Redirect to "/" if logged in, otherwise allow access to login/signup */}
      <Route
        path="/signup"
        element={!authToken ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!authToken ? <Login /> : <Navigate to="/" />}
      />

      {/* Private route for authenticated users */}
      <Route
        path="/"
        element={authToken ? <Home /> : <Navigate to="/login" />}
      />

      {/* Catch-all for unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
