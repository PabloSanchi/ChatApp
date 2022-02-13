import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components'
import { Avatar, IconButton, Button } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator';
import { signOut } from 'firebase/auth';
import { auth, db } from '../components/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from '../components/Chat';

function Sidebar() {

    const [user] = useAuthState(auth);
    const userChatReff = query(collection(db, 'chats'), where('users', 'array-contains', user.email));
    const [chatsSnapshot] = useCollection(userChatReff);
    const router = useRouter();

    const alreadyExists = async (target) => {
        const userChatRef = query(collection(db, 'chats'), where('users', 'array-contains', user.email));
        const snap = await getDocs(userChatRef);
        var res = false;
        snap.forEach((doc) => {
            if( doc.data().users.find((user) => user === target)) {
                res = true;
            }
        });
        return res;
    };

    const createChat = async () => {
        const input = prompt('Enter an email address to start a conversation');
        if(!input) return null;
        const res = await alreadyExists(input);
        if(EmailValidator.validate(input)  && !res && input !== user.email  ) {
            await addDoc(collection(db, 'chats'), {
                users: [user.email, input],
            });
        }else {
            alert("Colud not create chat");
        }
    };

    const handleSignOut = () => {
        router.push('/');
        signOut(auth);
    };

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={handleSignOut} />
                {user.email}
                <IconsContainer>
                    <IconButton>
                        <ChatIcon style={{ fill: '#0072ea' }}/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon style={{ fill: '#0072ea' }} />
                    </IconButton>
                </IconsContainer>
            </Header>

            <Search>
                <SearchIcon style={{ fill: '#0072ea' }}/>
                <SearchInput placeholder="Search or start new chat" />
            </Search>

            <SidebarButton onClick={createChat}>Start new chat</SidebarButton>


            {/* list of chats */}
            {chatsSnapshot?.docs.map(chat => (
                <Chat key={(chat.id)} id={chat.id} users={chat.data().users} />
            ))}
        </Container>
    );
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    // max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;

    background-color: #131A2C;
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid black;

    color: whitesmoke;
    background-color: #131A2C;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;


const IconsContainer = styled.div`

`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    // background-color: black;
    background-color: #313A50;
    border-radius: 1rem;
    margin: 5px;
    padding: 5px;
    color: white;
    outline-width: 0;
    border: none;
    flex: 1; // user entire width
`;

const SidebarButton = styled(Button)`
    width: 100%;  
    &&& {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
    };
`;