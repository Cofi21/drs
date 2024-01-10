import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from "./AuthContext";
import '../Styles/home.css';

interface Post {
  title: string;
  content: string;
  userName: string;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
}

interface CreateThreadProps {
  addPost: (post: Post) => void;
  currentUser: string;
}

const CreateThread: React.FC<CreateThreadProps> = ({ addPost, currentUser }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Check if the current user is "Guest" and prevent post creation
    if (currentUser === 'Guest') {
      console.error("Guest user cannot create posts.");
      return;
    }

    const newPost: Post = {
      title,
      content,
      userName: currentUser,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
    };

    addPost(newPost);

    setTitle('');
    setContent('');
  };

  return (
    <div>
      <h2>Create new thread</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Your Username:
          <input type="text" value={currentUser} readOnly />
        </label>
        <textarea
          id="create-post"
          placeholder="Write your post..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button type="submit" className="btn create-post-btn" disabled={currentUser === 'Guest'}>
          Create Post
        </button>
      </form>
    </div>
  );
};

interface PostListProps {
  posts: Post[];
  handleLikeDislike: (postId: number, type: 'like' | 'dislike', e: React.MouseEvent<HTMLButtonElement>) => void;
  handleDeletePost: (postId: number, postOwner: string) => void;
  currentUser: string;
}

const PostList: React.FC<PostListProps> = ({ posts, handleLikeDislike, handleDeletePost, currentUser }) => (
  <div>
    <h2>Post Section</h2>
    {posts.map((post, index) => (
      <div key={index}>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <p>Posted by: {post.userName}</p>
        <p>Likes: {post.likes}</p>
        <p>Dislikes: {post.dislikes}</p>
        <button
          onClick={(e) => handleLikeDislike(index, 'like', e)}
          disabled={currentUser === 'Guest' || post.likedBy.includes(currentUser)}
        >
          Like
        </button>
        <button
          onClick={(e) => handleLikeDislike(index, 'dislike', e)}
          disabled={currentUser === 'Guest' || post.dislikedBy.includes(currentUser)}
        >
          Dislike
        </button>
        <button
          onClick={() => handleDeletePost(index, post.userName)}
          disabled={currentUser !== post.userName}
        >
          Delete
        </button>
      </div>
    ))}
  </div>
);

const PostFunction = () => {
  const { user } = useAuth();

  const initialPosts: Post[] = JSON.parse(localStorage.getItem('posts') || '[]');
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (post: Post) => {
    setPosts([...posts, post]);
  };

  const handleLikeDislike = (postId: number, type: 'like' | 'dislike', e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (user) {
      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts];
        const postToUpdate = updatedPosts[postId];

        if (type === 'like' && !postToUpdate.likedBy.includes(user.username)) {
          postToUpdate.likes += 1;
          postToUpdate.likedBy.push(user.username);

          if (postToUpdate.dislikes !== 0) {
            postToUpdate.dislikes -= 1;
            const indexOfCurrentUser = postToUpdate.dislikedBy.indexOf(user.username);
            if (indexOfCurrentUser !== -1) {
              postToUpdate.dislikedBy.splice(indexOfCurrentUser, 1);
            }
          }
        } else if (type === 'dislike' && !postToUpdate.dislikedBy.includes(user.username)) {
          postToUpdate.dislikes += 1;
          postToUpdate.dislikedBy.push(user.username);

          if (postToUpdate.likes !== 0) {
            postToUpdate.likes -= 1;
            const indexOfCurrentUser = postToUpdate.likedBy.indexOf(user.username);
            if (indexOfCurrentUser !== -1) {
              postToUpdate.likedBy.splice(indexOfCurrentUser, 1);
            }
          }
        }

        return updatedPosts;
      });
    } else {
      console.error("Guest user cannot like/dislike posts.");
    }
  };

  const handleDeletePost = (postId: number, postOwner: string) => {
    if (user && user.username === postOwner) {
      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts];
        updatedPosts.splice(postId, 1);
        return updatedPosts;
      });
    } else {
      console.error("You are not authorized to delete this post.");
    }
  };

  return (
    <div>
      <CreateThread addPost={addPost} currentUser={user?.username ?? 'Guest'} />
      <PostList posts={posts} handleLikeDislike={handleLikeDislike} handleDeletePost={handleDeletePost} currentUser={user?.username ?? 'Guest'} />
    </div>
  );
};

export default PostFunction;