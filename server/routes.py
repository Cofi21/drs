from flask import request, jsonify, redirect, url_for
from app import app, db
from models import User

# Login route
@app.route('/login', methods=['POST'])
def login():
     data = request.get_json()

     username = data.get('username')
     password = data.get('password')

     user = User.query.filter_by(email=username, password=password).first()

     if user:
         return jsonify({'message': 'Successful login'}), 200
     else:
         return jsonify({'message': 'Invalid username or password'}), 401


# Registration route
@app.route('/registration', methods=['POST'])
def register():
    registration_data = request.json

    email = registration_data.get('email')
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({'message': 'User with this email already exists'}), 409

    try:
        new_user = User(
            firstName=registration_data['firstName'],
            lastName=registration_data['lastName'],
            address=registration_data['address'],
            city=registration_data['city'],
            country=registration_data['country'],
            phoneNumber=registration_data['phoneNumber'],
            email=registration_data['email'],
            password=registration_data['password']
        )

        db.session.add(new_user)
        db.session.commit()

        # Redirect to the login page after successful registration
        return redirect('/login')

    except Exception as e:
        # Handle any unexpected errors during registration
        print('Error during registration:', str(e))
        return jsonify({'message': 'Error during registration'}), 500
        