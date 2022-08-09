import React from 'react';
import { Link } from 'react-router-dom';
import capitalizeFirstLetter from '../../utils/capFirstLetter';

const FriendList = ({ friendCount, username, friends }) => {
  if (!friends || !friends.length) {
    return <p className="bg-dark text-light p-3">{capitalizeFirstLetter(username)}, follow some people!</p>;
  }

  return (
    <div>
      <h5>
        Following {friendCount}
      </h5>
      {friends.map(friend => (
        <button className="btn w-100 display-block mb-2" key={friend._id}>
          <Link to={`/profile/${friend.username}`}>{friend.username}</Link>
        </button>
      ))}
    </div>
  );
};

export default FriendList;
