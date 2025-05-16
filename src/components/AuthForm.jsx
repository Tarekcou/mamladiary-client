import { useState } from "react";
import axiosPublic from "../axios/axiosPublic";
import { useNavigate } from "react-router";

export default function AuthForm() {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dnothiId: "",
    password: "",
    section: "",
    podobi: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      console.log("Register data:", formData);
      // TODO: API call to register
      const res = axiosPublic.post("/users", formData);
      res
        .then((response) => {
          console.log("Registration successful:", response.data);
          if (response.data.status === "success") {
            alert("Registration successful");
            navigation("/dashboard");
          }
          if (response.data.message === "user already exist") {
            alert("User already exists");
            navigation("/login");
          }
        })
        .catch((error) => {
          console.error("Error during registration:", error);
        });
    } else {
      console.log("Sign in data:", {
        identifier: formData.dnothiId || formData.email,
        password: formData.password,
      });

      // TODO: API call to sign in

      const res = axiosPublic.get("/users", { params: formData });
      res
        .then((response) => {
          console.log("Login successful:", response.data);
          if (response.data) {
            alert("Login successful");
            navigation("/dashboard");
          }
        })
        .catch((error) => {
          console.error("Error during Login:", error);
        });
    }
  };

  return (
    <div
      style={{
        boxShadow:
          "4px 0 4px -4px rgba(0, 0, 0, 0.1), -6px 0 6px -4px rgba(0, 0, 0, 0.1)",
      }}
      className="flex justify-center items-center shadow-none px-4"
    >
      <div className="bg-white px-16 py-4 rounded-2xl max-w-xl">
        <h2 className="mb-6 font-bold text-2xl text-center">
          {isRegistering ? "Register" : "Sign In"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg w-full"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg w-full"
              />
              <input
                type="text"
                name="dnothiId"
                placeholder="DNothi ID"
                value={formData.dnothiId}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg w-full"
              />
            </>
          )}

          {!isRegistering && (
            <input
              type="text"
              name="dnothiId"
              placeholder="Email or DNothi ID"
              value={formData.dnothiId}
              onChange={handleChange}
              required
              className="px-4 py-2 border rounded-lg w-full"
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg w-full"
          />

          {isRegistering && (
            <>
              <input
                type="text"
                name="section"
                placeholder="Section"
                value={formData.section}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg w-full"
              />
              <input
                type="text"
                name="podobi"
                placeholder="Podobi"
                value={formData.podobi}
                onChange={handleChange}
                required
                className="px-4 py-2 border rounded-lg w-full"
              />
            </>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg w-full font-semibold text-white transition"
          >
            {isRegistering ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="ml-2 text-blue-600 hover:underline"
          >
            {isRegistering ? "Sign In" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
