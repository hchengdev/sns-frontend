import React, { useEffect, useState } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';

const CometChatConversations = () => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // Lấy danh sách cuộc trò chuyện
    const fetchConversations = async () => {
      try {
        const limit = 30;
        const conversationList = await CometChat.getConversationList(limit);
        setConversations(conversationList);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <div>
      {conversations.map((conversation) => (
        <div key={conversation.conversationId}>
          {conversation.lastMessage.text}
        </div>
      ))}
    </div>
  );
};

export default CometChatConversations;
