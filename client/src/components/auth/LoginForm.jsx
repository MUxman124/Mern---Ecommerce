import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import useAuthStore from "../../store/AuthStore";
import axios from "axios";

export function LoginForm() {
  const navigate = useNavigate();

  const { isAuthenticated, login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );
      login(response.data?.token);
      setTimeout(() => {
        navigate("/admin/products");
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your credentials to access your account
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div className="space-y-2">
          <Input
            id="email"
            placeholder="Email"
            required
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Input
            id="password"
            placeholder="Password"
            required
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <Button className="w-full" type="submit">
          Login
        </Button>
      </form>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Button variant="link" onClick={() => navigate("/signup")}>
          Sign up
        </Button>
      </div>
    </div>
  );
}
