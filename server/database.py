from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstName = db.Column(db.String(20))
    lastName = db.Column(db.String(20))
    address = db.Column(db.String(20))
    city = db.Column(db.String(20))
    country = db.Column(db.String(20))
    phoneNumber = db.Column(db.String(20))
    email = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(20))

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    content = db.Column(db.Text)
    userName = db.Column(db.String(50))
    likes = db.Column(db.Integer)
    dislikes = db.Column(db.Integer)
    likedBy = db.Column(db.PickleType)
    dislikedBy = db.Column(db.PickleType)
    comments = db.relationship('Comment', backref='post', lazy=True)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    authoor = db.Column(db.String(20))
    content = db.Column(db.String(255), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
