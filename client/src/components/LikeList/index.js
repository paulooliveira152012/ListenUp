import React from 'react';
import { Link } from 'react-router-dom';
import capitalizeFirstLetter from '../../utils/capFirstLetter';

const LikeList = ({ username, artists }) => {
  if (!artists || !artists.length) {
    return <p className="bg-dark text-light p-3">{capitalizeFirstLetter(username)}Go like an artist</p>;
  }

  return (
    <div>
      <h5>
        Likes
      </h5>
      {artists.map(artist => (
        <button className="btn w-100 display-block mb-2" key={artist._id}>
          <Link to={`/artist/${artist.name}`}>{artist.name}</Link>
        </button>
      ))}
    </div>
  );
};

export default LikeList;
