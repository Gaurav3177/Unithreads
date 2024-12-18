
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns'; // Importing the function to format time
import React, { useState, useEffect } from "react";

const PostItem = ({ post }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      style={{
        position: 'relative',
        aspectRatio: '1',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          filter: isHovered ? 'brightness(0.7)' : 'brightness(1)'
        }} 
        src={post.img} 
        alt={post.alt} 
      />
      
      {/* Hover Overlay */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          color: 'white',
          zIndex: 2,
          background: 'rgba(0, 0, 0, 0.3)'
        }}>
          {/* Likes */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <svg 
              aria-label="Like" 
              color="white" 
              fill="white" 
              height="24" 
              role="img" 
              viewBox="0 0 24 24" 
              width="24"
            >
              <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
            </svg>
            <span style={{ fontWeight: '600' }}>{post.likes || '0'}</span>
          </div>

          {/* Comments */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <svg 
              aria-label="Comment" 
              color="white" 
              fill="white" 
              height="24" 
              role="img" 
              viewBox="0 0 24 24" 
              width="24"
            >
              <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            <span style={{ fontWeight: '600' }}>{post.comments || '0'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const Profile = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = React.useState('posts');
  const [isCoverHovered, setIsCoverHovered] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState(null);
  const [followedUsers, setFollowedUsers] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [posts1, setPosts1] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [isEditingBio, setIsEditingBio] = React.useState(false); 
  const [newBio, setNewBio] = React.useState(userProfile?.bio || ''); 
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = React.useState(false);  // Track loading state
  const [coverLoading, setCoverLoading] = React.useState(false);  // Track loading state for cover image







  

  const toggleSavedPosts = (tab) => {
    setActiveTab(tab);
  };


  const savedPosts = [
    { img: "cu.png", alt: "Post 1", likes: 123, comments: 45 },
    { img: "pu.png", alt: "Post 2", likes: 89, comments: 32 },
  ];

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/me', {
        withCredentials: true,
      });
      setCurrentUserId(response.data.userId);

      const response2 = await axios.get('http://localhost:8080/user/getprofile', {
        withCredentials: true,
      });
      setFollowedUsers(response2.data.user.following);
      setUserProfile(response2.data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };
  const fetchSuggestedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/suggested', {
        withCredentials: true, // Include cookies in the request
      });
      if (response.data && response.data.users) {
        setSuggestedUsers(response.data.users.slice(0, 5)); // Limit to top 5 users
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/post/userpost/all", {
        withCredentials: true,
      });
      const userPosts = response.data.posts.map((post) => ({
        ...post,
        isCurrentUserPost: post.author._id === currentUserId, // Compare with current user's ID
      }));

      // Create posts1 array by extracting only the image URL and alt text
      const posts1Array = userPosts.map((post) => ({
        img: post.image, // Image URL
        alt: post.caption, // Caption as alt text
        likes: post.likes.length, // Number of likes
        comments: post.comments ? post.comments.length : 0, // Number of comments (if available)
      }));

      // Set the posts1 state
      setPosts1(posts1Array);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };
  const fetchBookmarkedPosts = async () => {
    try {
      // Fetching the user's bookmarked posts
      const response = await axios.get("http://localhost:8080/user/bookmarks", {
        withCredentials: true,  // Assuming you're using credentials for authentication
      });
  
      // Mapping the response data to add necessary info and flags
      const userBookmarkedPosts = response.data.bookmarkedPosts.map((post) => ({
        ...post,
        isCurrentUserPost: post.author._id === currentUserId,  // Check if the post is authored by the current user
      }));
  
      // Create an array for bookmarked posts, extracting the image URL, caption (alt text), likes, and comments
      const bookmarkedPostsArray = userBookmarkedPosts.map((post) => ({
        img: post.image,  // Image URL
        alt: post.caption,  // Caption as alt text
        likes: post.likes.length,  // Number of likes
        comments: post.comments ? post.comments.length : 0,  // Number of comments (if available)
      }));
  
      // Set the bookmarked posts in state
      setBookmarkedPosts(bookmarkedPostsArray);
    } catch (error) {
      console.error("Error fetching bookmarked posts:", error);
    }
  };
  
  // Call the function on component mount (or whenever you need to fetch the data)


  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/notifications', {
        withCredentials: true,
      });
      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Use useEffect to fetch data on component mount
  React.useEffect(() => {
    fetchUserDetails();
    fetchNotifications();
    fetchSuggestedUsers();
    fetchUserPosts();
    fetchBookmarkedPosts();
    const suggestedUsersIntervalId = setInterval(fetchSuggestedUsers, 60000);
    const intervalId = setInterval(() => {
      fetchUserDetails();
      fetchNotifications();
      fetchUserPosts();
      fetchBookmarkedPosts();
      
    }, 2000); // 2 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
    clearInterval(suggestedUsersIntervalId);
  }, []);


  const postsCount = userProfile?.posts?.length || 0;
  const followersCount = userProfile?.followers?.length || 0;
  const followingCount = userProfile?.following?.length || 0;




  
  const updateBio = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/user/editbio',
        { bio: newBio },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUserProfile((prevState) => ({ ...prevState, bio: newBio })); // Update user profile state with the new bio
        setIsEditingBio(false); // Close the bio edit form
      }
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };
  const handleProfilePictureChange = async (event) => {
    const formData = new FormData();
    formData.append('profilePicture', event.target.files[0]);
  
    setLoading(true);  // Set loading to true when upload starts
  
    try {
      const response = await axios.post('http://localhost:8080/user/editprofile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
  
      if (response.status === 200) {
        setUserProfile((prevState) => ({
          ...prevState,
          profilePicture: response.data.user.profilePicture, // Update the state with the new profile picture URL
        }));
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setLoading(false);  // Set loading to false after the upload completes
    }
  };
  const handleCoverImageChange = async (event) => {
    const formData = new FormData();
    formData.append('coverimage', event.target.files[0]);
  
    setCoverLoading(true);  // Set loading to true when upload starts
  
    try {
      const response = await axios.post('http://localhost:8080/user/editcover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
  
      if (response.status === 200) {
        setUserProfile((prevState) => ({
          ...prevState,
          coverimage: response.data.user.coverimage, // Update the state with the new cover image URL
        }));
      }
    } catch (error) {
      console.error("Error uploading cover image:", error);
    } finally {
      setCoverLoading(false);  // Set loading to false after the upload completes
    }
  };
  
  
  
  
  const handleFollowUnfollow = async (targetUserId) => {
    try {
      // Send a request to follow or unfollow the user
      const response = await axios.post(
        `http://localhost:8080/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        // Update the followedUsers state based on whether the user is already followed or not
        setFollowedUsers((prev) => {
          if (prev.includes(targetUserId)) {
            return prev.filter((id) => id !== targetUserId); // Unfollowed, so remove from list
          } else {
            return [...prev, targetUserId]; // Followed, so add to list
          }
        });
  
        // Show alert based on the action (follow or unfollow)
        if (followedUsers.includes(targetUserId)) {
          alert("You have unfollowed this user!");
        } else {
          alert("You are now following this user!");
        }
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      alert("There was an error with the follow/unfollow action.");
    }
  };
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 1fr',
      gap: '20px',
      width: '90%',
      maxWidth: '1600px',
      minHeight: '100vh',
      boxSizing: 'border-box',
      margin: '20px auto',
      fontFamily: 'Poppins, sans-serif'
    }}>
       {/* Activity Section with Notifications */}
       <div className="activity-section" style={{ marginTop: '1vh', height: '35vh' }}>
        <h4>Activity</h4>
        <div className="activity">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => {
              const isFollowed = followedUsers.includes(notification.userID);
              return (
                <div key={index} className="activity-item">
                  <img
                    src={notification.profile || 'profile.jpg'}
                    alt="User"
                    className="notification-profile-image"
                  />
                  <div className="notification-details">
                    <p>{notification.message}</p>
                    <p className="time-ago">
                      {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                  <button
                    className="follow-button"
                    onClick={() => handleFollowUnfollow(notification.userID)}
                  >
                    {isFollowed ? 'Unfollow' : 'Follow'}
                  </button>
                </div>
              );
            })
          ) : (
            <p>No notifications</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(128, 0, 128, 0.5)',
        overflowY: 'auto',
        height: 'calc(150vh - 40px)'
      }}>
        <div style={{ width: '100%', height: '15vh', borderRadius: '0', overflow: 'hidden', position: 'relative' }}>
  <img
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'filter 0.3s ease-in-out',
      filter: isCoverHovered ? 'brightness(0.7)' : 'brightness(1)',
      cursor: 'pointer',
    }}
    src={userProfile?.coverimage?.trim() || "/coverphoto.jpg"}
    alt="Cover Photo"
    onMouseEnter={() => setIsCoverHovered(true)}
    onMouseLeave={() => setIsCoverHovered(false)}
  />

  {isCoverHovered && !coverLoading && (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        zIndex: 2,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
      </svg>
    </div>
  )}

  {/* Display loading message or spinner when uploading */}
  {coverLoading && (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        zIndex: 2,
      }}
    >
      Uploading...
    </div>
  )}

  {/* File Input for Cover Image */}
  <input
    type="file"
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0, // Make the input invisible but still clickable
      cursor: 'pointer',
    }}
    onChange={handleCoverImageChange}
  />
</div>

        <div style={{
          position: 'relative',
          padding: '30px 20px',
          borderBottom: '1px solid #dbdbdb',
          marginTop: '20px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(128, 0, 128, 0.5)',
          transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
          height:"40vh"
        }}>
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid white',
            top: '-60px',
            left: '20px',
            backgroundColor: 'white'
          }}>
<div style={{ position: 'relative', width: '100%', height: '100%' }}>
  <img
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'filter 0.3s ease-in-out',
      cursor: 'pointer',
      filter: isHovered ? 'brightness(0.7)' : 'brightness(1)',
    }}
    src={userProfile?.profilePicture || "/profile.jpg"}
    alt="Profile Photo"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  />
  
  {isHovered && !loading && (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        zIndex: 2,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z" />
      </svg>
    </div>
  )}
  
  {/* Display loading message or spinner when uploading */}
  {loading && (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        zIndex: 2,
      }}
    >
      Uploading...
    </div>
  )}

  {/* File Input for Upload */}
  <input
    type="file"
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0, // Make the input invisible but still clickable
      cursor: 'pointer',
    }}
    onChange={handleProfilePictureChange}
  />
</div>


          </div>
          <div style={{
            marginLeft: '150px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '400',
                color: '#262626',
                animation: 'moveText 12s linear forwards'
              }}>{userProfile?.username}</h2>
          
            
            </div>

            <div style={{
              display: 'flex',
              gap: '40px'
            }}>
              <div style={{
                fontSize: '16px',
                color: '#262626',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                padding: '10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}><span>{postsCount}</span> posts</div>
              <div style={{
                fontSize: '16px',
                color: '#262626',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                padding: '10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}><span>{followersCount}</span> followers</div>
              <div style={{
                fontSize: '16px',
                color: '#262626',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                padding: '10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}><span>{followingCount}</span> following</div>
            </div>

            <div>
      {/* Button to trigger bio edit */}
      <button
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '5px',
          display: 'flex',
          alignItems: 'center',
          opacity: '0.7',
          transition: 'opacity 0.2s ease-in-out',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
        onClick={() => setIsEditingBio(true)} // Open edit form
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
        </svg>
      </button>

      {/* Display bio and edit option */}
      <div>
        <p>{userProfile?.bio}</p>
        {isEditingBio && (
          <div>
            <textarea
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)} // Update new bio
              placeholder="Update your bio"
            />
            <button onClick={updateBio}>Save Bio</button>
            <button onClick={() => setIsEditingBio(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
          </div>
        </div>

        {/* Posts/Saved Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          borderTop: '1px solid #dbdbdb',
          marginTop: '10px'
        }}>
          <button 
            onClick={() => toggleSavedPosts('posts')} 
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'posts' ? '#000' : '#8e8e8e',
              fontSize: '14px',
              padding: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              borderTop: activeTab === 'posts' ? '1px solid #262626' : 'none'
            }}
          >
            <svg aria-label="Posts" color={activeTab === 'posts' ? "rgb(0, 0, 0)" : "rgb(142, 142, 142)"} fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
              <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
              <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
            </svg>
            POSTS
          </button>
          <button 
            onClick={() => toggleSavedPosts('saved')} 
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'saved' ? '#000' : '#8e8e8e',
              fontSize: '14px',
              padding: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              borderTop: activeTab === 'saved' ? '1px solid #262626' : 'none'
            }}
          >
            <svg aria-label="Saved" color={activeTab === 'saved' ? "rgb(0, 0, 0)" : "rgb(142, 142, 142)"} fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12">
              <polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
            </svg>
            SAVED
          </button>
        </div>

        {/* Container for both posts sections */}
        <div style={{
          overflow: 'hidden',  // Contains the sliding content
          width: '100%',
          position: 'relative'
        }}>
          {/* Sliding wrapper */}
          <div style={{
            display: 'flex',
            width: '200%',  // Double width to hold both sections
            transition: 'transform 0.3s ease-in-out',
            transform: `translateX(${activeTab === 'saved' ? '-50%' : '0'})`
          }}>
            {/* Regular Posts Grid */}
            <div style={{
              width: '100%',  // Takes up half of the wrapper
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2px',
              padding: '15px',
              marginTop: '20px',
            }}>
              {posts1.map((post, index) => (
                <PostItem key={index} post={post} />
              ))}
            </div>

            {/* Saved Posts Grid */}
            <div style={{
              width: '100%',  // Takes up half of the wrapper
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2px',
              padding: '15px',
              marginTop: '20px',
            }}>
              {bookmarkedPosts.map((post, index) => (
                <PostItem key={index} post={post} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <div className="suggestions-section" style={{ marginTop: '3vh', height: '41vh' }}>
        <h4>Suggested For You</h4>
        <div className="suggestions">
          {suggestedUsers.map((user, index) => {
            const isFollowed = followedUsers.includes(user._id); // Check if user is followed
            return (
              <div key={index} className="suggestion-item">
                <img src={user.profilePicture || 'profile.jpg'} alt="User" />
                <p>
                  <strong>{user.username}</strong>
                </p>
                <button
                  className="follow-button"
                  onClick={() => handleFollowUnfollow(user._id)}
                >
                  {isFollowed ? 'Unfollow' : 'Follow'} {/* Toggle between Follow and Unfollow */}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;