const mongoose = require('mongoose');

const user = new mongoose.Schema({
    login: String,
    senha: String
});

const post = new mongoose.Schema({
    name: String,
    commonPlaces: String,
    description: String,
    drops: String,
    image:String
})

const userModel = mongoose.model("user", user);
const postModel = mongoose.model("post", post);

module.exports = {
    userModel,
    postModel
}