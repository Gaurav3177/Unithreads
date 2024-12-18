import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Community = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const navigate = useNavigate();

  const handleJoinCommunity = () => {
    setIsJoined(!isJoined);
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleLiveChatToggle = () => {
    setIsLiveChatOpen(!isLiveChatOpen);
  };

  return (
    <div style={{ backgroundColor: '#DAE0E6', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <nav style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '12px 24px',
        backgroundColor: 'white',
        borderBottom: '1px solid #edeff1',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Left Section */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          flex: '1',
          gap: '40px'
        }}>
          <h1 style={{ 
            margin: 0,
            color: '#1A1A1B',
            fontSize: '22px',
            fontWeight: '600'
          }}>Uni-Threads</h1>
          
          <div style={{
            position: 'relative',
            width: '400px'
          }}>
            <input 
              type="text" 
              placeholder="Search" 
              style={{
                width: '100%',
                padding: '8px 16px',
                paddingLeft: '40px',
                border: '1px solid #edeff1',
                borderRadius: '20px',
                backgroundColor: '#F6F7F8',
                fontSize: '14px'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#878A8C',
              fontSize: '14px'
            }}>🔍</span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <div style={{ 
          display: 'flex',
          gap: '32px',
          justifyContent: 'center',
          flex: '1'
        }}>
          <a href="/home" style={{ 
            color: '#7E3F8F',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>Home</a>
          <a href="/chats" style={{ 
            color: '#7E3F8F',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>Chats</a>
          <a href="/settings" style={{ 
            color: '#7E3F8F',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}>Settings</a>
        </div>

        {/* Right Section - Profile */}
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: '1',
          justifyContent: 'flex-end'
        }}>
          <img 
            src="profilePhoto.jpg" 
            alt="Profile" 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%',
              border: '1px solid #edeff1'
            }}
          />
          <span style={{ 
            color: '#1A1A1B',
            fontSize: '14px',
            fontWeight: '500'
          }}>gopalllkrishnaaa</span>
          <button style={{
            backgroundColor: '#0079D3',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '320px minmax(auto, 640px) 340px', 
        gap: '24px',
        padding: '20px 60px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
        msOverflowStyle: 'none',  // Hide scrollbar in IE/Edge
        scrollbarWidth: 'none',   // Hide scrollbar in Firefox
        '&::-webkit-scrollbar': { // Hide scrollbar in Chrome/Safari/Webkit
          display: 'none'
        }
      }}>
        {/* Left Sidebar - Added top margin */}
        <aside style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '20px',
          height: 'fit-content',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          position: 'fixed',
          width: '320px',
          top: '100px'  // Increased from 80px to 100px
        }}>
          {/* Profile Section */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '120px',
              height: '120px',
              margin: '0 auto',
              position: 'relative',
              borderRadius: '50%',
              overflow: 'hidden'
            }}>
              <img 
                src="profilePhoto.jpg" 
                alt="Profile Picture" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <h3 style={{ 
              margin: '12px 0 4px',
              fontSize: '18px',
              fontWeight: '500'
            }}>Gopal Krishna</h3>
            <p style={{ 
              margin: '0 0 16px',
              color: '#7c7c7c',
              fontSize: '14px'
            }}>@gopalllkrishnaaa</p>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-around',
              margin: '0 0 16px'
            }}>
              <div>
                <div style={{ fontWeight: '500' }}>250</div>
                <div style={{ fontSize: '12px', color: '#7c7c7c' }}>Posts</div>
              </div>
              <div>
                <div style={{ fontWeight: '500' }}>2022</div>
                <div style={{ fontSize: '12px', color: '#7c7c7c' }}>Followers</div>
              </div>
              <div>
                <div style={{ fontWeight: '500' }}>590</div>
                <div style={{ fontSize: '12px', color: '#7c7c7c' }}>Following</div>
              </div>
            </div>
            <button style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#0079D3',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              My Profile
            </button>
          </div>

          {/* Communities Section */}
          <div style={{ marginTop: '24px' }}>
            <p style={{ 
              margin: '0 0 12px',
              color: '#7c7c7c',
              fontSize: '12px',
              fontWeight: '500'
            }}>- COMMUNITIES</p>
            
            {/* Active Community */}
            <button style={{
              width: '100%',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              backgroundColor: '#F2F8FD',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '8px'
            }}>
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj_g610laomkJdWey7TUHRDQgWkhg2KwHP_w&s"
                alt="Chitkara Icon"
                style={{ width: '24px', height: '24px', borderRadius: '4px' }}
              />
              <span style={{ 
                fontSize: '14px',
                color: '#1c1c1c',
                textAlign: 'left',
                flex: 1
              }}>uni/chitkaraUniversity</span>
            </button>

            {/* Other Communities */}
            {[
              { name: 'uni/chandigarhUniversity', icon: 'cu.png' },
              { name: 'uni/amityUniversity', icon: 'amity.png' },
              { name: 'uni/punjabUniversity', icon: 'pu.png' }
            ].map((community, index) => (
              <button key={index} style={{
                width: '100%',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '8px'
              }}>
                <img 
                  src={community.icon}
                  alt={`${community.name} Icon`}
                  style={{ width: '24px', height: '24px', borderRadius: '4px' }}
                />
                <span style={{ 
                  fontSize: '14px',
                  color: '#1c1c1c',
                  textAlign: 'left',
                  flex: 1
                }}>{community.name}</span>
              </button>
            ))}

            <button style={{
              width: '100%',
              padding: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'left',
              color: '#7c7c7c',
              fontSize: '14px'
            }}>
              &nbsp;&nbsp;&nbsp;- other communities
            </button>
          </div>
        </aside>

        {/* Main Content - Centered properly */}
        <main style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          width: '640px',
          margin: '0 auto',
          gridColumn: '2 / 3',  // Explicitly place in second column
          position: 'relative'  // Add positioning context
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            overflow: 'hidden'
          }}>
            {/* Banner Image */}
            <div style={{ 
              height: '200px', 
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img 
                src="/chitkaraBanner.png" 
                alt="Banner"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Community Info */}
            <div style={{ padding: '16px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '16px' 
              }}>
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj_g610laomkJdWey7TUHRDQgWkhg2KwHP_w&s"
                  alt="Chitkara Logo"
                  style={{ 
                    width: '72px', 
                    height: '72px', 
                    borderRadius: '50%',
                    border: '4px solid white',
                    marginTop: '-40px',
                    position: 'relative',
                    zIndex: 10,
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(126, 63, 143, 0.08)',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <h1 style={{ 
                    margin: '0', 
                    fontSize: '24px',
                    fontWeight: '500'
                  }}>uni/chitkaraUniversity</h1>
                  <p style={{ 
                    color: '#7c7c7c',
                    margin: '8px 0',
                    fontSize: '14px'
                  }}>
                    Official community for Chitkara University students. Share experiences, ask questions, and connect with fellow Chitkarians!
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '24px',
                    marginTop: '12px',
                    fontSize: '14px',
                    color: '#7c7c7c'
                  }}>
                    <div>
                      <span style={{ fontWeight: '500', color: '#1c1c1c' }}>15.2k</span>
                      {' '}Members
                    </div>
                    <div>
                      <span style={{ fontWeight: '500', color: '#1c1c1c' }}>142</span>
                      {' '}Online
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px',
                    marginTop: '16px'
                  }}>
                    <button style={{
                      backgroundColor: '#0079D3',
                      color: 'white',
                      border: 'none',
                      padding: '8px 32px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      Join
                    </button>
                    <button style={{
                      backgroundColor: '#0079D3',
                      color: 'white',
                      border: 'none',
                      padding: '8px 32px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      Create Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Post Filters */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '12px',
            display: 'flex',
            gap: '8px'
          }}>
            <button style={{
              backgroundColor: '#F2F8FD',
              color: '#0079D3',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              New
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: '#7c7c7c',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Top
            </button>
          </div>

          {/* Posts Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* First Post */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '4px',
              padding: '10px',
              display: 'flex',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(126, 63, 143, 0.08)'
            }}>
              {/* Vote Section */}
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px',
                backgroundColor: '#F8F9FA',
                borderRadius: '4px',
                minWidth: '40px'
              }}>
                <button style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#878A8C',
                  fontSize: '16px',
                  padding: '0'
                }}>▲</button>
                <span style={{ 
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#1A1A1B',
                  margin: '4px 0'
                }}>1.2k</span>
                <button style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#878A8C',
                  fontSize: '16px',
                  padding: '0'
                }}>▼</button>
              </div>

              {/* Post Content */}
              <div style={{ flex: 1 }}>
                {/* Post Header */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '6px'
                }}>
                  <img 
                    src="user-avatar.jpg"
                    alt="" 
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%'
                    }}
                  />
                  <span style={{ 
                    color: '#787C7E',
                    fontSize: '12px'
                  }}>Posted by CSE_Student_2024 • 2 hours ago</span>
                  <span style={{
                    backgroundColor: '#E7F5FF',
                    color: '#0079D3',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>Academic</span>
                </div>

                {/* Post Title */}
                <h3 style={{ 
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1A1A1B'
                }}>Important Update: New Programming Lab Schedule for BTech CSE</h3>

                {/* Post Text */}
                <p style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  color: '#1A1A1B',
                  lineHeight: '1.5'
                }}>The programming lab schedule for BTech CSE has been updated for the upcoming semester...</p>

                {/* Post Actions */}
                <div style={{ 
                  display: 'flex',
                  gap: '4px'
                }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#878A8C',
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '2px'
                  }}>
                    <span>💬</span>
                    45 Comments
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#878A8C',
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '2px'
                  }}>
                    <span>↗️</span>
                    Share
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#878A8C',
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '2px'
                  }}>
                    <span>🔖</span>
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Second Post - Similar structure with different content */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '4px',
              padding: '10px',
              display: 'flex',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(126, 63, 143, 0.08)'
            }}>
              {/* Vote Section */}
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px',
                backgroundColor: '#F8F9FA',
                borderRadius: '4px',
                minWidth: '40px'
              }}>
                <button style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#878A8C',
                  fontSize: '16px',
                  padding: '0'
                }}>▲</button>
                <span style={{ 
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#1A1A1B',
                  margin: '4px 0'
                }}>856</span>
                <button style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#878A8C',
                  fontSize: '16px',
                  padding: '0'
                }}>▼</button>
              </div>

              {/* Post Content */}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '6px'
                }}>
                  <img 
                    src="club-avatar.jpg"
                    alt="" 
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%'
                    }}
                  />
                  <span style={{ 
                    color: '#787C7E',
                    fontSize: '12px'
                  }}>Posted by ChitkaraClub • 5 hours ago</span>
                  <span style={{
                    backgroundColor: '#FFE9E9',
                    color: '#FF4500',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>Event</span>
                </div>

                <h3 style={{ 
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1A1A1B'
                }}>Upcoming Hackathon: TechFest 2024</h3>

                <p style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  color: '#1A1A1B',
                  lineHeight: '1.5'
                }}>Get ready for the biggest hackathon of the year! Registration opens next week...</p>

                <div style={{ 
                  display: 'flex',
                  gap: '4px'
                }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#878A8C',
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '2px'
                  }}>
                    <span>💬</span>
                    32 Comments
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#878A8C',
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '2px'
                  }}>
                    <span>↗️</span>
                    Share
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#878A8C',
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '2px'
                  }}>
                    <span>🔖</span>
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Third Post */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '4px',
              padding: '10px',
              display: 'flex',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(126, 63, 143, 0.08)'
            }}>
              {/* Vote Section */}
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px',
                backgroundColor: '#F8F9FA',
                borderRadius: '4px',
                minWidth: '40px'
              }}>
                <button style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#878A8C',
                  fontSize: '16px',
                  padding: '0'
                }}>▲</button>
                <span style={{ 
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#1A1A1B',
                  margin: '4px 0'
                }}>734</span>
                <button style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#878A8C',
                  fontSize: '16px',
                  padding: '0'
                }}>▼</button>
              </div>

              {/* Post Content */}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '6px'
                }}>
                  <img 
                    src="placement-cell.jpg"
                    alt="" 
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%'
                    }}
                  />
                  <span style={{ 
                    color: '#787C7E',
                    fontSize: '12px'
                  }}>Posted by PlacementCell • 8 hours ago</span>
                  <span style={{
                    backgroundColor: '#E8F7E8',
                    color: '#0F9D58',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>Placement</span>
                </div>

                <h3 style={{ 
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1A1A1B'
                }}>Microsoft and Google Campus Recruitment Drive - Important Dates and Preparation Guidelines</h3>

                <p style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  color: '#1A1A1B',
                  lineHeight: '1.5'
                }}>We're excited to announce that Microsoft and Google will be conducting their campus recruitment drives next month. Here are the key dates and preparation resources to help you succeed...</p>

                <div style={{ 
                  display: 'flex',
                  gap: '4px'
                }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#878A8C',
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '2px'
                  }}>
                    <span>💬</span>
                    128 Comments
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#878A8C',
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '2px'
                  }}>
                    <span>↗️</span>
                    Share
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: '#878A8C',
                    fontSize: '12px',
                    padding: '8px',
                    borderRadius: '2px'
                  }}>
                    <span>🔖</span>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar with Live Chat */}
        <aside style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          height: 'fit-content',
          position: 'fixed',
          width: '340px',
          top: '100px',
          right: '60px'
        }}>
          {/* Live Chat Button */}
          <button 
            onClick={handleLiveChatToggle}
            style={{
              width: 'calc(100% - 32px)',
              padding: '8px',
              backgroundColor: '#0079D3',
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              fontWeight: 'bold',
              cursor: 'pointer',
              margin: '16px',
              position: 'relative',
              top: '-19px'
            }}
          >
            Live Chat
          </button>

          {/* Live Chat Section */}
          <div style={{
            position: 'absolute',
            top: '85px',
            left: '0px',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            padding: '20px',
            transform: isLiveChatOpen ? 'translateX(0)' : 'translateX(700px)',
            transition: 'transform 0.3s ease-in-out',
            zIndex: 10
          }}>
            {/* Add your live chat content here */}
            <h3>Live Chat</h3>
            <p>Chat content goes here...</p>
          </div>

          {/* Community Rules Box */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '500',
              color: '#1c1c1c'
            }}>Community Rules</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ 
                  fontWeight: '500',
                  color: '#1c1c1c',
                  minWidth: '15px'
                }}>1.</span>
                <p style={{ 
                  margin: 0,
                  fontSize: '14px',
                  color: '#1c1c1c',
                  lineHeight: '1.4'
                }}>Be respectful to fellow students and faculty</p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ 
                  fontWeight: '500',
                  color: '#1c1c1c',
                  minWidth: '15px'
                }}>2.</span>
                <p style={{ 
                  margin: 0,
                  fontSize: '14px',
                  color: '#1c1c1c',
                  lineHeight: '1.4'
                }}>No sharing of exam materials or cheating resources</p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ 
                  fontWeight: '500',
                  color: '#1c1c1c',
                  minWidth: '15px'
                }}>3.</span>
                <p style={{ 
                  margin: 0,
                  fontSize: '14px',
                  color: '#1c1c1c',
                  lineHeight: '1.4'
                }}>Keep discussions related to university life and academics</p>
              </div>
            </div>
          </div>

          {/* Similar Communities Box */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: '500'
            }}>Similar Communities</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { 
                  name: 'uni/chandigarhUniversity',
                  icon: 'cu.png'
                },
                { 
                  name: 'uni/punjabUniversity',
                  icon: 'pu.png'
                }
              ].map((community, index) => (
                <div key={index} style={{ 
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr 60px', // Fixed width columns
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <img 
                    src={community.icon}
                    alt={`${community.name} Icon`}
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '4px',
                      border: '1px solid #edeff1'
                    }}
                  />
                  <p style={{ 
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#1c1c1c',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{community.name}</p>
                  <button style={{
                    width: '60px', // Fixed width
                    height: '24px',
                    backgroundColor: '#0079D3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '0',
                    lineHeight: '24px'
                  }}>
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Community;
