import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import View from "./Components/View";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import ForgotPassword from "./Components/ForgotPassword";
import Otp from "./Components/Otp";
import ResetPassword from "./Components/ResetPassword";
import CreatePost from "./Components/CreatePost";
import Account from "./Components/Account";
import EditPost from "./Components/EditPost";
import Category from "./Components/Category";
import UserAccount from "./Components/UserAccount";

export const url = import.meta.env.VITE_BACKEND_URL;

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="blog/:id" element={<View />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="verification/email" element={<ForgotPassword />} />
          <Route path="verification/otp/email/:id" element={<Otp />} />
          <Route path="password/reset/:id" element={<ResetPassword />} />
          <Route path="new/blog" element={<CreatePost />} />
          <Route path="profile" element={<Account />} />
          <Route path="edit/blog/:id" element={<EditPost />} />
          <Route path="blog/category/:id" element={<Category />} />
          <Route path="user/:username" element={<UserAccount />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
