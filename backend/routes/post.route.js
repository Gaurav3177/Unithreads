import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost,likePost,dislikePost, getPostById,bookmarkPost, deletePost, getAllPost, getCommentsOfPost, getUserPost} from "../controllers/post.controller.js";

const router = express.Router();

router.route("/addpost").post(isAuthenticated,upload.single('image'), addNewPost);
router.route("/getallpost").get(getAllPost);
router.route("/userpost/all").get( isAuthenticated,getUserPost);

router.route("/:id/like").post(isAuthenticated,likePost);
router.route("/:id/dislike").post(isAuthenticated,dislikePost);
router.route("/:id").get(isAuthenticated, getPostById);


router.route("/:id/addcomment").post(isAuthenticated,addComment); 
router.route("/:id/getallcomments").post( getCommentsOfPost);
router.route("/delete/:id").delete( isAuthenticated,deletePost);
router.route("/:id/bookmark").get(isAuthenticated,bookmarkPost);

export default router;

