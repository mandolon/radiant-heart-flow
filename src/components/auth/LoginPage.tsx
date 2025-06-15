import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => { navigate("/auth", { replace: true }); }, [navigate]);
  return null;
};

export default LoginPage;
