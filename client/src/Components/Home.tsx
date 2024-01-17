// HomePage.js
import '../Styles/home.css';
import React, { useState, useEffect } from 'react';
import PostSection from './PostSection';
import UserSection from './UserSection';
import CreateThread from './CreateThread';

function HomePage() {
      const [searchTerm, setSearchTerm] = useState('');
      const [searchResults, setSearchResults] = useState([]);
     const [sortOption, setSortOption] = useState<'likes' | 'dislikes' | 'comments'>(
          localStorage.getItem('sortOption') as 'likes' | 'dislikes' | 'comments' || 'likes' 
          //smestamo stanje u local storage da nam ne bi uvek vracao na default stanje 
        );
      

     const handleSortChange = (option: 'likes' | 'dislikes' | 'comments') => {
          setSortOption(option);
        };
      
        useEffect(() => {
          // Save the sortOption to localStorage when it changes
          localStorage.setItem('sortOption', sortOption);
        }, [sortOption]); 

        const handleSearch = async () => {
          try {
            const response = await fetch(`http://localhost:3003/themes/search?title=${searchTerm}`);
            const data = await response.json();
            setSearchResults(data);
          } catch (error) {
            console.error('Error searching themes:', error);
          }
        };

  return (
      <div className="container">
        <h1>Forum</h1>     
      <UserSection></UserSection>

      <div className="sort-options">
        <label className="sort-label">Sort by:</label>
        <select className="sort-select" onChange={(e) => handleSortChange(e.target.value as 'likes' | 'dislikes' | 'comments')} value={sortOption}>
          <option value="likes">Most Likes</option>
          <option value="dislikes">Most Dislikes</option>
          <option value="comments">Most Comments</option>
        </select>
        <div className="search-section">
        <input
          type="text"
          placeholder="Search by theme title..."
         // value={searchTerm}
         // onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
        </div>
        
     <CreateThread></CreateThread>
        
     <PostSection sortOption={sortOption}></PostSection>
        
        
        <div id="search-results">
        </div>
    </div>
  );    
};

export default HomePage;