
const { Schema, model } = require("mongoose");

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    uid: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const BlogModel = model("Blog", BlogSchema);

module.exports = BlogModel;
