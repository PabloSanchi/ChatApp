import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';

import getTargetEmail from '../../utils/getTargetEmail';
import { auth, db } from '../../components/firebase';
import { collection, doc, getDoc, getDocs, orderBy } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

function Chat({ chat, messages }) {
    const [user] = useAuthState(auth);
    return (
        <Container>
            <Head>
                <title>Chat with {getTargetEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    );
}

export default Chat;

// with context we get parameters such as the url...
export async function getServerSideProps(context) {

    var ref = doc(db, 'chats', context.query.id);
    // ref = getDoc(ref);
    // get messages on the server
    // const messages = await getDoc(ref, orderBy(context.query));


    // const messagesRef  = doc(db, 'chats', context.query.id);
    // const messages = query(messagesRef, orderBy('timestamp', 'asc'));
    // const querySnapshot = await getDocs(q);
    // console.log(ref);
    // var messagesRef = collection(db, 'chats', context.query.id, 'messages');
    const docu = await getDoc(ref);
    // console.log(docu);
    // const messagesRef = query(docu, orderBy('timestamp', 'asc'))

    // messagesRef = await getDoc(messages);
    // const messagesRef = await getDoc(query(ref, 'messages', orderBy('timestamp', 'asc')));
    const messageRef = await getDocs(collection(ref, 'messages'), orderBy('timestamp', 'asc'));

    const messages = messageRef.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })).map((messages) => ({
        ...messages,
        timestamp: messages.timestamp?.toDate().getTime(), // once we conver from the api and send it to the frontend we lose the timestamp
    }));

    // prepare the chat
    const chatRef = await getDoc(ref);
    const chat = {
        id: chatRef.id,
        ...chatRef.data(),
    };

    // console.log(chat, "mensajes: ", messages);

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }

};


const Container = styled.div`
    display: flex;
    flex-direction: column;

    // background-color: black;

    @media (min-width: 600px) { 
        flex-direction: row; 
        max-wdth: 800px;
    }
`;

const ChatContainer = styled.div`
    flex: 1; // we want it to be up front
    overflow: scroll;
    height: 100vh;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;
