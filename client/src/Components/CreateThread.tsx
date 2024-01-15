import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import '../Styles/home.css';
import '../Styles/post_section.css';

interface Post {
  id: number;
  title: string;
  content: string;
  userName: string;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  commentNumber: number;
}

interface CreateThreadProps {
  addPost: (post: Post) => void;
  currentUser: string;
}

const CreateThread: React.FC<CreateThreadProps> = ({ addPost, currentUser }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser === 'Guest') {
      console.error('Guest user cannot create posts.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3003/auth/postSection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          userName: currentUser,
          
        }),
      });
      
      if (response.ok) {
        const newPost: Post = {
          id : 0, 
          title,
          content,
          userName: currentUser,
          likes: 0,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
          commentNumber: 0,
        };
        console.info
        addPost(newPost);

        setTitle('');
        setContent('');
      } else {
        console.error('Failed to create post:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
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


const PostFunction: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  //const { currentUser } = useAuth();

  const addPost = (newPost: Post) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  return (
    <div>
      <CreateThread addPost={addPost} currentUser={user?.username ?? 'Guest'} />
      <h1>Your posts</h1>
      <div >
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post">
            <a><u>Delete post</u></a>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <p className="post-author">Author: {post.userName}</p>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default PostFunction;
