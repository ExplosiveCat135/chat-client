import { useState, FC } from "react";
import { gql, useMutation } from "@apollo/client";
// import { ApolloClient } from "@apollo/client";
import React from "react";

const SEND_MESSAGE = gql`
  mutation createChat($username: String!, $message: String!) {
    createChat(username: $username, message: $message) {
      id
      username
      message
    }
  }
`;

interface SendMessageProps {
  username: string;
}

const SendMessage: FC<SendMessageProps> = ({ username }) => {
  const [input, setInput] = useState<string>("");
  const [sendMessage, { data }] = useMutation(SEND_MESSAGE);

  const handleSend = () => {
    sendMessage({ variables: { username: username, message: input } })
      .then((data) => {
        console.log(data);
        setInput("");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <input type="text" id="message" value={input} onChange={(e) => setInput(e.target.value)}></input>
      <button onClick={handleSend}>Send message</button>
    </div>
  );
};

export default SendMessage;