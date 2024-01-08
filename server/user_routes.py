from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from models import User  # Assuming your User model is in the 'models' module

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/user/<int:user_id>', methods=['GET'])
@cross_origin(supports_credentials=True)
def get_user(user_id):
    # Your get user implementation here
    pass

# Add more user-related routes as needed
