// ThemePage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../Styles/post_section.css';

interface Post {
  id: number;
  title: string;
  content: string;
  userName: string;
  likes: number;
  dislikes: number;
}

interface Comment {
  id: number;
  content: string;
  author: string;
}

function ThemePage() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPostData = async () => {
        try {
          // Fetch post data
          const postResponse = await fetch(`http://localhost:3003/auth/theme/${postId}`, {

          });
          const postData: Post = await postResponse.json();
          setPost(postData);
      
          // Fetch comments for the post using the new route
          const commentsResponse = await fetch(`http://localhost:3003/auth/theme/${postId}/comments`);
          const commentsData: Comment[] = await commentsResponse.json();
          setComments(commentsData);
        } catch (error) {
          console.error('Error fetching post data:', error);
        }
      };
      
      if (postId) {
        fetchPostData();
      }
  }, [postId]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className='post'>
      <h2 className="post-title">{post.title}</h2>
      <p className="post-content">{post.content}</p>
      <p className="post-author">Author: {post.userName}</p>
      <p className="post-likes">Likes: {post.likes}</p>
      <p className="post-dislikes">Dislikes: {post.dislikes}</p>
      <div className="comment-form">
        <button>Like</button>
        <button>Dislike</button>
      </div>
      <div className="comments-section">
        <h3>Comments</h3>
        <ul className="comment-list">
          {comments.map((comment: Comment) => (
            <li key={comment.id} className="comment">
              <p className="comment-content">{comment.content}</p>
              <p className="comment-author">Author: {comment.author}</p>
            </li>
          ))}
        </ul>
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button>Add Comment</button>
        </div>
      </div>
    </div>
  );
}

export default ThemePage;
