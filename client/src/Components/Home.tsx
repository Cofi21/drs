// HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/home.css';
import PostSection from './PostSection';

function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in (you can implement your logic here)
        // For now, let's assume the user is logged in
    setIsLoggedIn(false);
    }, []);

     function performSearch(): React.MouseEventHandler<HTMLButtonElement> | undefined {
          throw new Error('Function not implemented.');
     }

     function createPost(): React.MouseEventHandler<HTMLButtonElement> | undefined {
          throw new Error('Function not implemented.');
     }

     function likePost(arg0: number) {
          throw new Error('Function not implemented.');
     }
     function dislikePost(arg0: number) {
          throw new Error('Function not implemented.');
     }

  return (
     <div className="container">
        <h1>Forum</h1>
        <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="auth-buttons-left">
            <button className="logout-btn btn" >Logout</button>
          </div>
        ) : (
          <div className="auth-buttons-left">
            <Link to="/login" className="auth-btn">Login</Link>
            <Link to="/registration" className="auth-btn">Register</Link>
          </div>
        )}
      </div>


        <div className="media">
            <input type="text" id="search-bar" placeholder="Enter your search term"/>
            <button className="btn search-btn" >Search</button>
        </div>

        <div>
            <textarea id="create-post" placeholder="Write your post..."></textarea>
            <button className="btn create-post-btn" >Create Post</button>
        </div>

        <PostSection></PostSection>
        
        <div id="search-results">
        </div>
    </div>
  );    
};

export default HomePage;