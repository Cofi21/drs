from flask import Blueprint, request, jsonify, redirect,session
from flask_cors import cross_origin
from database import db, User,Post,Comment,Like,Dislike

import threading
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

smtp_server = 'smtp.gmail.com'
smtp_port = 587   
smtp_username = 'forumdrs2023@gmail.com'
smtp_password = 'hsyk fmse qrrc wyni'



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
            locked = False,
            subscribed = False
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
                        'locked': post.locked,
                        'subscribed': post.subscribed
                        }
                        for post in posts]

        return jsonify(posts_list), 200
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
                       'commentNumber': post.commentNumber,
                       'locked': post.locked,
                       'subscribed': post.subscribed
                       }
                      for post in posts]

        return jsonify(posts_list), 200
    except Exception as e:
        print(f"Error fetching posts: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
#Promeniti ovaj comment GET i POST
@auth_blueprint.route('/theme/<int:post_id>/comments', methods=['POST'])
def post_comments(post_id):
    
        
        data = request.get_json()
        print('Received data:', data)
        subscribed_usernames = Post.query.filter_by(subscribed=True).with_entities(Post.userName).all()

        # Create a new comment
        new_comment = Comment(content=data.get('content'), post_id=post_id, author=data.get('author'))

        # Add the new comment to the database
        db.session.add(new_comment)
        db.session.commit()

        # Update the commentNumber for the associated post
        post = Post.query.get_or_404(post_id)
        post.commentNumber += 1
        db.session.commit()
        sendMail(subscribed_usernames)

        return jsonify({'message': 'Comment added successfully'})


@auth_blueprint.route('/theme/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    try:
        # Fetch comments for the specified post_id
        comments = Comment.query.filter_by(post_id=post_id).all()

        # Convert comments to a list of dictionaries
        comments_list = [{
            'id': comment.id,
            'content': comment.content,
            'author': comment.author,
            'likes': comment.likes,
            'dislikes': comment.dislikes,
        } for comment in comments]

        return jsonify(comments_list), 200
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
            # Check if there are likes related to the post
            if post_to_delete.likes_relationship:
                # Delete all likes
                for like in post_to_delete.likes_relationship:
                    db.session.delete(like)

            # Check if there are dislikes related to the post
            if post_to_delete.dislikes_relationship:
                # Delete all dislikes
                for dislike in post_to_delete.dislikes_relationship:
                    db.session.delete(dislike)

            # Check if there are comments related to the post
            if post_to_delete.comments:
                # Delete all comments
                for comment in post_to_delete.comments:
                    db.session.delete(comment)

            # Delete the post
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
    data = request.get_json()

    # Extract user information from the request payload
    user_id = data.get('user_id')  # Assuming user_id is included in the request payload

    if not user_id:
        return jsonify({'error': 'User ID not provided'}), 400

    post = Post.query.get_or_404(post_id)

    # Check if the user has already liked the post
    existing_like = Like.query.filter_by(user_id=user_id, post_id=post_id).first()

    if existing_like:
        # If the user has already liked the post, remove the like
        db.session.delete(existing_like)
        post.likes -= 1
        db.session.commit()

        return jsonify({'message': 'Post like removed successfully', 'likes': post.likes})

    # Add a new like
    new_like = Like(user_id=user_id, post_id=post_id)
    db.session.add(new_like)

    # Increment the like count for the post
    post.likes += 1

    db.session.commit()

    return jsonify({'message': 'Post liked successfully', 'likes': post.likes})

    
@auth_blueprint.route('/postSection/<int:post_id>/dislike', methods=['POST'])
def dislike_post(post_id):
    data = request.get_json()

    # Extract user information from the request payload
    user_id = data.get('user_id')  # Assuming user_id is included in the request payload

    if not user_id:
        return jsonify({'error': 'User ID not provided'}), 400

    post = Post.query.get_or_404(post_id)

    # Check if the user has already disliked the post
    existing_dislike = Dislike.query.filter_by(user_id=user_id, post_id=post_id).first()

    if existing_dislike:
        # If the user has already disliked the post, remove the dislike
        db.session.delete(existing_dislike)
        post.dislikes -= 1
        db.session.commit()

        return jsonify({'message': 'Post dislike removed successfully', 'dislikes': post.dislikes})

    # Add a new dislike
    new_dislike = Dislike(user_id=user_id, post_id=post_id)
    db.session.add(new_dislike)

    # Increment the dislike count for the post
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
                'commentNumber' : post.commentNumber,
                'locked' : post.locked,
                'subscribed': post.subscribed
            }
            return jsonify(post_data), 200
        else:
            return jsonify({'error': 'Post not found'}), 404
    except Exception as e:
        print(f"Error fetching post: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@auth_blueprint.route('/postSection/<int:post_id>/comments/<int:comment_id>/like', methods=['POST'])
def like_comment(comment_id,post_id):
    comment = Comment.query.get_or_404(comment_id)

    # Increment likes for the comment
    comment.likes += 1
    db.session.commit()

    return jsonify({'message': 'Comment liked successfully', 'likes': comment.likes}), 200
    
@auth_blueprint.route('/postSection/<int:post_id>/comments/<int:comment_id>/dislike', methods=['POST'])
def dislike_comment(post_id, comment_id):
    comment = Comment.query.get_or_404(comment_id)

    # Increment dislikes for the comment
    comment.dislikes += 1
    db.session.commit()

    return jsonify({'message': 'Comment disliked successfully', 'dislikes': comment.dislikes}), 200

@auth_blueprint.route('/postSection/<int:post_id>/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(post_id, comment_id):
    try:
        # Find the comment by ID
        comment_to_delete = Comment.query.get(comment_id)

        if comment_to_delete:
            # Delete the comment
            db.session.delete(comment_to_delete)

            # Update the commentNumber for the associated post
            post = Post.query.get_or_404(post_id)
            post.commentNumber -= 1
            db.session.commit()

            return jsonify({'message': 'Comment deleted successfully'})
        else:
            return jsonify({'error': 'Comment not found'}), 404
    except Exception as e:
        print(f"Error deleting comment: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    

@auth_blueprint.route('/postSection/<int:post_id>/toggleLock', methods=['POST'])
def toggle_post_lock(post_id):
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404

        # Promenite vrednost polja 'locked' na suprotnu vrednost
        post.locked = not post.locked
        db.session.commit()

        return jsonify({'success': 'Post lock status updated'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_blueprint.route('/postSection/<int:post_id>/subscribe', methods=['POST'])
def subscribe(post_id):
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404

        # Promenite vrednost polja 'locked' na suprotnu vrednost
        post.subscribed = not post.subscribed
        db.session.commit()



        return jsonify({'success': 'Post lock status updated'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_blueprint.route('/themes/search', methods=['GET'])
def search_themes():
    try:
        title = request.args.get('title', '')
        # Assuming 'title' is the column you want to search
        themes = Post.query.filter(Post.title.ilike(f"%{title}%")).all()

        # Convert themes to a list of dictionaries
        themes_list = [
            {
                'id': theme.id,
                'title': theme.title,
                'content': theme.content,
                'userName': theme.userName,
                'likes': theme.likes,
                'dislikes': theme.dislikes,
                'commentNumber': theme.commentNumber,
                'locked': theme.locked,
            }
            for theme in themes
        ]

        return jsonify(themes_list)

    except Exception as e:
        print("Error searching themes:", str(e))
        return jsonify({'error': 'Internal Server Error'}), 500

def send_mail_to_receiver(receiver_email):
    try:
        
        message = MIMEMultipart()
        message['From'] = "forumdrs2023@gmail.com"
        message['To'] = receiver_email
        message['Subject'] = 'Test Email Subject'

 
        body = 'Uspesno poslat mail.'
        message.attach(MIMEText(body, 'plain'))

       
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            
            server.starttls()

      
            server.login(smtp_username, smtp_password)

            
            server.sendmail(sender_email, receiver_email, message.as_string())

        print(f'Email uspešno poslat na {receiver_email}.')
    except Exception as e:
        print(f'Došlo je do greške prilikom slanja emaila na {receiver_email}: {e}')

def sendMail(receivers):
    try:
        sender_email = 'forumdrs2023@gmail.com'

     
        receiver_emails = receivers.split()

       
        threads = []

        for receiver_email in receiver_emails:
            
            thread = threading.Thread(target=send_mail_to_receiver, args=(sender_email, receiver_email))
            thread.start()
            threads.append(thread)

       
        for thread in threads:
            thread.join()

        print('Svi emailovi uspešno poslati.')
    except Exception as e:
        print('Došlo je do greške prilikom slanja emailova:', e)

 

