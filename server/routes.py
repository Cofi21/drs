from flask import Blueprint, request, jsonify, redirect,session
from flask_cors import cross_origin
from database import db, User,Post,Comment


auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')



    user = User.query.filter_by(email=username, password=password).first()

    if user:
        user_data = {
            'id': user.id,
            'firstName' : user.firstName,
            'lastName' : user.lastName,
            'address' : user.address,
            'city' : user.city,
            'country' : user.country,
            'phoneNumber' : user.phoneNumber,
            'email' : user.email,
            'password' : user.password
        }
        response = jsonify({'message': 'Successful login', 'user': user_data})
        return response, 200
    else:
        response = jsonify({'message': 'Invalid username or password'})
        return response, 401

@auth_blueprint.route('/registration', methods=['POST'])
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
        return jsonify({'message': 'Registration successful'}), 200

    except Exception as e:
        # Handle any unexpected errors during registration
        print('Error during registration:', str(e))
        return jsonify({'message': 'Error during registration'}), 500

# Assuming you have a route to fetch user data
@auth_blueprint.route('/userInfo/<int:id>', methods=['GET'])  # Assuming user_id is an integer
def get_user_data(id):

    print("OVO JE TVOJ ID", id)
    matching_user = User.query.get(id)

    if matching_user:
        # Convert SQLAlchemy object to dictionary
        user_data = {
            'firstName': matching_user.firstName,
            'lastName': matching_user.lastName,
            'address': matching_user.address,
            'city': matching_user.city,
            'country': matching_user.country,
            'phoneNumber': matching_user.phoneNumber,
            'email': matching_user.email,
            'password': matching_user.password
        }
        # Set the Content-Type header to indicate JSON
        return jsonify(user_data), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    
@auth_blueprint.route('/userInfo/<int:id>', methods=['PUT'])
def update_user_data(id):
    matching_user = User.query.get(id)

    if matching_user:
        # Assuming you receive the updated data in JSON format
        updated_data = request.get_json()

        # Update user attributes
        matching_user.firstName = updated_data.get('firstName', matching_user.firstName)
        matching_user.lastName = updated_data.get('lastName', matching_user.lastName)
        matching_user.address = updated_data.get('address', matching_user.address)
        matching_user.city = updated_data.get('city', matching_user.city)
        matching_user.country = updated_data.get('country', matching_user.country)
        matching_user.phoneNumber = updated_data.get('phoneNumber', matching_user.phoneNumber)
        matching_user.email = updated_data.get('email', matching_user.email)
        matching_user.password = updated_data.get('password', matching_user.password)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({'message': 'User updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    
@auth_blueprint.route('/postSection', methods=['POST'])
def create_post():
    try:
        data = request.get_json()

        new_post = Post(
            title=data['title'],
            content=data['content'],
            userName=data['userName'],
            likes=0,
            dislikes=0,
            commentNumber=0,
        )

        db.session.add(new_post)
        db.session.commit()

        posts = Post.query.all()

            # Convert posts to a list of dictionaries
        posts_list = [{'id': post.id,
                'title': post.title,
                    'content': post.content,
                    'userName': post.userName,
                        'likes': post.likes,
                        'dislikes': post.dislikes,
                        }
                        for post in posts]

        return jsonify(posts_list)
    except Exception as e:
        print(f"Error fetching posts: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


@auth_blueprint.route('/', methods=['GET'])
def onload():
    try:
        # Fetch all posts from the database
        posts = Post.query.all()

        # Convert posts to a list of dictionaries
        posts_list = [{
                        'id' : post.id,
                        'title': post.title,
                       'content': post.content,
                       'userName': post.userName,
                       'likes': post.likes,
                       'dislikes': post.dislikes,
                       'likedBy': post.likedBy,
                       'dislikedBy': post.dislikedBy,
                       'commentNumber': post.commentNumber}
                      for post in posts]

        return jsonify(posts_list)
    except Exception as e:
        print(f"Error fetching posts: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
#Promeniti ovaj comment GET i POST
@auth_blueprint.route('/postSection/<int:post_id>/comments', methods=['POST'])
def post_comments(post_id):
    
        
        data = request.get_json()
        print('Received data:', data)

        # Create a new comment
        new_comment = Comment(content=data.get('content'), post_id=post_id, author=data.get('author'))

        # Add the new comment to the database
        db.session.add(new_comment)
        db.session.commit()

        # Update the commentNumber for the associated post
        post = Post.query.get_or_404(post_id)
        post.commentNumber += 1
        db.session.commit()

        return jsonify({'message': 'Comment added successfully'})


@auth_blueprint.route('/postSection/<int:post_id>/comments', methods=['GET'])
def get_post_comments(post_id):
    try:
        post = Post.query.get_or_404(post_id)
        comments = Comment.query.filter_by(post_id=post_id).all()
        comments_list = [{'id': comment.id, 'content': comment.content, 'author': comment.author.username} for comment in comments]

        return jsonify({'post': {'id': post.id, 'title': post.title, 'comments': comments_list}})
    except Exception as e:
        print(f"Error fetching comments: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


  


    
#Unapredjeni delete koji automatski brise sve komentare vezane za dati post!!!!
@auth_blueprint.route('/postSection/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    try:
        # Find the post by ID
        post_to_delete = Post.query.get(post_id)

        if post_to_delete:
            # pogledati da li ima komentara vezanih za post
            if post_to_delete.comments:
                # obrisati sve komentare
                for comment in post_to_delete.comments:
                    db.session.delete(comment)

            # obrisati post
            db.session.delete(post_to_delete)
            db.session.commit()

            return jsonify({'message': 'Post deleted successfully'})
        else:
            return jsonify({'error': 'Post not found'}), 404
    except Exception as e:
        print(f"Error deleting post: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

'''lajkovanje i dislajkovanje postova'''
@auth_blueprint.route('/postSection/<int:post_id>/like', methods=['POST'])
def like_post(post_id):
    post = Post.query.get_or_404(post_id)
    post.likes += 1
    db.session.commit()
    return jsonify({'message': 'Post liked successfully', 'likes': post.likes})

@auth_blueprint.route('/postSection/<int:post_id>/dislike', methods=['POST'])
def dislike_post(post_id):
    post = Post.query.get_or_404(post_id)
    post.dislikes += 1
    db.session.commit()
    return jsonify({'message': 'Post disliked successfully', 'dislikes': post.dislikes})

@auth_blueprint.route('/theme/<int:post_id>', methods=['GET'])
def get_post_by_id(post_id):
    try:
        post = Post.query.get(post_id)

        if post:
            post_data = {
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'userName': post.userName,
                'likes': post.likes,
                'dislikes': post.dislikes,
                'likedBy': post.likedBy,
                'dislikedBy': post.dislikedBy,
                'commentNumber' : post.commentNumber
            }
            return jsonify(post_data), 200
        else:
            return jsonify({'error': 'Post not found'}), 404
    except Exception as e:
        print(f"Error fetching post: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

