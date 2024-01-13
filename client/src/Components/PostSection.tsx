import React, { useEffect, useState } from 'react';
import '../Styles/post_section.css';
import { AuthProvider, useAuth } from './AuthContext';

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
  const {user} = useAuth();
  const [otherPosts, setOtherUserPosts] = useState<Post[]>([]);
  
  const handleDeletePost = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3003/auth/postSection/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the deleted post from the local state
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        console.error('Failed to delete post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  //NAPOMENA: DELETE RADI SAMO KAD SE IZ WORKBENCHA IZBRISU SVI KOMENTARI VEZANI ZA TAJ POST
  const handleCommentSubmit = async (postId: number) => {
    try {
      console.log('User object:', user);
      const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          author: user?.username,
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
  
        const userPosts: Post[] = data.filter((post: Post) => user?.username === post.userName);
        setPosts(userPosts);
  
        const otherUserPosts: Post[] = data.filter((post: Post) => user?.username !== post.userName);
        setOtherUserPosts(otherUserPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    fetchPosts();
  }, [user]);

  return (
    <div>
      {posts.length > 0 ? (
    <div className='post'>
    
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post">
            <a onClick={() => handleDeletePost(post.id)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                  Delete post
                </a>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <p className="post-author">Author: {post.userName}</p>{/*proba da vidim  kako ubacuje u bazu*/}
            {/* Comments Section */}
            <div className="comments-section">
              <h3>Comments</h3>
              <ul className="comment-list">
                {comments[post.id]?.map((comment: Comment) => (
                  <li key={comment.id} className="comment">
                    <p className="comment-content">{comment.content}</p>
                    <p className="comment-author">Author: {comment.author}</p> {/*proba da vidim  kako ubacuje u bazu*/}
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
    ) : (
      <p>You have no posts.</p>
    )}
    <h1>Other User Posts</h1>
    {otherPosts.length > 0 ?(
    <ul className="other-user-post-list">
      {otherPosts.map((post) => (
        <li key={post.id} className="post">
          <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <p className="post-author">Author: {post.userName}</p>
        </li>
      ))}
    </ul>
    ) : (
      <p>There are no posts</p>
    )}
    </div>
  );
};

export default App;
