from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'

# Update your Python app's database connection settings
DATABASE_URI = "mysql://root:my-secret-pw@mysql/maindb"
# mysql://username:password@host:port/database_name

app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Import routes after initializing the Flask app and SQLAlchemy
from routes import login, register

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True, host="0.0.0.0", port=3003)
