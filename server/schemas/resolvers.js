const { AuthenticationError } = require('apollo-server-express');
const { User, Thought, Artist } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('thoughts')
        .populate('friends');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts')
        .populate('likes');
    },
    artists: async () => {
      return Artist.find()
        // .select('-__v')
        .populate('fans')
        .populate('thoughts')
    },
    artist: async (parent, { name }) => {
      return Artist.findOne({ name })
        // .select('-__v ')
        .populate('thoughts')
        .populate('fans')
    },
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    }
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addArtist: async (parent, args) => {
      const artist = await Artist.create(args);
      const token = signToken(artist);

      return { token, artist };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    addThought: async (parent, {artistName, thoughtText, createdAt, artistId}, context) => {
      if (context.user) {
        const thought = await Thought.create({ ...{artistName, thoughtText, createdAt}, username: context.user.username });

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true }
        );
        
        try {
          await Artist.findByIdAndUpdate(
            { _id: artistId },
            { $push: { thoughts: thought._id } },
            { new: true }
          );
        } catch (e) {
          console.log('error: ', e)
        }
        return thought;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          { $push: { reactions: { reactionBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );

        return updatedThought;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate('friends');

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addFan: async (parent, { artistId, userId }, context) => {
      // if (context.artist) {
        console.log(context)
        // console.log(context.user)
        const updatedArtist = await Artist.findOneAndUpdate(
          { _id: artistId },
          { $addToSet: { fans: context.user._id } },
          { new: true }
          
        ).populate('fans');
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { likes: updatedArtist._id } },
          { new: true }
        )
        console.log(updatedArtist);
        // console.log(user)
        return updatedArtist;
      // }

      // throw new AuthenticationError('You need to be logged in!');
    },
    removeFan: async(parent, {artistId, userId}, context) => {
      console.log(context.artist)
        const updatedArtist = await Artist.findOneAndUpdate(
          { _id: artistId },
          { $pull: { fans: context.user._id } },
          { new: true }
          
        ).populate('fans');
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { likes: updatedArtist._id } },
          { new: true }
        )
        return updatedArtist;
    }
  },
};

module.exports = resolvers;
