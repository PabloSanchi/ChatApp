import React from 'react';
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import getTargetEmail from '../utils/getTargetEmail';
import { auth, db } from '../components/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';

function Chat({ id, users }) {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const targetEmail = getTargetEmail(users, user);
    const [targetSnap] = useCollection(query(collection(db, 'users'), where('email', '==', targetEmail)));
    const target = targetSnap?.docs?.[0]?.data();

    const enterChat = () => {
        router.push(`/chat/${id}`);
    }
    return (
        <Container onClick={enterChat}>
            { target ? ( <UserAvatar src={target?.photoURL} /> ) : <UserAvatar>{targetEmail[0]}</UserAvatar> }
            <p>{targetEmail}</p>
        </Container>
    );
}

export default Chat;

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    word-break: break-word;

    color: whitesmoke;
    :hover {
        background-color: #465475
        //    background-color: whitesmoke;
    }

    background-color: #313A50
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;