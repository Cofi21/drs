# app.py
from flask import Flask
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from routes import auth_blueprint  # Correct import path
from database import db
#from routes.user_routes import user_blueprint

app = Flask(__name__)
CORS(app, supports_credentials=True, origins='http://localhost:5173')
app.config['CORS_HEADERS'] = 'Content-Type'

DATABASE_URI = "mysql://root:my-secret-pw@mysql/maindb"
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

app.register_blueprint(auth_blueprint, url_prefix='/auth')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    from routes import login, register
    # Import routes after initializing the Flask app and SQLAlchemy

    app.run(debug=True, host="0.0.0.0", port=3003)
