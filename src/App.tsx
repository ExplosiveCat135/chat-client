import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import Chats from "./Chats";
import SendMessage from "./SendMessage";
import { useState } from "react";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import React from "react";
import '@fontsource/inter';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Grid from '@mui/joy/Grid';
import Box from '@mui/system/Box';


// const wsLink = new WebSocketLink({
//   uri: "ws://localhost:8080/subscriptions",
//   options: {
//     reconnect: true,
//   },
// });

// const httpLink = new HttpLink({
//   uri: "http://localhost:8080/graphql",
//   credentials: "include",
// });

// const link = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   wsLink,
//   httpLink
// );

const httpLink = new HttpLink({
  uri: 'https://ec2-13-210-105-55.ap-southeast-2.compute.amazonaws.com/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'wss://ec2-13-210-105-55.ap-southeast-2.compute.amazonaws.com/graphql',
}));

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const App = () => {
  const [username, setUserName] = useState<string>("");
  const [entered, setEntered] = useState<boolean>(false);

  return (
    <ApolloProvider client={client}>
      <div className="App">
        {!entered && (
          <div>
            {/* <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            ></input> */}
            {/* center this box in middle of body*/}
            {/* <Box display="flex" alignItems="center" top="50%" margin-top="-50%" position="absolute" > */}
            <Box display="flex" justifyContent="center" alignItems="center" position="absolute" top="30%" left="35%"
              sx={{bgcolor: "#444444", margin: 5, borderRadius: 5, padding: 5, width: 300, height: 100}}
            >

              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid xs={8}>
                  <Input
                    color="primary"
                    disabled={false}
                    placeholder="Enter Username"
                    size="md"
                    variant="soft"
                    onChange={(e) => setUserName(e.target.value)}
                    value={username}
                    id="username"
                  />
                </Grid>
                {/* <button onClick={() => setEntered(true)}>Enter chat</button> */}
                <Grid xs={4}>
                  <Button variant="solid" onClick={() => setEntered(true)}>Enter Chat</Button>
                </Grid>
              </Grid>
            </Box>
          </div>
        )}

        {username !== "" && entered && (
          <div>
            <Chats />
            <SendMessage username={username}/>
          </div>
        )}
      </div>
    </ApolloProvider>
  );
};

export default App;