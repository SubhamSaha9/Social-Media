import Review from '../models/review.js'
import Post from '../models/post.js'

export const createReview = async (req, res) => {
    let { id } = req.params;
    try {
        // let post = await Post.findById(id);
        let newReview = new Review({
            comment: req.body.comment,
            author: req.body.author,
            postId: id
        });
        // post.reviews.push(newReview);

        const review = await newReview.save();
        const populatedReview = await review.populate({ path: "author", select: "firstname lastname profilePicture" });

        // await post.save();
        // console.log(post);

        res.status(200).json(review);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
};

export const getAllReviews = async (req, res) => {
    let { id } = req.params;
    try {
        let reviews = await Review.find({ postId: id }).populate({ path: "author", select: "firstname lastname profilePicture" });
        res.status(200).json(reviews.sort((a, b) => {
            return b.createdAt - a.createdAt;
        }));
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

export const updateReview = async (req, res) => {
    let { reviewId } = req.params;
    const data = req.body;
    try {
        const review = await Review.findById(reviewId);
        if (review.author.toString() === data.userId) {
            await review.updateOne({ comment: data.comment });
            res.status(200).json("success")
        } else {
            res.status(403).json("Action forbidden!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

export const deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    const user = req.body;
    try {
        const review = await Review.findById(reviewId);
        if (review.author.toString() === user._id) {
            // await Post.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
            await review.deleteOne();
            res.status(200).json("Comment deleted successfully!")
        } else {
            res.status(403).json("Action forbidden!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}