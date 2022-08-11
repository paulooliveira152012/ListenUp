import { useQuery, useMutation } from '@apollo/client';
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { QUERY_ARTIST, QUERY_USER, QUERY_ME_BASIC } from '../utils/queries';
import { ADD_FAN, REMOVE_FAN } from '../utils/mutations';
import auth from '../utils/auth';

const loggedIn = auth.loggedIn();


const Artist = () => {
  const { artistName } = useParams();
  const { data: userData } = useQuery(QUERY_ME_BASIC);
  // const { username: userParam } = useParams();
  // const { username } = useParams();
  const [addFan] = useMutation(ADD_FAN);
  const [removeFan] = useMutation(REMOVE_FAN);

  // const { loading2, data2 } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
  //   variables: { username: userParam },
  // });

  const { loading, data } = useQuery(QUERY_ARTIST, {
    variables: { name: artistName },
  });

  // const user = data2?.me || data2?.user || {};
  const artist = data?.artist || {};
  const handleClick = async () => {
    try {console.log(userData.me._id)
      console.log(artist._id)
      await addFan({
        
        variables: {artistId: artist._id, userId: userData.me._id },
      });
    } catch (e) {
      console.error(e);
    }
  };
  const handleClick2 = async () => {
    try {console.log(userData.me._id)
      console.log(artist._id)
      await removeFan({
        
        variables: {artistId: artist._id, userId: userData.me._id },
      });
    } catch (e) {
      console.error(e);
    }
  };

  console.log(data);
  if (loading) return <div></div>
  return (
    <div>
      <h3>{data.artist.name}</h3>
      <button 
        className="btn ml-auto" 
        onClick={handleClick}
        style={{margin:"10px"}}
      >
        Like Artist
      </button>
      <button className="btn ml-auto" onClick={handleClick2}>
        Unlike
      </button>
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