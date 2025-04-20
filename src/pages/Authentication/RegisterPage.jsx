import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignUpPage from "./SignUpPage";
import NamePage from "./NamePage";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div>
      <Routes>
        <Route 
          path="/" 
          element={
            <SignUpPage 
              onSubmit={(email, password) => {
                setEmail(email);
                setPassword(password);
                navigate("/auth/signup/name");
              }}
            />
          } 
        />
        <Route 
          path="/name" 
          element={
            <NamePage 
              email={email} 
              password={password} 
              onBack={() => {
                setEmail("");
                setPassword("");
                navigate("/auth/signup");
              }}
            />
          } 
        />
      </Routes>
    </div>
  );
};

export default RegisterPage;