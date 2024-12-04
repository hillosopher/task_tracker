import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskList from "./components/TaskList";
import "./index.css";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("access_token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
