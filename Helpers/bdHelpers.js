const {userModel, postModel} = require('../Models/model');

module.exports = {
    newUser: async(login, senha) => {
        const user = await userModel.create({login, senha});
        return user
    },
    newPost: async(name, commonPlaces, description, drops) => {
        const post = await postModel.create({name, commonPlaces, description, drops});
        return post;
    },
    getPost: async(name) => {
        const foundPost = await postModel.findOne({name: name});
        return foundPost;
    },
    getAllPost: async() => {
        const allPost = await postModel.find();
        return allPost;
    },
    deleteAll: async() => {
        const deletedPosts = await postModel.deleteMany();
        const deletedUsers = await userModel.deleteMany();
        const deletedArray = [deletedPosts, deletedUsers]
        return deletedArray;
    }
}