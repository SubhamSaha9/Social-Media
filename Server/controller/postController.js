import Post from '../models/post.js'
import User from '../models/user.js'
import Review from '../models/review.js'
import mongoose from 'mongoose'
import cloudinary from "cloudinary";

export const createPost = async (req, res) => {
    const newPost = new Post(req.body);

    try {
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const updatePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        if (post.userId === userId) {
            await post.updateOne({ desc: req.body.desc });
            const newPost = await Post.findById(id);
            res.status(200).json({ message: "Post Updated!", newPost: newPost });
        } else {
            res.status(403).json("Action forbidden!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const user = req.body;

    try {
        const post = await Post.findById(id);
        if (post.userId === user._id) {
            if (post.image) {
                const publicId = "posts/" + post.image.split('.')[0];
                const result = await cloudinary.uploader.destroy(publicId);
                console.log('Delete result:', result);
            }
            await Review.deleteMany({ postId: id });
            await post.deleteOne();
            res.status(200).json("Post deleted successfully!");
        } else {
            res.status(403).json("Action forbidden!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

export const likePost = async (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;
    try {
        const post = await Post.findById(id);
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } });
            res.status(200).json("Post liked");
        } else {
            await post.updateOne({ $pull: { likes: userId } });
            res.status(200).json("Post Unliked");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getTimelinePost = async (req, res) => {
    const id = req.params.id;

    try {
        const currUserPosts = await Post.find({ userId: id })
        // .populate({ path: "reviews", populate: { path: "author", select: "firstname lastname profilePicture" }, });
        let followingPosts = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "posts",
                    localField: "following",
                    foreignField: "userId",
                    as: "followingPosts",
                },
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0,
                },
            }
        ])
        // const followingPostss = await Post.populate(followingPosts, {
        //     path: "reviews",
        //     populate: {
        //         path: "author",
        //         select: "firstname lastname profilePicture"

        //     },
        // });
        res
            .status(200)
            .json(currUserPosts.concat(...followingPosts[0].followingPosts)
                .sort((a, b) => {
                    return b.createdAt - a.createdAt;
                })
            );

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}