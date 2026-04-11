
const { Schema, model } = require("mongoose");

const LikesSchema = new Schema({
    likes: {
        type: Object,
        required: true,
    }
});

const LikesModel = model("Likes", LikesSchema);

module.exports = LikesModel;
