import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { QUERY_ARTIST } from '../utils/queries';
import auth from '../utils/auth';

const loggedIn = auth.loggedIn();


const Artist = () => {
  const { artistName } = useParams();
  const { loading, data } = useQuery(QUERY_ARTIST, {
    variables: { name: artistName },
  });

  console.log(data);
  if (loading) return <div></div>
  return (
    <div>
      <h3>{data.artist.name}</h3>
      <p>{data.artist.description}</p>
      {data &&
        data.artist.thoughts.map(thought => (
          <div className="card mb-3">
            <p className="card-header">
              <Link 
                to={loggedIn ?`/profile/${thought.username}` : "/login"}
                style={{ fontWeight: 700 }}
                className="text-tertiary"
              >
                {thought.username}
              </Link>{' '}
              {thought.createdAt}
            </p>
            <div className="card-body">
              <Link to={`/thought/${thought._id}`}>
                <p>{thought.thoughtText}</p>
                <p className="mb-0">
                  Comments: {thought.reactionCount} · Click to {' '}  
                  {thought.reactionCount ? 'continue' : 'start'} talking!
                </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Artist;