import mongoose from "mongoose";
const Schema = mongoose.Schema;

const postSchema = Schema({
    userId: {
        type: String,
        required: true
    },
    desc: String,
    likes: [],
    image: String,
    // reviews: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Review",
    //     }
    // ],
},
    {
        timestamps: true,
    });

let Post = mongoose.model("Post", postSchema);
export default Post;