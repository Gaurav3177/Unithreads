import express from "express";
import { editProfile, followOrUnfollow,getProfile,getProfile1,getNotifications, getSuggestedUsers, editBio,editCoverImage,editProfilePicture,login, logout, register, updatePassword ,checkUserExistence,checkAuth,getUserDetails } from "../controllers/user.controller.js"; // Import the updatePassword controller
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {User} from "../models/user.model.js";
import {Post} from "../models/post.model.js";
import ChatMessage from '../models/ChatMessage.js';


const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.post("/update" ,updatePassword); // Add the route for password update
router.route('/logout').post(logout);
router.route('/getprofile').get(isAuthenticated, getProfile);
router.route('/getprofile1/:id').get(isAuthenticated, getProfile1);
router.route('/editprofile').post(isAuthenticated, upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), editProfile);
router.get('/me', isAuthenticated, getUserDetails);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.route('/editbio').post(isAuthenticated, editBio);
router.route('/editprofile').post(isAuthenticated, upload.single('profilePicture'), editProfilePicture);

router.route('/editcover').post(
    isAuthenticated, 
    upload.fields([{ name: 'coverimage', maxCount: 1 }]),  // Use fields for multiple files (coverimage in this case)
    editCoverImage
  );



router.get('/notifications', isAuthenticated, getNotifications);
router.get('/bookmarks',isAuthenticated, async (req, res) => {
    try {
      // Assuming the user is authenticated and their ID is in the request (e.g., req.user.id)
      const userId = req.id;  // Or use `req.params.userId` or `req.body.userId` based on your setup
  
      // Find the user and populate the bookmarks field with the post data
      const user = await User.findById(userId).populate({
        path: 'bookmarks',
        populate: {
          path: 'author',  // Populate author details of each post
          select: 'Name username profilePicture'  // Select necessary fields from the author
        }
      });
  
      // If user is not found, return an error
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send back the bookmarked posts
      res.status(200).json({ bookmarkedPosts: user.bookmarks });
    } catch (error) {
      console.error('Error fetching bookmarked posts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/messages', isAuthenticated, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ message: 'Message text is required' });
  
      const newMessage = await ChatMessage.create({
        sender: req.id,
        text,
      });
  
      await newMessage.populate('sender', 'username profilePicture');
      res.status(201).json({ message: 'Message sent', newMessage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error sending message' });
    }
  });

  router.get('/messages', isAuthenticated, async (req, res) => {
    try {
      const messages = await ChatMessage.find()
        .sort({ timestamp: 1 })
    
        .populate('sender', 'username profilePicture');
      res.status(200).json({ messages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching messages' });
    }
  });
  

router.post("/user/check", checkUserExistence);

router.route('/checkauth').get(checkAuth);
export default router;
