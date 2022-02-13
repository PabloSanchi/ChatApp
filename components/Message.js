import React from 'react';
import styled from 'styled-components';
import { auth } from '../components/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment';

function Message({user, message}) {

  const [owner] = useAuthState(auth);
  const TypeOf = user === owner.email ? Send : Recv;

  return (
    <Contanier>
        <TypeOf>
          {message.message}
          <Timestamp>
            {message.timestamp ? moment(message.timestamp).format('LT') : '...' }
          </Timestamp>
          
        </TypeOf>
        
    </Contanier>
  );
}

export default Message;


const Contanier = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageElement = styled.div`
  width: fit-content;
  padding: 10px;
  background-color: whitesmoke;
  margin: 7px;
  min-width: 60px;
  position: relative;
  text-align: right;
`;


const Send = styled(MessageElement)`
  margin-left: auto;
  background-color: #8229B9;
  border-radius: 30px 0px 30px 30px;
  color: whitesmoke;
`;

const Recv = styled(MessageElement)`
  text-align: left;
  background-color: whitesmoke;
  border-radius: 0px 30px 30px 30px;
`;

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: relative;
  bottom: 0;
  text-align: right;
  right: 0;
`;