    import React from "react";
    import { Link, useNavigate } from "react-router-dom";

    export const Navbar = () => {
      const navigate = useNavigate();
      const token = sessionStorage.getItem("token");

      const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
      };

      return (
        <nav className="navbar navbar-light bg-light mb-3 px-4">
          <Link to="/" className="navbar-brand mb-0 h1">
            JWT App
          </Link>
          <div className="ml-auto d-flex gap-2">
            {!token ? (
              <>
                <Link to="/signup" className="btn btn-outline-primary">
                  Registro
                </Link>
                <Link to="/login" className="btn btn-primary">
                  Iniciar Sesión
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-danger">
                Cerrar Sesión
              </button>
            )}
          </div>
        </nav>
      );
    };