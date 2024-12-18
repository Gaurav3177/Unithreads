import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import {Post} from "../models/post.model.js";
import {User} from "../models/user.model.js";
import {Comment} from "../models/comment.model.js";


export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 }) // Sort posts by createdAt in descending order
            .populate({ path: 'author', select: 'username profilePicture university' })
            .populate({
                path: 'comments',
                sort: { createdAt: 1 }, // Sort comments by createdAt in ascending order
                populate: {
                    path: 'author',
                    select: 'username profilePicture university'
                }
            });

        return res.status(200).json({ posts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: 'Image required' });

        // Optimize the image before uploading to cloudinary
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        // Upload to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        // Create a new post
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        // Add the post ID to the author's post list
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        // Populate the author data including the university name
        await post.populate({
            path: 'author',
            select: '-password',
            options: { lean: true }
        });

        // Add university name to the author field in the post data
        post.author = {
            _id: post.author._id,
            username: post.author.username,
            profilePicture: post.author.profilePicture,
            university: post.author.university
        };

        return res.status(201).json({
            message: 'New post added',
            post
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({ createdAt:-1}).populate({
            path: 'author',
            select: 'username, profilePicture'
        }).populate({
            path: 'comments',
            sort: {createdAt:-1},
            populate: {
                path: 'author',
                select: 'username, profilePicture'
            }
        });
        return res.status(200).json({
            posts
        })
    } catch (error) {
        console.log(error);
    }
}

// Controller to fetch the updated post after like or dislike
export const getPostById = async (req, res) => {
    try {
      const postId = req.params.id; // Get the post ID from the request parameters
      const post = await Post.findById(postId); // Find the post by ID
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      return res.status(200).json({ post }); // Send the post data in the response
    } catch (error) {
      console.error("Error fetching post:", error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

// Like Post
export const likePost = async (req,res) => {
    try {
        const likeId = req.id;
        const postId = req.params.id; 
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message:'Post not found'});

      
        await post.updateOne({ $addToSet: {likes:likeId}});

        return res.status(200).json({message:'Post liked'});
    } catch (error) {

    }
}

export const dislikePost = async (req,res) => {
    try {
        const dislikeId = req.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        
        if (!post) return res.status(404).json({ message: 'Post not found' });
        await post.updateOne({ $pull: { likes: dislikeId } });
        return res.status(200).json({ message: 'Post disliked' });
    } catch (error) {}
}; 

export const addComment = async (req,res) =>{
    try {
        const postId = req.params.id;
        const commentId = req.id;
        const {text} = req.body;

        const post = await Post.findById(postId);

        if(!text) return res.status(400).json({message:'text is required'});

        const comment = await Comment.create({
            text,
            author:commentId,
            post:postId
        })

        await comment.populate({
            path:'author',
            select:"username profilePicture"
        });
        
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message:'Comment Added',
            comment
        })

    } catch (error) {
        console.log(error);
    }
};
export const getCommentsOfPost = async (req,res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({post:postId}).populate('author', 'username profilePicture');

        if(!comments) return res.status(404).json({message:'No comments found for this post'});

        return res.status(200).json({comments});

    } catch (error) {
        console.log(error);
    }
}
export const deletePost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found'});

        if(post.author.toString()!== authorId) return res.status(403).json({message:'Unauthorized'});

  
        await Post.findByIdAndDelete(postId);

        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();
        await Comment.deleteMany({post:postId});

        return res.status(200).json({
            message:'Post deleted'
        })

    } catch (error) {
        console.log(error);
    }
}
export const bookmarkPost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found'});
        
        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved', message:'Post removed from bookmark'});

        }else{
    
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'saved', message:'Post bookmarked'});
        }

    } catch (error) {
        console.log(error);
    }
}