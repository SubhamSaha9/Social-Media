import express from 'express';
import { createReview, deleteReview, getAllReviews, updateReview } from '../controller/reviewController.js';
const router = express.Router({ mergeParams: true });

router.post("/", createReview);
router.get("/", getAllReviews);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

export default router;