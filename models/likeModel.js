
const { Schema, model } = require("mongoose");

const LikeSchema = new Schema({
    likes: {
        type: Object,
        required: true,
    }
});

const LikeModel = model("Like", LikeSchema);

module.exports = LikeModel;
