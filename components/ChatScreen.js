import { React, useState, useRef } from 'react';
import styled from 'styled-components';
import { auth, db } from '../components/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';
import { collection, orderBy, setDoc, getDocs, doc, query, serverTimestamp, addDoc, where  } from 'firebase/firestore';
import Message from '../components/Message';
import getTargetEmail from '../utils/getTargetEmail';
import TimeAgo from 'timeago-react';

function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth);
    const goToTheEnd = useRef(null);
    const tEmail = getTargetEmail(chat.users, user);
    const [target] = useCollection(query(collection(db, 'users'), where("email", "==", tEmail)));

    const router = useRouter();

    const [input, setInput] = useState('');

    // const messageRef = await getDocs(collection(ref, 'messages'), orderBy('timestamp', 'asc'));
    const [messageSnap] = useCollection(
        query(collection(
            doc(db, 'chats', router.query.id),
            'messages'
        ), orderBy('timestamp', 'asc'))
    );


    const showMessages = () => {
        if (messageSnap) {
            return messageSnap.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map((message) => (
                <Message key={message.id} user={message.user} message={message} />
            ));
        }
    };

    const goDown = () => {
        goToTheEnd.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        await setDoc(doc(db, "users", user.uid), {lastSeen: serverTimestamp()}, { merge: true });
        const ref = collection( doc(db, 'chats', router.query.id), 'messages');

        await addDoc(ref, {
            timestamp: serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput('');
        goDown();
    };

    const fTarget = target?.docs?.[0]?.data()
    return (
        <Container>
            <Header>
                {
                    fTarget ? ( <Avatar src={fTarget.photoURL} /> ) : ( <Avatar /> )
                }
                <HeaderInformation>
                    <h3>{tEmail}</h3>
                    <p> last seen: {' '}
                        {
                            fTarget?.lastSeen?.toDate() ? (<TimeAgo datetime={fTarget?.lastSeen?.toDate()} />) : 'Unavailable'
                        }
                    </p>
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon style={{ fill: '#0072ea' }} />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon style={{ fill: '#0072ea' }}/>
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {/* show all messages */}
                {showMessages()}
                
                <EndOfMessage ref={goToTheEnd}/>
            </MessageContainer>

            <InputContainer >
                <IconButton>
                    <InsertEmoticonIcon style={{ fill: '#0072ea' }} />
                </IconButton>

                <Input placeholder={'type something'} value={input} onChange={(e) => setInput(e.target.value)}/>
                <button hidden disabled={!input} type="submit" 
                onClick={sendMessage}></button>

                <IconButton>
                    <MicIcon style={{ fill: '#0072ea' }} />
                </IconButton>

            </InputContainer>
        </Container>
    )
}

export default ChatScreen;

const Container = styled.div`
    height: 90%;
    max-height: 100vh;
`;

const Header = styled.div`
    position: sticky;
    // background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    border-bottom: 1px solid black;
    align-items: center;

    background-color: #131A2C;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        color: whitesmoke;
        margin-bottom: 3px;
    }
    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    // background-image: url("https://play-lh.googleusercontent.com/SZ97RCEv5EVH6iMCDIdHeGJM_BNyHYcnRQ4EdK4V_VyVxLlQS8GY1U3xB8atEBH55OM");
    // background-color: #e5ded8;
    background-color: #212E4F;
    min-height: 90vh;
    // max-height: 100vh;
    z-index: 100;
`;

const EndOfMessage = styled.div`
    
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;

    background-color: #131A2C;
`;

const Input = styled.input`
    flex: 1;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    // background-color: whitesmoke;
    background-color: #313A50;
    color: whitesmoke;
    margin-left: 15px;
    margin-right: 15px;
    border: none;
    border-radius: 1rem;
    border-color: #313A50;

    :focus {
        border-color: #313A50;
    }
`;