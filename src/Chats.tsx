import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import React from "react";
// import { cloneDeep } from 'lodash.clonedeep';
const cloneDeep = require("lodash.clonedeep");

const ALL_CHATS = gql`
  query allChats {
    getChats {
      id
      username
      message
    }
  }
`;

const CHATS_SUBSCRIPTION = gql`
  subscription OnNewChat {
    messageSent {
      id
      username
      message
    }
  }
`;

const Chats = () => {
  const { loading, error, data, subscribeToMore } = useQuery(ALL_CHATS, {fetchPolicy:"network-only", errorPolicy:"all"});

  useEffect(() => {
    subscribeToMore({
      document: CHATS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newChat = subscriptionData.data.messageSent;
        console.log(newChat);
        let chatReplies = cloneDeep(prev)

        const idAlreadyExists = chatReplies.getChats.filter((item: any) => {return item.id === newChat.id}).length > 0;


        if (!idAlreadyExists){
          chatReplies.getChats.unshift();
          return {
            // getChats: [...prev.getChats],
            getChats: [...prev.getChats, newChat],
          };
        }



        
      },
    });
  }, []);

  if (loading) return <p>"Loading...";</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  return (
    <div>
      {data.getChats.map((chat: any) => (
        <div key={chat.id}>
          <p>
            {chat.username}: {chat.message}:{chat.id}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Chats;