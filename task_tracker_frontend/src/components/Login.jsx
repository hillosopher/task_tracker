import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://task-tracker-rh3c.onrender.com/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      setTimeout(navigate("/tasks"), 5000); // Navigate to tasks page after login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col place-content-center place-items-center h-screen">
      <div className="flex flex-col text-center m-6 gap-4">
        <h1 className="text-3xl">Welcome to the Task Manager!</h1>
        <h2 className="text-xl">Login to your account</h2>
      </div>
      <form className="flex flex-col gap-3 mt-4 mb-10" onSubmit={handleLogin}>
        <input className="input-field" type="text" placeholder="Email Address" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="input-field" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-[50%] place-self-center mt-4" type="submit">
          Login
        </button>
        {error && (
          <p className="text-center" style={{ color: "red" }}>
            {error}
          </p>
        )}
      </form>
      <h3>
        Don't have an account? Register{" "}
        <Link to="/register" className="text-blue-500 hover:text-blue-700 underline">
          here
        </Link>
        .
      </h3>
    </div>
  );
};

export default Login;
