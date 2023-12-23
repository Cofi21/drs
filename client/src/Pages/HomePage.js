// HomePage.js
import React from 'react';
import '../Styles/homepage.css';

const HomePage = () => {
  return (
     <div class="container">
        <h1>Forum</h1>

        <div >
            <button class="logout-btn btn" onclick="logout()">Logout</button>
        </div>

        <div class="media">
            <input type="text" id="search-bar" placeholder="Enter your search term"/>
            <button class="btn search-btn" onclick="performSearch()">Search</button>
        </div>

        <div>
            <textarea id="create-post" placeholder="Write your post..."></textarea>
            <button class="btn create-post-btn" onclick="createPost()">Create Post</button>
        </div>

        <div id="search-results">
        </div>

        <div id="post-section">
            <div class="post">
                <div>This is a sample post.</div>
                <div class="like-dislike-buttons">
                    <span class="like" onclick="likePost(1)">👍 Like</span>
                    <span id="likesCount1">0</span>
                    <span class="dislike" onclick="dislikePost(1)">👎 Dislike</span>
                    <span id="dislikesCount1">0</span>
                </div>
            </div>
            <div class="post">
                <div>Another sample post.</div>
                <div class="like-dislike-buttons">
                    <span class="like" onclick="likePost(2)">👍 Like</span>
                    <span id="likesCount2">0</span>
                    <span class="dislike" onclick="dislikePost(2)">👎 Dislike</span>
                    <span id="dislikesCount2">0</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default HomePage;
