import React, { useState, useEffect ,useRef} from 'react';
import '../styles/mainscreen.css';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const RightSidebar = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Fetch user details and followed users
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/me', { withCredentials: true });
      setCurrentUserId(response.data.userId);

      const response2 = await axios.get('http://localhost:8080/user/getprofile', { withCredentials: true });
      setFollowedUsers(response2.data.user.following);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/notifications', { withCredentials: true });
      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch suggested users
  const fetchSuggestedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/suggested', { withCredentials: true });
      if (response.data && response.data.users) {
        setSuggestedUsers(response.data.users.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  // Fetch chat messages
  const fetchChatMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user/messages', { withCredentials: true });
      if (response.data && response.data.messages) {
        setChatMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    }
  };

  // Send new chat message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        'http://localhost:8080/user/messages',
        { text: newMessage },
        { withCredentials: true }
      );
      if (response.data && response.data.newMessage) {
        setChatMessages((prev) => [response.data.newMessage, ...prev]); // Add new message to the list
        setNewMessage(''); // Clear the input field
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchNotifications();
    fetchSuggestedUsers();
    fetchChatMessages();

    // Poll notifications and chat messages
    const notificationIntervalId = setInterval(fetchNotifications, 2000);
    const chatMessagesIntervalId = setInterval(fetchChatMessages, 1000);

    // Cleanup intervals
    return () => {
      clearInterval(notificationIntervalId);
      clearInterval(chatMessagesIntervalId);
    };
  }, []);

  const handleFollowUnfollow = async (targetUserId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setFollowedUsers((prev) =>
          prev.includes(targetUserId)
            ? prev.filter((id) => id !== targetUserId)
            : [...prev, targetUserId]
        );
        alert(followedUsers.includes(targetUserId) ? 'Unfollowed' : 'Followed');
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  const handleChatToggle = () => setIsChatOpen((prevState) => !prevState);

  return (
    <aside className="right-sidebar" style={{ marginTop: '8vh' }}>
<button
  id="liveChatButton"
  className="live-chat-button"
  onClick={handleChatToggle}
  style={{
    padding: '10px 20px',
    backgroundColor: '#007bff', // Changed to blue
    color: 'white',
    border: 'none',
    
    borderRadius: '30px', // Rounded edges
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  }}
>
  {isChatOpen ? 'Close Chat' : 'Live Chat'}
</button>

<div
  id="liveChatSection"
  className={`live-chat-section ${isChatOpen ? 'active' : ''}`}
  style={{
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    opacity: isChatOpen ? '1' : '0',
    visibility: isChatOpen ? 'visible' : 'hidden',
    transform: isChatOpen ? 'translateY(0)' : 'translateY(-20px)',
    maxHeight: isChatOpen ? '90%' : '0',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '90%',
  }}
>
  <h4 style={{ color: '#333', fontSize: '18px', marginBottom: '15px' }}>Live Chat</h4>
  <div
    className="chat-box"
    style={{
      flex: '1',
      // overflow: 'hidden',
      
      wordWrap: 'break-word', // Break long words
      wordBreak: 'break-word', // Ensure proper breaking for long text
      marginBottom: '10px',
      paddingRight: '10px',
    }}
  >
    <div className="messages">
      {chatMessages.map((message) => (
        <div key={message._id} className="message-item" style={{ display: 'flex', marginBottom: '10px' }}>
          <img
            src={message.sender.profilePicture || 'profile.jpg'}
            alt={message.sender.username}
            className="chat-profile-image"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              marginRight: '10px',
            }}
          />
          <div>
            <strong style={{ fontSize: '14px', color: '#333' }}>
              {message.sender.username}:
            </strong>
            <span style={{ margin: '5px 0', fontSize: '14px' }}>{message.text}</span>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  </div>
  <div
    className="message-input"
    style={{
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    }}
  >
    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          sendMessage(); // Send the message on Enter key press
        }
      }}
      placeholder="Type a message..."
      style={{
        flex: 1,
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '20px', // Rounded edges
        fontSize: '14px',
        marginRight: '10px',
      }}
    />
    <button
      onClick={sendMessage}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff', // Changed to blue
        color: 'white',
        border: 'none',
        borderRadius: '30px', // Rounded edges
        cursor: 'pointer',
        fontSize: '16px',
      }}
    >
      Send
    </button>
    
  </div>
</div>




      {/* Activity Section */}
      <div className="activity-section" style={{ marginTop: '1vh', height: '39vh' }}>
        <h4>Activity</h4>
        <div className="activity">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
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
                  {followedUsers.includes(notification.userID) ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            ))
          ) : (
            <p>No notifications</p>
          )}
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="suggestions-section" style={{ marginTop: '4vh', height: '36vh' }}>
        <h4>Suggested For You</h4>
        <div className="suggestions">
          {suggestedUsers.map((user, index) => (
            <div key={index} className="suggestion-item">
              <img src={user.profilePicture || 'profile.jpg'} alt="User" />
              <p>
                <strong>{user.username}</strong>
              </p>
              <button
                className="follow-button"
                onClick={() => handleFollowUnfollow(user._id)}
              >
                {followedUsers.includes(user._id) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
