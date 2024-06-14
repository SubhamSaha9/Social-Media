import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = Schema({
    comment: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
})

let Review = mongoose.model("Review", reviewSchema);
export default Review;