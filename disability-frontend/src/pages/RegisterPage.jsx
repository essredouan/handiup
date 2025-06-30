import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const resRegister = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const dataRegister = await resRegister.json();

      if (!resRegister.ok) {
        setError(dataRegister.message || "خطأ ف التسجيل");
        return;
      }

      const resLogin = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const dataLogin = await resLogin.json();

      if (!resLogin.ok) {
        setError(dataLogin.message || "خطأ ف تسجيل الدخول");
        return;
      }

      localStorage.setItem("token", dataLogin.token);
      navigate("/");
    } catch (err) {
      setError("حدث خطأ ما. حاول مرة أخرى.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>تسجيل حساب جديد</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>اسم المستخدم</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
          />
        </div>
        <div>
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>كلمة السر</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
          تسجيل
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
