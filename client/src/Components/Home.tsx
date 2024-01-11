// HomePage.js
import '../Styles/home.css';
import PostSection from './PostSection';
import UserSection from './UserSection';
import CreateThread from './CreateThread';

function HomePage() {



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
      <UserSection></UserSection>

        <div className="media">
            <input type="text" id="search-bar" placeholder="Enter your search term"/>
            <button className="btn search-btn" >Search</button>
        </div>
     <CreateThread></CreateThread>
        
     <PostSection></PostSection>
        
        
        <div id="search-results">
        </div>
    </div>
  );    
};

export default HomePage;