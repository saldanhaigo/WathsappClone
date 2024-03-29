import React, { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './ChatWindow.css'

import Api from '../Api'

import MessageItem from './MessageItem'

import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';


export default ({ user, data }) => {

    const body = useRef();

    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition !== undefined) {
        recognition = new SpeechRecognition();
    }


    const [emojiOpen, setEmojiOpen] = useState(false);
    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);
    const [list, setList] = useState([]);

    
    useEffect(() => {

        setList([]);
        let unsub = Api.onChatContent(data.chatId, setList);
        return unsub;
 
    }, [data.chatId]);


    useEffect(() => {

        if (body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }

    }, [list]);

    const handleEmojiClick = (e, emojiObject) => {
        setText(text + emojiObject.emoji)
    }

    const handleOpenEmoji = () => {
        setEmojiOpen(true);
    }

    const handleCloseEmoji = () => {
        setEmojiOpen(false)
    }

    const handleMicClick = () => {
        if (recognition !== null) {

            recognition.onstart = () => {
                setListening(true);
            }

            recognition.onend = () => {
                setListening(false);
            }

            recognition.onresult = (e) => {
                setText(e.results[0][0].transcript);
            }

            recognition.start();
        }
    }

    const handleInputKeyUp = (e) => {
        if (e.keyCode == 13) {
            handleSendClick();
        }
    }
    const handleSendClick = () => {
        if (text !== '') {

            Api.sendMessage(data, user.Id, 'text', text);
            setText('');
            setEmojiOpen(false);

        }


    }

    return (
        <div className="chatWindow">

            <div className="chatWindow-header">

                <div className="chatWindow-headerInfo">
                    <img className="chatWindow-header-avatar" src={data.image} alt="" />
                    <div className="chatWindow-header-name">{data.title} - {data.chatId}</div>
                </div>

                <div className="chatWindow-headerButtons">

                    <div className="chatWindow-bnt">
                        <SearchIcon style={{ color: '#919191' }} />
                    </div>

                    <div className="chatWindow-bnt">
                        <AttachFileIcon style={{ color: '#919191' }} />
                    </div>

                    <div className="chatWindow-bnt">
                        <MoreVertIcon style={{ color: '#919191' }} />
                    </div>
                </div>

            </div>

            <div ref={body} className="chatWindow-body">
                {list.map((item, key) => (
                    <MessageItem
                        key={key}
                        data={item}
                        user={user}
                    />

                ))}
    
            </div>

            <div className="chatWindow-emojiarea"
                style={{ height: emojiOpen ? '200px' : '0px' }}>
                <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    disableSearchBar
                    disableSkinTonePicker
                />
            </div>

            <div className="chatWindow-footer">

                <div className="chatWindow-pre">

                    <div
                        className="chatWindow-bnt"
                        onClick={handleCloseEmoji}
                        style={{ width: emojiOpen ? 40 : 0 }}
                    >
                        <CloseIcon style={{ color: '#919191' }} />
                    </div>

                    <div

                        className="chatWindow-bnt"
                        onClick={handleOpenEmoji}
                    >
                        <InsertEmoticonIcon style={{ color: emojiOpen ? '#009688' : '#919191' }} />
                    </div>

                </div>

                <div className="chatWindow-inputarea">
                    <input
                        className="chatWindow-input"
                        type="text"
                        placeholder="Digite uma mensagen"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyUp={handleInputKeyUp}

                    />
                </div>

                <div className="chatWindow-pos">

                    {text === '' &&
                        <div onClick={handleMicClick} className="chatWindow-bnt">
                            <MicIcon style={{ color: listening ? '#126ece' : '#919191' }} />
                        </div>

                    }
                    {text !== '' &&
                        <div onClick={handleSendClick} className="chatWindow-bnt">
                            <SendIcon style={{ color: '#919191' }} />
                        </div>
                    }
                </div>

            </div>

        </div>
    );
}