import React, { useState } from 'react';
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
  commentNumber: number;
  locked: boolean;
  subscribed: boolean;
}


interface CreateThreadProps {
  addPost: (post: Post) => void;
  currentUser: string;
}

const CreateThread: React.FC<CreateThreadProps> = ({ addPost, currentUser }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      setSuccessMessage('');
      return;
    }

    if (currentUser === 'Guest') {
      setError('Guest user cannot create posts.');
      setSuccessMessage('');
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
          id: 0,
          title,
          content,
          userName: currentUser,
          likes: 0,
          dislikes: 0,
          commentNumber: 0,
          locked: false,
          subscribed: false,
        };
        addPost(newPost);

        setTitle('');
        setContent('');
        setError('');
        setSuccessMessage('Post created successfully!');
      } else {
        console.error('Failed to create post:', response.statusText);
        setError('Failed to create post. Please try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('An unexpected error occurred. Please try again.');
      setSuccessMessage('');
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
        <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>
        <div style={{ color: 'green', marginTop: '5px' }}>{successMessage}</div>
        <button type="submit" className="btn create-post-btn" disabled={currentUser === 'Guest'}>
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreateThread;
