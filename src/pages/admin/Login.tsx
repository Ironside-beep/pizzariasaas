import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a nova página de login
    navigate("/auth/login");
  }, [navigate]);

  return null;
}
