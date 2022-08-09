import React from 'react';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ArtistList from '../components/ArtistList';

import Auth from '../utils/auth';
import { useQuery } from '@apollo/client';
import { QUERY_ARTISTS, QUERY_ME_BASIC } from '../utils/queries';
import { Link } from 'react-router-dom';

const Home = () => {
  const { loading, data } = useQuery(QUERY_ARTISTS);
  const { data: userData } = useQuery(QUERY_ME_BASIC);
  const artists = data?.artists || [];

  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className="flex-row justify-space-between">
        {loggedIn && (
        <div className="col-12 mb-3">
          <Link to="/new-opinion"> <button className="btn col-12 col-md-3" type="submit"> Add Opinion</button></Link>
        </div>
        )}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ArtistList
              artists={artists}
              title="Our Opinions "
            />
          )}
        </div>
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
