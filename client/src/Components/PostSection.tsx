import React, { useEffect, useState } from 'react';
import '../Styles/post_section.css';

interface Post {
  id: number;
  title: string;
  content: string;
  userName: string;
}

interface Comment {
  id: number;
  content: string;
  author: string;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (response.ok) {
        const newCommentData: Comment = await response.json();
        setComments((prevComments) => {
          const updatedComments = { ...prevComments };
          updatedComments[postId] = [...(updatedComments[postId] || []), newCommentData];
          return updatedComments;
        });
        setNewComment('');
      } else {
        console.error('Failed to add comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3003/auth/');
        const data = await response.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className='post'>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post">
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <p className="post-author">Author: {post.userName}</p>

            {/* Comments Section */}
            <div className="comments-section">
              <h3>Comments</h3>
              <ul className="comment-list">
                {comments[post.id]?.map((comment: Comment) => (
                  <li key={comment.id} className="comment">
                    <p className="comment-content">{comment.content}</p>
                    <p className="comment-author">Author: {comment.author}</p>
                  </li>
                ))}
              </ul>

              {/* Comment Form */}
              <div className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button onClick={() => handleCommentSubmit(post.id)}>Add Comment</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
