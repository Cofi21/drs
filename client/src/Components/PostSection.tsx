import React, { useState } from 'react';
function PostSection()
{
    const [likeCount, setLikeCount] = useState(0);

    const[dislikeCount, setDislikeCount] = useState(0);

    const handleDislikeClick = () => {
        setDislikeCount(dislikeCount + 1);
    }
    
    const handleLikeClick = () => {
        setLikeCount(likeCount + 1);
    };

    return(
        <div id="post-section">
            <div className="post">
                <div>This is a sample post.</div>
                <div className="like-dislike-buttons">
                <span className="like1" onClick={handleLikeClick}>👍</span>
                    <span id="likesCount1">{likeCount}</span>
                    <span className="dislike1" onClick={handleDislikeClick}>👎</span>
                    <span id="dislikesCount1">{dislikeCount}</span>
                    
                </div>
            </div>
            <div className="post">
                <div>Another sample post.</div>
                <div className="like-dislike-buttons">
                    <span className="like2" >👍</span>
                    <span id="likesCount2"> 0</span>
                    <span className="dislike2" >👎</span>
                    <span id="dislikesCount2"> 0</span>
                </div>
            </div>
        </div>
    );
}

export default PostSection;