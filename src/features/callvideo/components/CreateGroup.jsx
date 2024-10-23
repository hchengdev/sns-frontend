import { CometChatCreateGroup } from '@cometchat/chat-uikit-react';
import React from 'react';
import { createComponent } from '@lit-labs/react';

const CreateGroupDemo = () => {
  const CreateGroup = createComponent({
    tagName: 'cometchat-create-group',
    elementClass: CometChatCreateGroup,
    react: React,
  });

  return (
    <div className="flex h-screen items-center justify-center">
      <CreateGroup />
    </div>
  );
};

export default CreateGroupDemo;
