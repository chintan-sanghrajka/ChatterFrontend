import React, { useState, useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import { unionBy } from 'lodash'
import { BASE_URL } from '../helper.js'
import axios from 'axios'
import UserComponent from './UserComponent.jsx'

const ChatPage = () => {

    const [ws, setWS] = useState(null)
    // const [onlinePeople, setOnlinePeople] = useState({})
    const [selectedUser, setSelectedUser] = useState(null)
    const user = JSON.parse(Cookies.get('ChatterUser'))
    const [newMessageText, setNewMessageText] = useState('')
    const [messages, setMessages] = useState([])
    const [showUsers, setShowUsers] = useState(false)

    const chatMsgDivRef = useRef(null);
    const scrollToBottom = () => {
        if (chatMsgDivRef.current) {
            chatMsgDivRef.current.scrollTop = chatMsgDivRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        connectToWS()
    }, [])

    const connectToWS = () => {
        const ws = new WebSocket(`wss://https://chatter-backend-theta.vercel.app/`);

        setWS(ws)

        // ws.addEventListener('open', () => {
        //     console.log('WebSocket connection opened');
        //     // setWS(ws);
        // });

        ws.addEventListener('message', handleMessage)
        ws.addEventListener('close', () => {
            setTimeout(() => {
                connectToWS()
            }, 1000)
        })
    }

    useEffect(() => {
        if (selectedUser !== null) {
            getChatMessages()
        }
    }, [selectedUser])

    const getChatMessages = async () => {
        await axios.post(`${BASE_URL}get-chat-messages`, {
            sender: user._id,
            recipient: selectedUser.userId,
        }).then((res) => {
            setMessages(res.data.chatMessages)
        }).catch((error) => console.log(error))
    }

    const getTime = () => {
        const messageTime = new Date();
        let messageHour = messageTime.getHours();
        let messageMinutes = messageTime.getMinutes();
        const ampm = messageHour >= 12 ? "PM" : "AM";
        messageHour = messageHour % 12 || 12;
        return `${messageHour}:${messageMinutes} ${ampm}`
    }

    const handleMessage = (event) => {
        const messageData = JSON.parse(event.data)
        if ('online' in messageData) {
        } else if ('text' in messageData) {
            console.log(messageData)
            setMessages(prev => ([...prev, { ...messageData, _id: messageData.messageId, time: getTime() }]))
        }
    }

    const sendMessage = () => {

        if (newMessageText !== '') {
            ws.send(JSON.stringify({
                message: {
                    recipient: selectedUser.userId,
                    text: newMessageText,
                    time: getTime(),
                }
            }))
            setMessages(prev => ([...prev, {
                text: newMessageText,
                sender: user._id,
                recipient: selectedUser.userId,
                _id: Date.now(),
                time: getTime(),
            }]))
            setNewMessageText('')
        }
    }

    const [messagesWithoutDuplicates, setMessagesWithoutDuplicates] = useState([])

    useEffect(() => {
        scrollToBottom()
        setMessagesWithoutDuplicates(unionBy(messages, '_id'))
    }, [messages])

    useEffect(() => {
        scrollToBottom()
    }, [messagesWithoutDuplicates])

    return (
        <>
            <div className='main_box'>
                <button className='button_filled user_button' onClick={() => setShowUsers(!showUsers)}><i className={showUsers === true ? "bi bi-x-lg" : "bi bi-person-fill"} style={{ fontSize: "20px" }}></i></button >
                <UserComponent props={{ selectedUser: selectedUser, setSelectedUser: setSelectedUser, showUsers: showUsers, setShowUsers: setShowUsers }} />
                <div className='chat_section'>

                    {selectedUser === null ? <div className='select_user_div'>
                        <p className='no_chatter_para'>Select User To Start Conversation</p>
                    </div> :
                        <>
                            <div className='chat_person_name_div'>
                                <h4 className='chat_person_name'>{selectedUser.userName}</h4>
                            </div>

                            <div className='chat_msg_div' ref={chatMsgDivRef}>
                                {
                                    messagesWithoutDuplicates.map((message, index) => {
                                        return <div key={index} className={message.sender === user._id ? 'sent_message_div' : 'received_message_div'}>
                                            <p className='message_text'>{message.text}</p>

                                            <p className={message.sender === user._id ? 'message_time text-end' : 'message_time'}>{message.time}</p>
                                        </div>
                                    })
                                }
                            </div>

                            <div className='chat_input_div'>
                                <input type="text" className='chat_input' placeholder='Enter Message...' value={newMessageText} onChange={(event) => { setNewMessageText(event.target.value) }
                                } />
                                <button className='button_filled' onClick={sendMessage}><i className="bi bi-send"></i></button>
                            </div>
                        </>
                    }
                </div >
            </div >
        </>
    )
}

export default ChatPage