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
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100))
    content = db.Column(db.Text)
    userName = db.Column(db.String(50))
    likes = db.Column(db.Integer)
    dislikes = db.Column(db.Integer)
    comments = db.relationship('Comment', backref='post', lazy=True, cascade="all, delete-orphan")  #bez ovog delete-oprhan ne radi brisanje
    commentNumber = db.Column(db.Integer, nullable=False)
    locked = db.Column(db.Boolean, default=False)
    subscribed = db.Column(db.Boolean, default=False)

class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.Text)
    author = db.Column(db.String(50), nullable=False)
    likes = db.Column(db.Integer, default=0)
    dislikes = db.Column(db.Integer, default=0)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)

