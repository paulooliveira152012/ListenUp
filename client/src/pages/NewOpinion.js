import React from 'react';
import ThoughtForm from '../components/ThoughtForm';
import Auth from '../utils/auth';

const loggedIn = Auth.loggedIn();

const NewOpinion = () => {
    return (
        <div>
            {loggedIn && (
                <div className="col-12 mb-3">
                <ThoughtForm />
                </div>
            )}
        </div> 
    );
};



export default NewOpinion