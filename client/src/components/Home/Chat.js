import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom'
import { LogoutOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Input, Space } from 'antd';
import { Modal } from 'antd';
import axios from 'axios';
import { io } from 'socket.io-client'
import { useAuth } from '../../context/Context';



function Chat() {
  const { URL, logout } = useAuth()
  const [sidebarVisibility, setSidebarVisibility] = useState('block');
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [typedMessage, setTypedMessage] = useState('')
  const [users, setUsers] = useState([])
  const [recUserAvatar, setRecUserAvatar] = useState('')
  const msgRef = useRef(null)



  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId

  const usernameLetters = user?.name.split(' ')
  const usernameAvatar = usernameLetters[0].charAt(0) + usernameLetters[1].charAt(0)

  const socket = useMemo(() => io('http://localhost:8080'), [])

  const handleLogout = () => {
    logout()
  }


  // useEffect(() => { setSocket(io('http://localhost:8080')) }, [])

  // useEffect(() => {
  //   socket?.emit('addUser', userId)

  // }, [socket])

  useEffect(() => {
    socket.on('connect', () => {

      socket.emit('addUser', userId)

      socket.on('getUsers', users => {
        // console.log(users)
      })

      try {
        socket.on('getMessage', data => {
          setMessages(prev => ({
            ...prev,
            messages: [...prev?.messages, { user: data.user, message: data.message }]
          }))
        })
      } catch (error) {
        console.log(error)
      }

    });

  }, [socket, userId])



  const handleSidebar = () => {
    sidebarVisibility === 'block' ? setSidebarVisibility('none') : setSidebarVisibility('block');
  }

  const handleMessageSubmit = async e => {
    e.preventDefault();
    const msgData = {
      message: typedMessage,
      senderId: userId,
      receiverId: messages?.receiver?.userId,
      conversationId: messages?.conversationId

    }
    socket?.emit('sendMessage', msgData)

    // console.log(messages)

    axios.post(`${URL}/chat/create-message`, msgData)
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => console.log(err));



    setTypedMessage('')

  }

  const items = [
    {
      label: (
        <>
          <span className='ms-1'>{user?.name}</span>
        </>
      ),
      key: '1',
    },
    {
      type: 'divider',
    },
    // {
    //   label: (
    //     <div className='text-blue-700'>
    //       <Link to={'/user'}><UserOutlined /><span className='ms-2'>My Profile</span></Link>
    //     </div>
    //   ),
    //   key: '2',
    // },
    {
      label: (
        <div className='text-red-600' onClick={handleLogout}>
          <LogoutOutlined />
          <span className='ms-2'>Logout</span>
        </div>
      ),
      key: '3',
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    axios.get(`${URL}/chat/conversation/${userId}`)
      .then(res => {
        if (res.status === 200) {
          setConversations(res.data)
        }
      })
      .catch(err => {
        console.log(err)
      })

  }, [messages?.messages])


  const loadMessages = async (conversationId, user) => {
    axios.get(`${URL}/chat//load-messages/${conversationId}`)
      .then((res) => {
        setMessages({ messages: res.data, receiver: user, conversationId })

        let recName = user?.name.split(' ')
        let recNameAvatar = recName[0].charAt(0) + recName[1].charAt(0)
        setRecUserAvatar(recNameAvatar)

      })
      .catch((err) => console.log(err))

    handleCancel()

  }

  useEffect(() => msgRef?.current?.scrollIntoView({ behavior: 'smooth' }), [messages?.messages])

  useEffect(() => {
    axios.get(`${URL}/user/get-all-users`)
      .then((res) => {
        setUsers(res.data)
      })
      .catch((err) => console.log(err))

  }, [])

  // console.log(messages.receiver)

  // useEffect(() => {
  //   const recName = messages?.receiver?.name.split(' ')
  //   let recAvatar = recName[0].charAt(0) + recName[1].charAt(0)
  //   setRecNameAvatar(recAvatar)

  // }, [messages?.receiver?.name])

  // useEffect(() => {
  //   let recName = messages?.receiver?.name.split(' ')
  //   // let recNameAvatar = recName[0].charAt(0) + recName[1].charAt(0)
  //   console.log(recName)

  // }, [messages?.receiver])



  return (
    <>
      <Modal title="Start a New Chat" open={isModalOpen} onCancel={handleCancel} footer={[]} >
        <Input className='px-3 my-2 lg:my-0' size="default" placeholder="Search here..." variant="filled" prefix={<SearchOutlined className='pe-3' />} />
        <div className='my-4 overflow-y-scroll max-h-[40vh]'>
          {
            users.length > 0
              ? <>
                {
                  users.map((user, i) => {
                    return (
                      <Link onClick={() => loadMessages('new', user.user)} key={i} className='flex justify-between border rounded px-3 py-1 m-1 cursor-pointer hover:bg-gray-100'>
                        <div>
                          <p className='text-base'>{user?.user?.name}</p>
                          <p className='text-slate-400 text-xs'>{user?.user?.number}</p>
                        </div>
                      </Link>
                    )
                  })
                }
              </>
              : <p className='text-xl text-center font-semibold'>No users</p>
          }
        </div>
      </Modal>
      <div className="flex h-screen w-full flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-950 md:px-6">
          <div className="flex items-center gap-4">
            <Link className="flex items-center gap-2" onClick={handleSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M17 6.1H3"></path>
                <path d="M21 12.1H3"></path>
                <path d="M15.1 18H3"></path>
              </svg>
              <span className="font-semibold hidden sm:flex">Chatter</span>
            </Link>
            <Input className='px-3 my-2 lg:my-0' size="default" placeholder="Search here..." variant="filled" prefix={<SearchOutlined className='pe-3' />} />
          </div>
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
          >
            <Link onClick={(e) => e.preventDefault()}>
              <Space className='ms-1 md:ms-0'>
                <div className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <span className="font-medium text-gray-600 dark:text-gray-300">{usernameAvatar}</span>
                </div>
              </Space>
            </Link>
          </Dropdown>
        </header>
        <div className="flex flex-1 flex-col md:flex-row">
          <div className="border-r bg-gray-100/40 dark:border-gray-800 dark:bg-gray-800/40 md:block">
            <div style={{ display: `${sidebarVisibility}` }} className="sidebar_self_made absolute left-0 z-20 flex h-full max-h-screen w-64 flex-col gap-2 overflow-hidden bg-[#FAFBFB] px-1 py-2 transition-transform duration-300 ease-in-out dark:bg-gray-800/40 md:relative md:z-auto md:block md:w-auto md:bg-transparent md:px-0 md:py-0 md:transition-none">
              <div className="flex h-[60px] items-center border-b px-2 md:px-6">
                <h3 className="text-lg font-semibold">Chats</h3>
                <button onClick={showModal} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground ml-auto h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                  <span className="sr-only">New chat</span>
                </button>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid gap-1 px-2 md:px-4 overflow-y-scroll max-h-[calc(100vh-124px)]">
                  {
                    conversations.length > 0
                      ?
                      conversations.map((con, i) => {
                        let conUser = con.user.name.split(' ')
                        let ConAvatarName = conUser[0].charAt(0) + conUser[1].charAt(0)
                        return (
                          <Link key={i}
                            className="border flex items-center gap-3 rounded-lg hover:bg-gray-100 px-3 py-2 text-gray-900 transition-all dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
                            onClick={() => loadMessages(con.conversationId, con.user)}
                          >
                            <span className="relative flex shrink-0 overflow-hidden rounded-full bg-gray-200 h-9 w-9">
                              <span className="flex h-full w-full items-center justify-center rounded-full text-sm bg-muted">{ConAvatarName}</span>
                            </span>
                            <div className="flex-1 truncate">
                              <div>{con.user.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{con.user.number}</div>
                            </div>
                            <div className="whitespace-nowrap border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs text-gray-50 dark:bg-gray-50 dark:text-gray-900">
                              3
                            </div>
                          </Link>
                        )
                      })

                      : <Link
                        className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
                        onClick={showModal}
                      >
                        <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                          <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">?</span>
                        </span>
                        <div className="flex-1 truncate">
                          <div className="font-medium">No Chats</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Start a New Chat Now</div>
                        </div>
                        <div className="whitespace-nowrap border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs text-gray-50 dark:bg-gray-50 dark:text-gray-900">

                        </div>
                      </Link>
                  }
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            {
              messages?.receiver
                ? <>
                  <div className="flex h-16 items-center justify-between border-b bg-white px-4 dark:border-gray-800 dark:bg-gray-950 md:px-6">
                    <div className="flex items-center gap-3">
                      <span className="relative flex shrink-0 overflow-hidden bg-gray-50 rounded-full h-9 w-9">
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">{recUserAvatar}</span>
                      </span>
                      <div className="grid gap-0.5">
                        <div className="font-medium">{messages?.receiver?.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Online</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span className="sr-only">Call</span>
                      </button>
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                          <rect x="2" y="6" width="14" height="12" rx="2"></rect>
                        </svg>
                        <span className="sr-only">Video call</span>
                      </button>
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <polyline points="18 8 22 12 18 16"></polyline>
                          <polyline points="6 8 2 12 6 16"></polyline>
                          <line x1="2" x2="22" y1="12" y2="12"></line>
                        </svg>
                        <span className="sr-only">More options</span>
                      </button>
                    </div>
                  </div>
                </>
                : ''
            }
            <div className="flex-1 overflow-auto p-4 md:p-6">
              <div className="grid gap-4 overflow-y-scroll max-h-[calc(100vh-220px)]">
                {
                  messages?.messages?.length > 0
                    ? messages?.messages?.map((msg, i) => {
                      if (msg.user.userId === userId) {
                        let sndUser = msg.user.name.split(' ')
                        let sndAvatarName = sndUser[0].charAt(0) + sndUser[1].charAt(0)
                        return (
                          <div key={i}>
                            <div className="flex items-start gap-3">
                              <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                                <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">{sndAvatarName}</span>
                              </span>
                              <div className="flex-1 space-y-2">
                                <div className="rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800 dark:text-gray-50">
                                  {msg.message}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">3:46 PM</div>
                              </div>
                            </div>
                            <div ref={msgRef}></div>
                          </div>
                        )
                      } else {
                        let recUser = msg.user.name.split(' ')
                        let recAvatarName = recUser[0].charAt(0) + recUser[1].charAt(0)
                        return (
                          <div key={i} className="flex items-start gap-3 justify-end">
                            <div className="flex-1 space-y-2">
                              <div className="rounded-lg bg-gray-900 p-3 text-sm text-gray-50 dark:bg-gray-50 dark:text-gray-900">
                                {msg.message}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">3:86 PM</div>
                            </div>
                            <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                              <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">{recAvatarName}</span>
                            </span>
                          </div>
                        )
                      }
                    })
                    :
                    <div className="flex-1 space-y-2">
                      <div className="p-3 text-lg text-center font-semibold dark:bg-gray-800 dark:text-gray-50">
                        Welcome to my Chat Application
                      </div>
                    </div>
                }

              </div>
            </div>

            <div className="border-t bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950 md:px-6">
              <form className="flex items-center gap-2" onSubmit={messages?.receiver?.name.length > 1 ? handleMessageSubmit : e => e.preventDefault()}>
                <input readOnly={messages?.receiver?.name.length > 1 ? false : true} value={typedMessage} onChange={e => setTypedMessage(e.target.value)}
                  className="flex h-10 w-full px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 rounded-md border border-gray-200 bg-gray-100 text-sm focus:border-gray-300 focus:bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50 dark:focus:border-gray-700"
                  placeholder="Type your message..."
                  type="text"
                />
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                  <span className="sr-only">Attach file</span>
                </button>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" x2="9.01" y1="9" y2="9"></line>
                    <line x1="15" x2="15.01" y1="9" y2="9"></line>
                  </svg>
                  <span className="sr-only">Add emoji</span>
                </button>
                <button disabled={typedMessage.length > 0 && messages?.receiver?.name.length > 1 ? false : true} type='submit' className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 p-3 text-gray-50 dark:bg-gray-50 dark:text-gray-900 text-primary-foreground hover:bg-primary/90 py-2 h-8 px-4">
                  Send
                </button>
                {/* <button disabled={!messages?.receiver?.name.length > 1 ? false : true} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 p-3 text-gray-50 dark:bg-gray-50 dark:text-gray-900 text-primary-foreground hover:bg-primary/90 py-2 h-8 px-4">
                  Send
                </button> */}
              </form>
            </div>

          </div>
        </div>
      </div >
    </>
  );
}

export default Chat;
