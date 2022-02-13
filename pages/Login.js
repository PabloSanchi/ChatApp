import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { auth, provider, signInWithPopup } from '../components/firebase';

function Login() {

    const signIn = () => {
        signInWithPopup(auth, provider).catch(alert);
    };

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo
                    src="https://cdn-icons-png.flaticon.com/512/159/159778.png"
                />
                <Button onClick={signIn} variant="contained" color="error" >Sign in with google</Button>
            </LoginContainer>
        </Container>
    );
}

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;

const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
`;

const Logo = styled.img`
    width: 200px;
    height: 200px;
    margin-bottom: 50px;
`;