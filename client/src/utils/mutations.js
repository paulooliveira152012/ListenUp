import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_ARTIST = gql`
<<<<<<< HEAD
  mutation addArtist($name: String!, $wiki: String, $description: String) {
    addArtist(name: $name, wiki: $wiki, description: $description) {
      _id
      name
      wiki
      description
=======
  mutation addArtist($name: String!, $wiki: String!, $description: String!) {
    addArtist(name: $name, wiki: $wiki, description: $description) {
      token
      artist {
        _id
        name
        wiki
        description
      }
>>>>>>> 3f0c7ecf42685a553e2da8896604e0223af32467
    }
  }
`;

export const ADD_THOUGHT = gql`
<<<<<<< HEAD
  mutation addThought($thoughtText: String!, $artistName: String!, $artistId: ID!) {
    addThought(thoughtText: $thoughtText, artistName: $artistName, artistId: $artistId) {
=======
  mutation addThought($thoughtText: String!, $artistId: ID!) {
    addThought(thoughtText: $thoughtText, artistId: $artistId) {
>>>>>>> 3f0c7ecf42685a553e2da8896604e0223af32467
      _id
      artistName
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
      }
    }
  }
`;
export const ADD_REACTION = gql`
  mutation addReaction($thoughtId: ID!, $reactionBody: String!) {
    addReaction(thoughtId: $thoughtId, reactionBody: $reactionBody) {
      _id
      reactionCount
      reactions {
        _id
        reactionBody
        createdAt
        username
      }
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;

export const ADD_FAN = gql`
  mutation addFan($artistId: ID!, $userId: ID!) {
    addFan(artistId: $artistId, userId: $userId) {
      _id
      name
      fans {
        _id
        username
      }
    }
  }
`;

export const REMOVE_FAN = gql`
  mutation removeFan($artistId: ID!, $userId: ID!) {
    removeFan(artistId: $artistId, userId: $userId) {
      _id
      name
      fans {
        _id
        username
      }
    }
  }
  `;

export const REMOVE_FRIEND = gql`
  mutation removeFriend($id: ID!) {
    removeFriend(id: $id) {
      _id
      username
      friends {
        _id
        username
      }
    }
  }
`;
