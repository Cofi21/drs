import React, { useEffect, useState } from 'react';
import '../Styles/post_section.css';
import { AuthProvider, useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  content: string;
  userName: string;
  likes: number;
  dislikes: number;
  commentNumber: number;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  likes: number;
  dislikes: number;
}

const App: React.FC<{ sortOption: 'likes' | 'dislikes' | 'comments' }> = ({ sortOption }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const [otherPosts, setOtherUserPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  
//DELETE TRENUTNO NE RADI AKO POSTOJI KOMENTAR NA POSTU
  const handleDeletePost = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3003/auth/postSection/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        console.error('Failed to delete post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
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


  const handleCommentSubmit = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/comments`, {
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
const fetchComments = async (postId: number) => {
  try {
    const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/comments`);
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

  /* dodata pocetna logika za lajkovanje i dislajkovanje postova(kad se refreshuje stranica korisnik moze ponovo lajkovati ili dislajkovati)*/
  const handleLike = async (postId: number) => {
    try {
      //Ako user nije ulogovan, zabraniti lajkovanje i dislajkovanje
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
        const updatedPosts = posts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        );
        setPosts(updatedPosts);
  
        const updatedOtherPosts = otherPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        );
        setOtherUserPosts(updatedOtherPosts);
      } else {
        console.error('Failed to like post:', response.statusText);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
/* dodata pocetna logika za lajkovanje i dislajkovanje postova(doraditi)*/
const handleDislike = async (postId: number) => {
  try {
    //Ako user nije ulogovan, zabraniti lajkovanje i dislajkovanje
    if (!user) {
      console.warn('User is not logged in. Cannot dislike the post.');
      return;
    }

    

    const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/dislike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const updatedPosts = posts.map((post) =>
        post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
      );
      setPosts(updatedPosts);

      const updatedOtherPosts = otherPosts.map((post) =>
        post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
      );
      setOtherUserPosts(updatedOtherPosts);
    } else {
      console.error('Failed to dislike post:', response.statusText);
    }
  } catch (error) {
    console.error('Error disliking post:', error);
  }
};


useEffect(() => {
    // Fetch posts initially
    fetchPosts();
    posts.forEach((post) => fetchComments(post.id));
    
    // Set up polling interval to fetch posts every 5 seconds
    const intervalId = setInterval(fetchPosts, 500);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [user, sortOption]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3003/auth/');
      const data = await response.json();

      let sortedUserPosts: Post[] = [];
      let sortedOtherUserPosts: Post[] = [];
        
      if (sortOption === 'likes') {
        sortedUserPosts = data
          .filter((post: Post) => user?.username === post.userName)
          .sort((a: Post, b: Post) => b.likes - a.likes);
 
        sortedOtherUserPosts = data
          .filter((post: Post) => user?.username !== post.userName)
          .sort((a: Post, b: Post) => b.likes - a.likes);
      } else if (sortOption === 'dislikes') {
        sortedUserPosts = data
          .filter((post: Post) => user?.username === post.userName)
          .sort((a: Post, b: Post) => b.dislikes - a.dislikes);

        sortedOtherUserPosts = data
          .filter((post: Post) => user?.username !== post.userName)
          .sort((a: Post, b: Post) => b.dislikes - a.dislikes);
      } else if (sortOption === 'comments') {
        sortedUserPosts = data
          .filter((post: Post) => user?.username === post.userName)
          .sort((a: Post, b: Post) => b.commentNumber - a.commentNumber);
      
        sortedOtherUserPosts = data
          .filter((post: Post) => user?.username !== post.userName)
          .sort((a: Post, b: Post) => b.commentNumber - a.commentNumber);
      }
      else {
        sortedUserPosts = data.filter((post: Post) => user?.username === post.userName);
        sortedOtherUserPosts = data.filter((post: Post) => user?.username !== post.userName);
      }
      
      setPosts(sortedUserPosts);
      setOtherUserPosts(sortedOtherUserPosts);
      for (const post of data) {
        await fetchComments(post.id);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };


  return ( 
    
    <div>
    <h1>My Posts</h1>
      {posts.length > 0 ? (
        <div className='post'>
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.id} className="post"
              >
                <a
                  onClick={() => handleDeletePost(post.id)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Delete post
                </a>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-content" >{post.content}</p>
                <p className="post-author">Author: {post.userName}</p>
                <p className="post-likes">Likes: {post.likes}</p>
                <p className="post-dislikes">Dislikes: {post.dislikes}</p>
                <div className="comment-form">
                  <button onClick={() => handleLike(post.id)}>Like</button>
                  <button onClick={() => handleDislike(post.id)}>Dislike</button>
                </div>
                <div className="comments-section">
                  <h3>Comments</h3>
                  <ul className="comment-list">
                  {comments[post.id]?.map((comment: Comment) => (
                  <li key={comment.id} className="comment">
                    <p className="comment-content">{comment.content}</p>
                    <p className="comment-author">Author: {comment.author}</p>
                    <p className="comment-content">Likes: {comment.likes}</p>
                  <p className="comment-content">Dislikes: {comment.dislikes}</p>
                    <div className="comment-form">
                      <button onClick={() => handleLikeComment(post.id, comment.id)}>Like</button>
                      <button onClick={() => handleDislikeComment(post.id, comment.id)}>Dislike</button>
                      {comment.author === user?.username && (
                      <button onClick={() => handleDeleteComment(post.id, comment.id)}>Delete comment</button>
                      )}
                    </div>
                  </li>
                ))}
                </ul>
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
    {otherPosts.length > 0 ? (
      <div className='post'>
        <ul className="post-list">
          {otherPosts.map((post) => (
            <li key={post.id} className="post" >
              <h2 className="post-title">{post.title}</h2>
              <p className="post-content">{post.content}</p>
              <p className="post-author">Author: {post.userName}</p>
              <p className="post-likes">Likes: {post.likes}</p>
              <p className="post-dislikes">Dislikes: {post.dislikes}</p>
              <div className="comment-form">
                <button onClick={() => handleLike(post.id)}>Like</button>
                <button onClick={() => handleDislike(post.id)}>Dislike</button>
              </div>
              <div className="comments-section">
                <h3>Comments</h3>
                <ul className="comment-list">
                {comments[post.id]?.map((comment: Comment) => (
                <li key={comment.id} className="comment">
                  <p className="comment-content">{comment.content}</p>
                  <p className="comment-author">Author: {comment.author}</p>
                  <p className="comment-content">Likes: {comment.likes}</p>
              <p className="comment-content">Dislikes: {comment.dislikes}</p>
                  <div className="comment-form">
                    <button onClick={() => handleLikeComment(post.id, comment.id)}>Like</button>
                    <button onClick={() => handleDislikeComment(post.id, comment.id)}>Dislike</button>
                    {comment.author === user?.username && (
                      <button onClick={() => handleDeleteComment(post.id, comment.id)}>Delete comment</button>
                    )}
                  </div>
                </li>
              ))}
                </ul>
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
      <p>There are no posts</p>
    )}
  </div> 
  );
};

export default App;
