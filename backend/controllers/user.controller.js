import {User} from "../models/user.model.js";
import {Post} from "../models/post.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { io } from '../server.js'; 



export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.json({ isAuthenticated: false });
    }

    jwt.verify(token, process.env.SECRET_KEY); // Verify the token
    return res.json({ isAuthenticated: true });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.json({ isAuthenticated: false });
  }
};

  


export const checkUserExistence = async (req, res) => {
    const { username, email } = req.body;

    try {
        // Check if either the username or email exists
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            // If user exists, return true
            return res.json({ exists: true });
        }

        // If no user found, return false
        return res.json({ exists: false });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

export const register = async (req, res) => {
    try {
        const {Name, username, email, password ,university} = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }

        // Check if the username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(401).json({
                message: "Username is already taken, try a different one.",
                success: false,
            });
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(401).json({
                message: "Email is already registered, try a different one.",
                success: false,
            });
        }

        // Hash the password and create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            Name,
            username,
            email,
            password: hashedPassword,
            university
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while creating the account.",
            success: false,
        });
    }
};


export const login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const { rememberMe } = req.query;  // Get the rememberMe status from query parameters
  
      if (!username || !password) {
        return res.status(401).json({
          message: "Something is missing, please check!",
          success: false
        });
      }
  
      let user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({
          message: "Incorrect username or password",
          success: false
        });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          message: "Incorrect username or password",
          success: false
        });
      }
  
    
      const token = await jwt.sign(
        { userId: user._id },
        process.env.SECRET_KEY,
        { expiresIn: rememberMe === 'true' ? '14d' : '2h' }  
      );
  
      return res.cookie('token', token, {
        httpOnly: true, 
        sameSite: 'strict', 
        maxAge: rememberMe === 'true' ? 14 * 24 * 60 * 60 * 1000 :  6*60 * 60 * 1000 
      }).json({
        message: `Welcome back ${user.username}`,
        success: true,
        user
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


export const updatePassword = async (req, res) => {
    try {
      const { password, confirmPassword, email } = req.body;
  
      // Ensure password and confirmPassword are provided
      if (!password || !confirmPassword) {
        return res.status(400).json({
          message: "Both password and confirm password are required.",
          success: false,
        });
      }
  
      // Ensure the passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({
          message: "Passwords do not match.",
          success: false,
        });
      }
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          message: "User not found.",
          success: false,
        });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({
        message: "Password updated successfully.",
        success: true,
      });
    } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({
        message: "Error updating password. Please try again.",
        success: false,
      });
    }
  };

export const logout=async (req,res) => {
    try {
        return res.cookie("token", "", {maxAge:0}).json({
            message: 'Logged out successfully.'
        });
    } catch (error) {
        console.log(error);
    }
};


