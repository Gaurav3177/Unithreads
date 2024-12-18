import React, { useEffect, useState } from "react";
import axios from "axios";

function MainContent() {
  const [posts, setPosts] = useState([]); // To store fetched posts
  const [currentUserId, setCurrentUserId] = useState(null); // To store logged-in user's ID
  const [postContent, setPostContent] = useState(""); // To store new post content
  const [postImage, setPostImage] = useState(null); // To store selected image
  const [isUploading, setIsUploading] = useState(false); 
  const [followedUsers, setFollowedUsers] = useState([]); // To track the followed users
  const [newComment, setNewComment] = React.useState({});






  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/me', {
          withCredentials: true, // Include cookies in the request
        });
        setCurrentUserId(response.data.userId); // Set the logged-in user's ID
  
        // Fetch followed users for the current user
        const response2 = await axios.get('http://localhost:8080/user/getprofile', {
          withCredentials: true,
        });
        setFollowedUsers(response2.data.user.following); // Set the followed users
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };


    
  
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/post/getallpost", {
          withCredentials: true,
        });
        const postsWithBookmarkStatus = response.data.posts.map((post) => ({
          ...post,
          bookmarked: post.bookmarks?.includes(currentUserId),
        }));
        setPosts(postsWithBookmarkStatus);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
  
    fetchUserDetails(); // Fetch user details
    fetchPosts(); // Fetch posts
  
    const intervalId = setInterval(fetchPosts, 2000); // Keep refreshing posts every 2 seconds
  
    // Cleanup interval when component unmounts
    return () => clearInterval(intervalId);
  }, [currentUserId]); // Empty dependency array means this runs once when the component is mounted
   // Empty dependency array means this runs once when the component is mounted

   // Typing animation for the placeholder text


  useEffect(() => {
    const textarea = document.getElementById('postContent');
    const placeholderText = "What's on your mind?";
    let index = 0;
    let isDeleting = false;
    let interval = 100;
    let delay = 2000; // Delay before starting the animation
    let typingInterval;
  
    function type() {
      if (index <= placeholderText.length && !isDeleting) {
        textarea.setAttribute('placeholder', placeholderText.substring(0, index));
        index++;
      } else if (index > 0 && isDeleting) {
        textarea.setAttribute('placeholder', placeholderText.substring(0, index));
        index--;
      }
  
      if (index === placeholderText.length) {
        isDeleting = true;
      } else if (index === 0 && isDeleting) {
        isDeleting = false;
      }
    }
  
    function startTypingEffect() {
      typingInterval = setInterval(type, interval);
      setTimeout(() => {
        clearInterval(typingInterval);
        setTimeout(startTypingEffect, delay); // Delay before repeating the effect
      }, delay);
    }
  
    // Start typing effect
    startTypingEffect();

    // Cleanup function to stop typing effect on component unmount
    return () => clearInterval(typingInterval);
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!postContent || !postImage) {
      alert("Please provide content and an image for your post.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", postContent);
    formData.append("image", postImage);

    try {
      setIsUploading(true); // Set uploading state to true

      const response = await axios.post("http://localhost:8080/post/addpost", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newPost = response.data.post;
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setPostContent(""); // Clear post content
      setPostImage(null); // Clear selected image
      document.getElementById("postForm").reset(); // Reset form fields

      setIsUploading(false); // Set uploading state to false
      alert("Post uploaded successfully!"); // Show alert when upload is done
    } catch (error) {
      console.error("Error adding post:", error);
      setIsUploading(false); // Set uploading state to false on error
      alert("Error uploading post.");
    }
  };


  const handleToggleBookmark = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:8080/post/${postId}/bookmark`, {
        withCredentials: true,
      });
  
      // Update the posts state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, bookmarked: response.data.type === "saved" }
            : post
        )
      );
  
      // Optional: Show an alert for feedback
      if (response.data.type === "saved") {
        alert("Post bookmarked successfully!");
      } else if (response.data.type === "unsaved") {
        alert("Post removed from bookmarks!");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      alert("An error occurred while toggling the bookmark.");
    }
  };
  
  



  const handleFollowUnfollow = async (targetUserId) => {
    try {
      const response = await axios.post(`http://localhost:8080/user/followorunfollow/${targetUserId}`, {}, { withCredentials: true });
      
      if (response.status === 200) {
        // Update the followedUsers state
        setFollowedUsers((prev) => {
          if (prev.includes(targetUserId)) {
            return prev.filter((id) => id !== targetUserId); // Unfollowed, so remove from list
          } else {
            return [...prev, targetUserId]; // Followed, so add to list
          }
        });
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };
  const hcomment = async (postId) => {
    const text = newComment[postId];
    if (!text) return alert("Comment cannot be empty.");
  
    try {
      // Make POST request to your backend
     
      const response = await axios.post(
        `http://localhost:8080/post/${postId}/addcomment`,
        { text }, // Body data
        { withCredentials: true } // Include cookies for authentication
      );
  
      if (response.status === 201) {
        const { message, comment } = response.data;
       
  
        // Update comments in the UI
        const updatedPosts = posts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, comment] }
            : post
        );
        setPosts(updatedPosts);
        setNewComment({ ...newComment, [postId]: "" }); // Clear the input field
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(
        error.response?.data?.message || "An error occurred while adding the comment."
      );
    }
  };
  
  
  // Handle like/dislike action for posts
  const handleLikeDislike = async (postId, isLiked) => {
    try {
      const action = isLiked ? "dislike" : "like";
      const response = await axios.post(
        `http://localhost:8080/post/${postId}/${action}`,
        {},
        { withCredentials: true }
      );
      // Update the posts state to reflect the like/dislike
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: isLiked
                  ? post.likes.filter((likeId) => likeId !== currentUserId)
                  : [...post.likes, currentUserId],
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking/disliking the post:", error);
    }
  };

