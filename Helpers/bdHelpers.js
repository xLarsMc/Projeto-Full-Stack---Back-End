const { userModel, postModel } = require('../Models/model');
const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = {
  newUser: async (login, senha) => {
    const user = await userModel.create({ login, senha });
    return user;
  },
  newPost: async (name, commonPlaces, description, drops, image) => {
    const post = await postModel.create({
      name,
      commonPlaces,
      description,
      drops,
      image,
    });
    return post;
  },
  getPost: async (name) => {
    const foundPost = await postModel.findOne({ name: name });
    return foundPost;
  },
  getAllPost: async () => {
    const allPost = await postModel.find();
    return allPost;
  },
  deleteAll: async () => {
    const deletedPosts = await postModel.deleteMany();
    const deletedUsers = await userModel.deleteMany();
    const deletedArray = [deletedPosts, deletedUsers];
    return deletedArray;
  },
  getUser: async (login) => {
    const user = await userModel.findOne({ login: login });
    return user;
  },
  getLoginByAuthHeader: async(authHeader) => {
    const token = authHeader && authHeader.split(' ')[1]
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret)
    console.log(decoded.login)
    return decoded.login;
  },
  searchPosts: async (query) => {
    if (!query) {
      return []; 
    }

    const regex = new RegExp(query, 'i'); 

    const posts = await postModel.find({
      $or: [
        { name: regex },
        { commonPlaces: regex },
        { description: regex },
        { drops: regex }
      ]
    });

    return posts;
  }
};
