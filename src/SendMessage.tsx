import { useState, FC } from "react";
import { gql, useMutation } from "@apollo/client";
// import { ApolloClient } from "@apollo/client";
import React from "react";
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Grid from '@mui/joy/Grid';
import Box from '@mui/system/Box';

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
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid xs={10}>
          <Input
            color="primary"
            disabled={false}
            placeholder="Enter Message"
            size="md"
            variant="soft"
            onChange={(e) => setInput(e.target.value)}
            value={input}
            id="message"
          />
        </Grid>
        <Grid xs={2}>
          <Button variant="solid" onClick={handleSend}>Send Message</Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SendMessage;