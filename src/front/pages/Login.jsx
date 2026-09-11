import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || "Credenciales inválidas");
            }

            // Guardar el token en el sessionStorage según la consigna
            sessionStorage.setItem("token", data.access_token);

            // Redirigir a la ruta privada
            navigate("/private");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "450px" }}>
            <h2 className="mb-4 text-center">Iniciar Sesión</h2>
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
                <button type="submit" className="btn btn-success w-100">
                    Entrar
                </button>
                <p className="mt-3 text-center">
                    ¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link>
                </p>
            </form>
        </div>
    );
};