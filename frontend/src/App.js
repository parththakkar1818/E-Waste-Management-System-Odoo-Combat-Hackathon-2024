import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import Login from "./pages/Login.jsx";
import Tasks from "./pages/Tasks.jsx";
import SignupForm from "./Components/Form.jsx";
import ItemForm from "./Components/ItemForm.jsx";
import PayPalCheckout from './Components/PayPal.jsx'
import TaskDetail from "./Components/TaskDetail.jsx";


const App = () => {
  return (
    <div>
      <Router>
        <main className="w-full min-h-screen bg-[#f3f4f6]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/form" element={<SignupForm />} />
            <Route path="/itemform" element={<ItemForm />} />
            <Route path="/pay" element={<PayPalCheckout />} />

            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Tasks />} />
              <Route path="/pending/:status" element={<Tasks />} />
              <Route path="/accepted/:status" element={<Tasks />} />
              <Route path="/pickup/:status" element={<Tasks />} />
              <Route path="/payment/:status" element={<Tasks />} />{" "}
              <Route path="/task/:id" element={<TaskDetail />} />
            </Route>
            <Route path="/log-in" element={<Login />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;

function Layout() {
  // const { user } = useSelector((state) => state.auth);

  const location = useLocation();
  return true ? (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <Navbar />
        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  );
}
