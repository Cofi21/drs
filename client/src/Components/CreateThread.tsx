import React, { useState, FormEvent } from 'react';

const CreateThread: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Dodajte kod za slanje podataka na backend
    console.log('Poslati podaci:', { title, content });
    // Resetujte forme nakon slanja
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
        <textarea id="create-post" placeholder="Write your post..."></textarea>
        <button className="btn create-post-btn" >Create Post</button>
      </form>
    </div>
  );
};

export default CreateThread;