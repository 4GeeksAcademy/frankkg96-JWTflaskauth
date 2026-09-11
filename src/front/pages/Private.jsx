import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        // Si no hay token en el sessionStorage, redirigir al login inmediatamente
        if (!token) {
            navigate("/login");
            return;
        }

        // Validar el token contra el endpoint protegido del backend
        const validateToken = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/private", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    // Si el token es inválido o expiró, limpiar sessionStorage y redirigir
                    sessionStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                const data = await response.json();
                setUserData(data.user);
            } catch (error) {
                sessionStorage.removeItem("token");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [navigate]);

    if (loading) {
        return <div className="text-center mt-5">Cargando contenido privado...</div>;
    }

    return (
        <div className="container mt-5 text-center">
            <div className="card p-4 shadow-sm">
                <h1 className="text-success mb-3">🔒 Zona Privada</h1>
                <p className="lead">¡Bienvenido a tu menú exclusivo de usuario autenticado!</p>
                {userData && (
                    <p>
                        Autenticado como: <strong>{userData.email}</strong>
                    </p>
                )}
            </div>
        </div>
    );
};