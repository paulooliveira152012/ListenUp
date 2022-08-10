import React from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import LikeList from '../components/LikeList';

import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';
import capitalizeFirstLetter from '../utils/capFirstLetter';
import Auth from '../utils/auth';

const Profile = (props) => {
  const { username: userParam } = useParams();

  const [addFriend] = useMutation(ADD_FRIEND);
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  console.log(user);
  // navigate to personal profile page if username is yours
  // if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
  //   return <Navigate to="/profile:username" />;
  // }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id },
      });
    } catch (e) {
      console.error(e);
    }
  };
  console.log()
  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${capitalizeFirstLetter(user.username)}'s` : 'your'} profile.
        </h2>
        
        {Auth.getProfile().data.username === userParam ? 
          <div className="col-12 mb-3">
            <Link to="/new-opinion"> <button className="btn col-12 col-md-3" type="submit"> Add Opinion or Artist</button></Link>
          </div>
          : 
          <button className="btn ml-auto" onClick={handleClick}>
            Add Friend
          </button>
        }
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={user.thoughts}
            title={`${capitalizeFirstLetter(user.username)}'s opinion...`}
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={capitalizeFirstLetter(user.username)}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
        <div className="col-12 col-lg-3 mb-3">
          <LikeList
            username={capitalizeFirstLetter(user.username)}
            artists={user.likes}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