const toggleOptions = (postId) => {
  const optionsMenu = document.getElementById(`optionsMenu-${postId}`);
  if (optionsMenu) {
    optionsMenu.classList.toggle("show");
  }
};


  // Toggle comments visibility
  const toggleComments = (postId) => {
    const commentsBox = document.getElementById(`commentsBox-${postId}`);
    if (commentsBox.classList.contains('slide')) {
      commentsBox.classList.remove('slide');
    } else {
      commentsBox.classList.add('slide');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/post/delete/${postId}`, {
        withCredentials: true,
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  

  


  return (
    <main className="main-content" style={{ marginTop: "8vh" }}>
      {/* Create Post Section */}
      <div className="post-form">
        <form id="postForm" encType="multipart/form-data" onSubmit={handlePostSubmit}>
          <textarea
            id="postContent"
            name="content"
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <input type="file" id="postImage" name="image" style={{ display: "none" }} onChange={(e) => setPostImage(e.target.files[0])} />
          <div className="postting">
            <label htmlFor="postImage" className="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-camera" viewBox="0 0 16 16">
                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z" />
                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
              </svg>
            </label>
            <button type="submit" disabled={isUploading}>Post</button>
            {isUploading && <span>Uploading...</span>} {/* Show uploading text */}
          </div>
        </form>
      </div>

      {/* Posts Section */}
      {posts.map((post) => {
        const isLiked = post.likes?.includes(currentUserId); // Check if the current user liked the post
        const profilePictureSrc = post.author.profilePicture?.trim() || "/profile.jpg";
        const isFollowed = followedUsers.includes(post.author._id); //
   

        return (
<div className="post" key={post._id}>
  <div className="post-header">
    <img
      src={profilePictureSrc}
      alt="Author"
      className="author-image"
    />
    <div className="author-details">
      <h4 className="author-name">{post.author?.username || "Unknown User"}</h4>
      <p className="post-time">- {post.author?.university || "Unknown University"}</p>
    </div>
    {/* Dots menu shown for all posts */}
    <div className="dots-menu" onClick={() => toggleOptions(post._id)}>
  &#8230; {/* Three dots */}
  <div id={`optionsMenu-${post._id}`} className="options-menu">
    {/* Only show the "Delete" button for the logged-in user's post */}
    {post.author._id === currentUserId && (
      <button onClick={() => handleDeletePost(post._id)}>Delete</button>
    )}
    {/* Show Follow/Unfollow button only if it's not the logged-in user's post */}
    {post.author._id !== currentUserId && (
      <button onClick={() => handleFollowUnfollow(post.author._id)}>
        {isFollowed ? 'Unfollow' : 'Follow'}
      </button>
    )}
  </div>
</div>

  </div>
            <div className="post-content">
              <p className="post-caption">
                {post.caption || "No caption provided"}
                {post.hashtags?.length > 0 && (
                  <span className="hashtags">
                    {post.hashtags.map((hashtag) => `#${hashtag} `)}
                  </span>
                )}
              </p>
              <img src={post.image || "defaultImage.jpg"} alt="Post Content" className="post-image" />
            </div>

            <div className="post-actions">
              <span className="action-item comment-count" onClick={() => toggleComments(post._id)}>
                💬 {post.comments.length}
              </span>
              <span className="action-item">
                <span
                  className={`like-heart ${isLiked ? "liked" : ""}`}
                  onClick={() => handleLikeDislike(post._id, isLiked)}
                  style={{ cursor: "pointer" }}
                >
                  ❤️ {post.likes.length}
                </span>
              </span>
              <span className="action-item" onClick={() => handleToggleBookmark(post._id)}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill={post.bookmarked ? "blue" : "black"}
    className="bi bi-bookmark"
    viewBox="0 0 16 16"
    style={{ verticalAlign: "middle" }}
  >
    <path d="M2 2v13.5l6-3.5 6 3.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zm2 0h8a1 1 0 0 1 1 1v10.528l-5-2.916-5 2.916V3a1 1 0 0 1 1-1z" />
  </svg>
</span>

              
            
            </div>
          

            {/* Comments Box */}
            <div className="comments-box" id={`commentsBox-${post._id}`}>
  <div className="comment">
    {post.comments.map((comment, index) => (
      <p key={index} className="comment-item">
        <img
          className="author-image"
          src={comment.author.profilePicture || "profile.jpg"}
          alt={comment.author.username}
        />
        <strong>{comment.author.username}</strong>: {comment.text}
      </p>
    ))}
  </div>
  {/* Add Comment Section */}
  <div className="add-comment">
    <input
      type="text"
      className="comment-input"
      placeholder="Write a comment..."
      value={newComment[post._id] || ""}
      onChange={(e) => setNewComment({ ...newComment, [post._id]: e.target.value })}
    />
    <button className="comment-button" onClick={() => hcomment(post._id)}>
      Post
    </button>
  </div>
</div>


          </div>
        );
      })}
 <button className="top-button" >
        &#8593;
      </button>



    </main>
  );
}

export default MainContent;
