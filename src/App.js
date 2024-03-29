import React, { useState, useEffect } from 'react';
import './App.css';

import Api from './Api';

import ChatListItem from './components/ChatListItem'
import ChatIntro from './components/ChatItro'
import ChatWindow from './components/ChatWindow'
import NewChat from './components/NewChat'
import Login from './components/Login'

import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import SearchIcon from '@material-ui/icons/Search';

export default () => {

    const [chatlist, setChatlist] = useState([]);
    const [activeChat, setActiveChat] = useState({})
    const [user, setUser] = useState(

        {
            id: 'CWsGz1VlSYVdxbMi5yd2TLUZ1E42',
            name: 'Saldanha',
            avatar: 'https://graph.facebook.com/123513136388086/picture'
        }

    )

    const [showNewChat, setShowNewChat] = useState(false)

    useEffect(() => {
        if (user !== null) {
            let unsub = Api.onChatList(user.id, setChatlist);
            return unsub;
        }
    }, [user]);

    const handleNewChat = () => {
        setShowNewChat(true)
    }

    const handleLoginData = async (u) => {
        let newUser = {
            id: u.uid,
            name: u.displayName,
            avatar: u.photoURL
        };
        await Api.addUser(newUser);
        setUser(newUser);
    }

    if (user === null) {
        return (<Login onReceive={handleLoginData} />)
    }

    return (

        <div className="app-window">

            <div className="sidebar">

                <NewChat
                    chatList={chatlist}
                    user={user}
                    show={showNewChat}
                    setShow={setShowNewChat}
                />

                <header>
                    <img className="header-avatar" src={user.avatar} alt="avatar" />
                    <div className="header-buttons">
                        <div className="header-btn">
                            <DonutLargeIcon style={{ color: '#919191' }} />
                        </div>

                        <div onClick={handleNewChat} className="header-btn">
                            <ChatIcon style={{ color: '#919191' }} />
                        </div>

                        <div className="header-btn">
                            <MoreVertIcon style={{ color: '#919191' }} />
                        </div>
                    </div>

                </header>


                <div className="search">
                    <div className="search-input">
                        <SearchIcon fontSize="small" style={{ color: '#919191' }} />
                        <input type="search" placeholder="Procurar ou começar uma noma conversa" />
                    </div>
                </div>

                <div className="chatlist">
                    {chatlist.map((item, key) => (
                        <ChatListItem
                            Key={key}
                            data={item}
                            active={activeChat.chatId === chatlist[key].chatId}
                            onClick={() => setActiveChat(chatlist[key])}
                        />
                    ))}
                </div>

            </div>
      
            <div className="contentarea">
                {activeChat.chatId !== undefined &&
                    <ChatWindow
                        user={user}
                        data={activeChat}
                    />
                }
                {activeChat.chatId === undefined &&
                    <ChatIntro />
                }

            </div>
        </div>
    );
}