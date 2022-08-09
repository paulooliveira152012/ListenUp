import React from "react";
import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';

import { QUERY_ARTISTS } from "../utils/queries";
import auth from "../utils/auth";

const ViewArtists = () => {
    const { artistName } = useParams();
    const { loading, data } = useQuery(QUERY_ARTISTS);

    const loggedIn = auth.loggedIn();

    console.log(data);

    return (
        <div>
            <h3>Click to View Discussions</h3>
            {data &&
            data.artists.map(artist => (
              <div className="card mb-3">
                <p className="card-header">
                  <Link 
                    to={loggedIn ?`/artist/${artist.name}` : "/login"}
                    style={{ fontWeight: 700 }}
                    className="text-tertiary"
                  >
                    {artist.name}
                  </Link>{' '}
                </p>
                <div className="card-body">
                    <p>{artist.description}</p>
                </div>
              </div>
            ))}
        </div>
    )
}

export default ViewArtists;