export const getProfile1 = async (req, res) => {
  try {
    const userId = req.params.id;
 
    let user = await User.findById(userId).populate({ path: 'posts' }).populate('bookmarks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({
      user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Controller to get the logged-in user details (e.g., user ID)
export const getUserDetails = async (req, res) => {
  try {
    // The `userId` is attached to `req.id` by the `isAuthenticated` middleware
    const userId = req.id;

    if (!userId) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Respond with the user ID or other details if needed
    res.status(200).json({
      userId: userId,
      message: 'User details fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const getProfile=  async (req, res) => {
  try {
    const userId = req.id;  // Get user ID from JWT payload

    // Find user by ID and exclude sensitive fields like password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Respond with the user's profile data
    res.status(200).json({
      message: "Profile fetched successfully.",
      user: {
        _id: user._id,
        Name: user.Name,
        university: user.university,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture || "profile.jpg",  // If profilePicture is empty, use a default
        coverimage: user.coverimage,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
        bookmarks: user.bookmarks,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        notifications:user.notifications
      }
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const editProfile = async (req, res) => {
  try {
      const userId = req.id;
      const { bio, gender } = req.body;
      const profilePicture = req.files?.profilePicture?.[0]; // Access the first file for 'profilePicture'
      const coverImage = req.files?.coverImage?.[0]; // Access the first file for 'coverImage'
      let profilePictureResponse, coverImageResponse;

      // Handle profile picture upload
      if (profilePicture) {
          const profilePictureUri = getDataUri(profilePicture);
          profilePictureResponse = await cloudinary.uploader.upload(profilePictureUri);
      }

      // Handle cover image upload
      if (coverImage) {
          const coverImageUri = getDataUri(coverImage);
          coverImageResponse = await cloudinary.uploader.upload(coverImageUri);
      }

      const user = await User.findById(userId).select('-password');

      if (!user) {
          return res.status(404).json({
              message: 'User not found.'
          });
      }

      // Update user fields
      if (bio) user.bio = bio;
      if (gender) user.gender = gender;
      if (profilePictureResponse) user.profilePicture = profilePictureResponse.secure_url;
      if (coverImageResponse) user.coverimage = coverImageResponse.secure_url;

      await user.save();

      return res.status(200).json({
          message: 'Profile updated.',
          user
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

export const editBio = async (req, res) => {
  try {
      const userId = req.id;
      const { bio } = req.body;

      const user = await User.findById(userId).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found.' });

      if (bio) user.bio = bio;
      await user.save();

      return res.status(200).json({ message: 'Bio updated.', user });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

export const editProfilePicture = async (req, res) => {
  try {
      const userId = req.id;
      const profilePicture = req.files?.profilePicture?.[0];

      if (!profilePicture) return res.status(400).json({ message: 'No profile picture uploaded.' });

      const user = await User.findById(userId).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found.' });

      const profilePictureUri = getDataUri(profilePicture);
      const profilePictureResponse = await cloudinary.uploader.upload(profilePictureUri);

      user.profilePicture = profilePictureResponse.secure_url;
      await user.save();

      return res.status(200).json({ message: 'Profile picture updated.', user });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong', success: false });
  }
};

export const editCoverImage = async (req, res) => {
  try {
      const userId = req.id;
      const coverImage = req.files?.coverimage?.[0]; // Access the first file for 'coverimage'

      if (!coverImage) {
          return res.status(400).json({ message: 'No cover image uploaded.' });
      }

      const user = await User.findById(userId).select('-password');
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      const coverImageUri = getDataUri(coverImage);  // Get data URI
      const coverImageResponse = await cloudinary.uploader.upload(coverImageUri);  // Upload to cloudinary

      user.coverimage = coverImageResponse.secure_url;
      await user.save();

      return res.status(200).json({
          message: 'Cover image updated.',
          user
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong', success: false });
  }
};







export const getSuggestedUsers = async (req, res) => {
  try {
      // Fetch the current user to get their following and followers list
      const currentUser = await User.findById(req.id).select('following followers');
      if (!currentUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      const { following, followers } = currentUser;

      // Fetch common users from the user's following and followers
      const commonUsers = await User.find({
          _id: {
              $nin: [...following, req.id], // Exclude already followed users and the user themselves
          },
          followers: { $in: followers }, // Check if they are followed by current user's followers
      }).select('-password');

      let suggestedUsers = commonUsers;

      // If fewer than 5 suggested users, fetch additional random users
      if (suggestedUsers.length < 4) {
          const additionalUsers = await User.aggregate([
              {
                  $match: {
                      _id: { $nin: [...following, req.id] }, // Exclude current user and their following list
                  },
              },
              { $sample: { size: 4- suggestedUsers.length } }, // Fetch random users to fill the gap
          ]);

          // Merge results and remove duplicates
          suggestedUsers = [...suggestedUsers, ...additionalUsers].filter(
              (user, index, self) => index === self.findIndex((u) => u._id.equals(user._id))
          );
      }

      // Return the top 5 users, prioritizing common users
      return res.status(200).json({
          users: suggestedUsers.slice(0, 4),
      });
  } catch (error) {
      console.error('Error fetching suggested users:', error);
      return res.status(500).json({
          message: 'Server error',
      });
  }
};



export const followOrUnfollow = async (req, res) => {
  try {
    const person1 = req.id; // User performing the action
    const person2 = req.params.id; // Target user

    if (person1 === person2) {
      return res.status(400).json({ message: 'You cannot follow/unfollow yourself' });
    }

    const user = await User.findById(person1);
    const targetUser = await User.findById(person2);

    if (!user || !targetUser) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isFollowing = user.following.includes(person2);

    if (isFollowing) {
      // Unfollow
      await Promise.all([
        User.updateOne({ _id: person1 }, { $pull: { following: person2 } }),
        User.updateOne({ _id: person2 }, { $pull: { followers: person1 } }),
      ]);

      // Remove the follow notification (if any)
      await User.updateOne(
        { _id: person2 },
        {
          $pull: {
            notifications: { message: `${user.username} followed you` }, // Remove the follow notification
          },
        }
      );

      return res.status(200).json({ message: 'Unfollowed successfully' });
    } else {
      // Follow
      const followerProfilePicture = user.profilePicture;

      // Check if the follow notification already exists
      const existingNotification = targetUser.notifications.some(
        (notification) => notification.message === `${user.username} followed you`
      );

      if (!existingNotification) {
        // Add notification if it doesn't exist
        await User.updateOne(
          { _id: person2 },
          {
            $push: {
              notifications: {
                message: `${user.username} followed you`,
                timestamp: new Date(),
                profile: followerProfilePicture,
                userID:req.id
                 // Add the follower's profile picture to the notification
              },
            },
          }
        );
      }

      // Add the follow relationship
      await Promise.all([
        User.updateOne({ _id: person1 }, { $push: { following: person2 } }),
        User.updateOne({ _id: person2 }, { $push: { followers: person1 } }),
      ]);

      io.emit('followNotification', {
        message: `${user.username} followed ${targetUser.username}`,
      });

      return res.status(200).json({ message: 'Followed successfully' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};


// Fetch the latest 3 notifications
export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.id).select('notifications');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const latestNotifications = user.notifications
      .slice(-3)
      .reverse(); // Get the latest 3 notifications

    res.status(200).json({ notifications: latestNotifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};



