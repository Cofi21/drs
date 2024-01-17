// ThemePage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../Styles/post_section.css';
import '../Styles/theme.css';

interface Post {
  id: number;
  title: string;
  content: string;
  userName: string;
  likes: number;
  dislikes: number;
  commentNumber: number;
  locked: boolean;
  subscribed: boolean;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  likes: number;
  dislikes: number;
}

function ThemePage() {
  const { postId } = useParams();
  console.log(postId);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPostData = async () => {
        try {
          console.log('Fetching post data for postId:', postId);
      
          // Fetch post data
          const postResponse = await fetch(`http://localhost:3003/auth/theme/${postId}`);
          
          if (!postResponse.ok) {
            // Handle non-successful response
            console.error('Error fetching post data. Server response:', postResponse.status, postResponse.statusText);
            // You can throw an error if you want to stop the execution or just return to handle it later
            throw new Error('Error fetching post data');
          }
      
          const postData: Post = await postResponse.json();
          console.log('Post data:', postData);
          setPost(postData);
        } catch (error: any) {
          // Explicitly assert the error to the Error type
          console.error('An unexpected error occurred during fetchPostData:', error.message);
          // You might want to set an error state here or show a user-friendly error message
        }
      };
    
      fetchPostData();
      if(postId)
      {
        fetchComments(parseInt(postId));
      }
  }, [postId]);
  
  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3003/auth/theme/${postId}/comments`);
      const data: Comment[] = await response.json();
  
      setComments((prevComments) => ({
        ...prevComments,
        [postId]: data.map((comment: Comment) => ({
          ...comment,
          author: comment.author || (user?.username ?? ''), // Use the logged-in user's username if author is not present
        })),
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3003/auth/theme/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          author: user?.username,
          likes: 0,
          dislikes: 0,
        }),
      });
  
      if (response.ok) {
        // Clear the comment input field after submitting
        setNewComment('');
  
        // Fetch comments again after the new comment is added
        await fetchComments(postId);
      } else {
        console.error('Failed to add comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDislikeComment = async (postId: number, commentId: number) => {
    try {
      if (!user) {
        console.warn('User is not logged in. Cannot dislike the post.');
        return;
      }
      // Send a request to your server to increment the dislikes for the specific comment
      const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/comments/${commentId}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Update the local state accordingly
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: prevComments[postId].map((comment) =>
            comment.id === commentId ? { ...comment, dislikes: comment.dislikes + 1 } : comment
          ),
        }));
      } else {
        console.error('Failed to dislike comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error disliking comment:', error);
    }
  };

  const handleLikeComment = async (postId: number, commentId: number) => {
    try {

      if (!user) {
        console.warn('User is not logged in. Cannot like the post.');
        return;
      }
      // Send a request to your server to increment the likes for the specific comment
      const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Update the local state accordingly
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: prevComments[postId].map((comment) =>
            comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
          ),
        }));
      } else {
        console.error('Failed to like comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      if (!user) {
        console.error('User not authenticated. Cannot delete comment.');
        return;
      }
      
      const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Update the local state to remove the deleted comment
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: prevComments[postId].filter((comment) => comment.id !== commentId),
        }));
      } else {
        console.error('Failed to delete comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

const handleLikePost = async (postId: number) => {
    try {
      if (!user) {
        console.warn('User is not logged in. Cannot like the post.');
        return;
      }
  
      const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setPost((prevPost) => ({
          ...prevPost!,
          likes: (prevPost?.likes || 0) + 1,
        }));
      } else {
        console.error('Failed to like post:', response.statusText);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };


  const handleDislikePost = async (postId: number) => {
    try {
      if (!user) {
        console.warn('User is not logged in. Cannot like the post.');
        return;
      }
  
      const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setPost((prevPost) => ({
          ...prevPost!,
          dislikes: (prevPost?.dislikes || 0) + 1,
        }));
      } else {
        console.error('Failed to like post:', response.statusText);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };


  
  if (!post) {
    return <p>Loading...</p>;
  }

  

  return (
    <div className='post'>
      <h2 className="post-title">{post.title}</h2>
      <p className="post-content">{post.content}</p>
      <hr></hr>
      <p className="post-author">Author: {post.userName}</p>
      <div className="comment-form">
        <button onClick={() => handleLikePost(post.id)}>Like {post.likes}</button>
        <button onClick={() => handleDislikePost(post.id)}>Dislike {post.dislikes}</button>
      </div>
      <div className="comments-section">
        <h3>Comments</h3>
        <ul className="comment-list">
        {comments[post.id]?.map((comment: Comment) => (
                  <li key={comment.id} className="comment">
                    <p className="comment-content">{comment.content}</p>
                    <hr></hr>
                    <p className="comment-author">Author: {comment.author}</p>
                    {!post.locked && (
                      <>
                      <div className="comment-form">
                        <button onClick={() => handleLikeComment(post.id, comment.id)}>Like {comment.likes}</button>
                        <button onClick={() => handleDislikeComment(post.id, comment.id)}>Dislike {comment.dislikes}</button>
                        {comment.author === user?.username && (
                        <button onClick={() => handleDeleteComment(post.id, comment.id)}>Delete comment</button>
                        )}
                      </div>
                    </>
                    )}
                  </li>
                ))}
        </ul>
        {post.locked && (
                    <p>
                      This post is locked for commenting.
                    </p>)
                    }{!post.locked && (
                      <>
                      <div className="comment-form">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                      />
                      <button onClick={() => handleCommentSubmit(post.id)}>Add Comment</button>
                    </div>
                      </>
          )}
        
      </div>
    </div>
  );
}

export default ThemePage;