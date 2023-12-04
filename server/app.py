from flask import Flask, request, jsonify
import jinja2
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Dummy user data for demonstration purposes
users = {
    'user1': {'password': 'password1'},
    'user2': {'password': 'password2'},
}

# Login route
@app.route('/', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    if username in users and users[username]['password'] == password:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

if __name__ == '__main__':
    app.run(debug=True)
