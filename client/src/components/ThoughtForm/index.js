import React, { useState, useEffect } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { ADD_ARTIST, ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME, QUERY_ARTISTS } from '../../utils/queries';

const ThoughtForm = () => {
  const [thoughtText, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [artistName, setArtistName] = useState('')
  const [artistWiki, setArtistWiki] = useState('')
  const [artistDescription, setArtistDescription] = useState('')
  const [selectedArtist, setSelectedArtist] = useState()

  const { loading: loadingArtists, data: artistData } = useQuery(QUERY_ARTISTS);
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought } }) {
        // could potentially not exist yet, so wrap in a try/catch
      try {
        // update me array's cache
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
        });
      } catch (e) {
        console.log(e)
      }

      // update thought array's cache
      const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
      cache.writeQuery({
        query: QUERY_THOUGHTS,
        data: { thoughts: [addThought, ...thoughts] },
      });

      // TODO: update artist query cache with new thought on selected artist
      // high priority
    }
  });

  const [addArtist, { addArtistError }] = useMutation(ADD_ARTIST, {
    update(cache, { data: { addThought } }) {
      // update thought array's cache
      const { artists } = cache.readQuery({ query: QUERY_ARTISTS });
      cache.writeQuery({
        query: QUERY_ARTISTS,
        data: { artists: [addArtist, ...artists] },
      });
    }
  });


  // update state based on form input changes
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  const handleCreateArtist = async (event) => {
    event.preventDefault()
    await addArtist({
      variables: {
        name: artistName,
        wiki: artistWiki,
        description: artistDescription,
      }
    })
    setSelectedArtist(artistName)
  }

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const selectedArtistObj = artistData.artists.filter(artist => artist._id === selectedArtist);
      const thought = await addThought({
        variables: { thoughtText, artistName: selectedArtistObj[0].name, artistId:  selectedArtist },
      });

      // clear form value
      setText('');
      setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <form
        className="flex-column justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <h3>Add an Opinion</h3>
          <div className="dropdown">
            <label htmlFor='selectArtist'>Choose an Artist</label><br />
            <select
              name='selectArtist'
              value={selectedArtist}
              onChange={e => setSelectedArtist(e.target.value)}
              className="btn col-12 col-md-4"
            >
              {loadingArtists ? <option>Loading...</option> :
                artistData.artists.map(artist => (
                  <option value={artist._id}>{artist.name}</option>
                ))
              }
            </select>
          </div>
        <p
          className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}
          >
            Character Count: {characterCount}/280
            {error && <span className="ml-2">Something went wrong...</span>}
          </p>
        <textarea
          placeholder="Tell us your opinion..."
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <button 
          className="btn col-12 col-md-3" 
        >
          Submit
        </button>
      </form>
      <form
        className="flex-column justify-center justify-space-between-md align-stretch"
      >
        <h3>Add a New Artist</h3>

<label htmlFor="artistName">Name</label>
        <input
          name="artistName"
          className="form-input col-12 col-md-9"
          value={artistName}
          onChange={e => setArtistName(e.target.value)}
        />
        <label htmlFor="artistWiki">Wikipedia Page Link</label>
        <input
          name="artistWiki"
          className="form-input col-12 col-md-9"
          value={artistWiki}
          onChange={e => setArtistWiki(e.target.value)}
        />
        <label htmlFor="artistDescription">Description</label>
        <textarea
          name="artistDescription"
          className="form-input col-12 col-md-9"
          value={artistDescription}
          onChange={e => setArtistDescription(e.target.value)}
        />

        <button 
          onClick={handleCreateArtist}
          className="btn col-12 col-md-3" 
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
