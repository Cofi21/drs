import React, { useEffect, useState } from 'react';
import '../Styles/post_section.css';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

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
  subscribed_usernames: string;
}


const App: React.FC<{ sortOption: 'likes' | 'dislikes' | 'comments'; searchTerm: string }> = ({ sortOption, searchTerm }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { user } = useAuth();
  const [otherPosts, setOtherUserPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  
  
  //#region POSTS
  /* dodata pocetna logika za lajkovanje i dislajkovanje postova(kad se refreshuje stranica korisnik moze ponovo lajkovati ili dislajkovati)*/
  const handleLike = async (postId: number) => {
    try {
      
      if (!user) {
        console.warn('User is not logged in. Cannot like the post.');
        return;
      }
  
      
      await fetch(`http://localhost:3003/auth/postSection/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
  const handleDislike = async (postId: number) => {
    try {
      
      if (!user) {
        console.warn('User is not logged in. Cannot dislike the post.');
        return;
      }
  
      
      await fetch(`http://localhost:3003/auth/postSection/${postId}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: user.id }),
      });
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };


useEffect(() => {
    // Fetch posts initially
    fetchPosts();
    //posts.forEach((post) => fetchComments(post.id));
    
    // Set up polling interval to fetch posts every 5 seconds
    const intervalId = setInterval(fetchPosts, 500);
//
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [user, sortOption,searchTerm]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3003/auth/');
      const data = await response.json();

      // Filter posts based on the search term
      const filteredPosts = data.filter((post: Post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

      let sortedUserPosts: Post[] = [];
      let sortedOtherUserPosts: Post[] = [];

      if (sortOption === 'likes') {
        sortedUserPosts = filteredPosts
          .filter((post: Post) => user?.username === post.userName)
          .sort((a: Post, b: Post) => b.likes - a.likes);

        sortedOtherUserPosts = filteredPosts
          .filter((post: Post) => user?.username !== post.userName)
          .sort((a: Post, b: Post) => b.likes - a.likes);
      } else if (sortOption === 'dislikes') {
        sortedUserPosts = filteredPosts
          .filter((post: Post) => user?.username === post.userName)
          .sort((a: Post, b: Post) => b.dislikes - a.dislikes);

        sortedOtherUserPosts = filteredPosts
          .filter((post: Post) => user?.username !== post.userName)
          .sort((a: Post, b: Post) => b.dislikes - a.dislikes);
      } else if (sortOption === 'comments') {
        sortedUserPosts = filteredPosts
          .filter((post: Post) => user?.username === post.userName)
          .sort((a: Post, b: Post) => b.commentNumber - a.commentNumber);

        sortedOtherUserPosts = filteredPosts
          .filter((post: Post) => user?.username !== post.userName)
          .sort((a: Post, b: Post) => b.commentNumber - a.commentNumber);
      } else {
        sortedUserPosts = filteredPosts.filter((post: Post) => user?.username === post.userName);
        sortedOtherUserPosts = filteredPosts.filter((post: Post) => user?.username !== post.userName);
      }

      setPosts(sortedUserPosts);
      setOtherUserPosts(sortedOtherUserPosts);

    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostClick = (postId: number) => {
    navigate(`/theme/${postId}`);
  };

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
  //#endregion


  const handleLockToggle = async (postId: number) => {
    try {
      if (!user) {
        console.warn('User is not logged in. Cannot toggle lock status.');
        return;
      }
  
      const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/toggleLock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const updatedPosts = posts.map((post) =>
          post.id === postId ? { ...post, locked: !post.locked } : post
        );
        setPosts(updatedPosts);
      } else {
        console.error('Failed to toggle lock status:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling lock status:', error);
    }
  };
  
  const handleSubscribe = async (postId: number) => {
    try {
        if (!user) {
            console.warn('User is not logged in. Cannot toggle lock status.');
            return;
        }
                                    //@auth_blueprint.route('/postSection/<int:post_id>/subscribe/<int:user_id>', methods=['POST'])
        const response = await fetch(`http://localhost:3003/auth/postSection/${postId}/subscribe/${user.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const updatedPosts = posts.map((post) =>
                post.id === postId ? {
                    ...post,
                    subscribed: !post.subscribed,
                    subscribed_usernames: updateSubscribedUsernames(post, user?.username),
                } : post
            );
            setPosts(updatedPosts);
        } else {
            console.error('Failed to toggle lock status:', response.statusText);
        }
    } catch (error) {
        console.error('Error toggling lock status:', error);
    }
};

  
  const updateSubscribedUsernames = (post: Post, username: string | undefined): string => {
    if (!post.subscribed_usernames) {
      return username ? username : '';
    }

    const usernames = post.subscribed_usernames.split(',');

    if (username && post.subscribed) {
      // Add the username to the list
      usernames.push(username);
    } else if (username && !post.subscribed) {
      // Remove the username from the list
      const index = usernames.indexOf(username);
      if (index !== -1) {
        usernames.splice(index, 1);
      }
    }

    return usernames.join(',');
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
                <button className='button-delete-post'
                  onClick={() => handleDeletePost(post.id)}>
                  Delete post
                </button>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-content" >{post.content}</p>
                <hr></hr>
                <p className="post-author">Author: {post.userName}</p>
                <button id="openPostButton" onClick={() => handlePostClick(post.id)}>Open theme</button>
                <button  className="lock-toggle-button" onClick={() => handleLockToggle(post.id)}>
                  {post.locked ? 'Unlock' : 'Lock'}
                </button>
                <div className="comment-form">
                  <button onClick={() => handleLike(post.id)}>⇧ {post.likes}</button>
                  <button onClick={() => handleDislike(post.id)}>⇩ {post.dislikes}</button>
                  <button onClick={() => handlePostClick(post.id)}>💬 {post.commentNumber}</button>
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
              {user && (
                <>
                <button className='button-delete-post' onClick={() => handleSubscribe(post.id)}>
                  {post.subscribed_usernames && post.subscribed_usernames.includes(user.username)
                    ? 'Unsubscribe'
                    : 'Subscribe'}
                </button>
                </>
              )}
              <h2 className="post-title">{post.title}</h2>
              <p className="post-content">{post.content}</p>
              <p className="post-author">Author: {post.userName}</p>
              
              <button id="openPostButton" onClick={() => handlePostClick(post.id)}>Open theme</button>
              <div className="comment-form">
                  <button onClick={() => handleLike(post.id)}>⇧ {post.likes}</button>
                  <button onClick={() => handleDislike(post.id)}>⇩ {post.dislikes}</button>
                  <button onClick={() => handlePostClick(post.id)}>💬 {post.commentNumber}</button>
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