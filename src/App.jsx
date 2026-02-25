import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUpHome from "./pages/auth/SignUpHome";
import SignUpCustomer from "./pages/auth/SignUpCustomer";
import SignUpProvider from "./pages/auth/SignUpProvider";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpHome />} />
      <Route path="/signup/customer" element={<SignUpCustomer />} />
      <Route path="/signup/provider" element={<SignUpProvider />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
