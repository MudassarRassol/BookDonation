// app/components/chat/ChatLayout.tsx
'use client';
import { useState, useEffect } from 'react';
import { Layout, Drawer } from 'antd';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import { useMediaQuery } from 'react-responsive';
const { Content } = Layout;

export default function ChatLayout() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <Layout className="h-screen">
      {!isMobile ? (
        <>
          <div className="w-80 border-r">
            <ConversationList 
              onSelect={setSelectedConversation} 
              selected={selectedConversation}
            />
          </div>
          <Content>
            <ChatWindow conversation={selectedConversation} />
          </Content>
        </>
      ) : (
        <>
          <Drawer
            title="Conversations"
            placement="left"
            open={drawerVisible}
            onClose={() => setDrawerVisible(false)}
            width="80%"
          >
            <ConversationList 
              onSelect={(conv) => {
                setSelectedConversation(conv);
                setDrawerVisible(false);
              }} 
              selected={selectedConversation}
            />
          </Drawer>
          <Content>
            <ChatWindow 
              conversation={selectedConversation}
              onMenuClick={() => setDrawerVisible(true)}
            />
          </Content>
        </>
      )}
    </Layout>
  );
}