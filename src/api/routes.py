"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# 1. REGISTRO: Crear un nuevo usuario

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()

    if not body:
        return jsonify({"msg": "Cuerpo de solicitud requerido"}), 400

    email = body.get("email", None)
    password = body.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son obligatorios"}), 400
    

# Verificar si el usuario ya existe
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"msg": "El usuario ya existe"}), 409

# Crear el nuevo usuario
    new_user = User(email=email, password=password, is_active=True)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "Usuario registrado exitosamente"}), 201



# 2. LOGIN: Autenticar y retornar el token JWT

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()

    if not body:
        return jsonify({"msg": "Cuerpo de solicitud requerido"}), 400

    email = body.get("email", None)
    password = body.get("password", None)

    if not email or not password:
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    user = User.query.filter_by(email=email, password=password).first()
    if not user:
        return jsonify({"msg": "Correo o contraseña incorrectos"}), 401

 # Crear token JWT con el id del usuario como identidad
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200

 # 3. PRIVADO: Ruta protegida con JWT

@api.route('/private', methods=['GET'])
@jwt_required()
def private():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    return jsonify({
        "msg": "Acceso autorizado a la ruta privada",
        "user": user.serialize()
    }), 200    


    








    