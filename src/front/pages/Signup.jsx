import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Error al registrar usuario");
            }
            // Redireccionar al login tras registro exitoso
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "450px" }}>
            <h2 className="mb-4 text-center">Registro de Usuario</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Registrarse
                </button>
                <p className="mt-3 text-center">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </p>
            </form>
        </div>
    );
};




