import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
  const [thoughtText, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

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
        console.warn("First thought insertion by user!")
      }

      // update thought array's cache
      const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
      cache.writeQuery({
        query: QUERY_THOUGHTS,
        data: { thoughts: [addThought, ...thoughts] },
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

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await addThought({
        variables: { thoughtText },
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
      >
        <div className="dropdown">
          <p className='m-0'>
            Choose an Artist
          </p>
          <select className="btn col-12 col-md-4">
            <option>Hannah Montana</option>
            <option>jermey</option>
          </select>
        </div>
        <p className='m-0'>
            ... Or Add Your Own
        </p>
        <div className='newArtistDiv flex-row justify-center justify-space-between-md align-stretch'>
          <input 
            className='newArtist form-input col-12 col-md-9'
            placeholder="Type Artist Name Here"
            onChange={handleChange}
          ></input>
          <button 
            className="btn col-12 col-md-3"
            onClick={handleFormSubmit}
          >
            Add Artist
          </button>
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
          onClick={handleFormSubmit}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
