import React from 'react';
import { Link } from 'react-router-dom';
import auth from '../../utils/auth';

const ArtistList = ({ artists, title }) => {
  if (!artists.length) {
    return <h3>No Opinions Yet</h3>;
  }

  const loggedIn = auth.loggedIn();

  return (
    
    <div>
      <h3>{title}</h3>
      {artists &&
        artists.map(artist => (
          <div key={artist._id} className="card mb-3">
            <h4><Link
                to={loggedIn ?`/artist/${artist.name}` : "/login"}
                style={{ fontWeight: 700 }}
                className="text-light opinion-title"
              >
                Opinions on ARTIST_NAME
              </Link>
            </h4>
            <p className="card-header">
              <Link 
                to={loggedIn ?`/artist/${artist.name}` : "/login"}
                style={{ fontWeight: 700 }}
                className="text-light"
              >
                {artist.name}
              </Link>{' '}
              {/* {artist.createdAt} */}
            </p>
            <div className="card-body">
              <Link to={`/artist/${artist._id}`}>
                <p>{artist.description}</p>
                <p className="mb-0">
                  {/* Comments: {thought.reactionCount} · Click to {' '}  
                  {thought.reactionCount ? 'continue' : 'start'} talking! */}
                </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ArtistList;
