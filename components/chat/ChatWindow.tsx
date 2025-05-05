// // app/components/chat/ChatWindow.tsx
// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import { Input, Button, Avatar, List, message } from 'antd';
// import { SendOutlined, MenuOutlined } from '@ant-design/icons';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/app/redux/store';
// import MessageBubble from './MessageBubble';
// import TypingIndicator from './TypingIndicator';
// import { socket } from '@/app/lib/socket';

// export default function ChatWindow({ conversation, onMenuClick }) {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [otherUserTyping, setOtherUserTyping] = useState(false);
//   const messagesEndRef = useRef(null);
//   const currentUser = useSelector((state: RootState) => state.user);
//   const otherUser = conversation?.participants?.find(
//     p => p._id !== currentUser._id
//   );

//   useEffect(() => {
//     if (!conversation) return;

//     const fetchMessages = async () => {
//       try {
//         const res = await fetch(`/api/messages?conversationId=${conversation._id}`);
//         const data = await res.json();
//         setMessages(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchMessages();

//     // Socket setup
//     socket.connect();
//     socket.emit('join', conversation._id);

//     socket.on('messageReceived', (message) => {
//       setMessages(prev => [...prev, message]);
//     });

//     socket.on('typing', ({ userId, isTyping }) => {
//       if (userId !== currentUser._id) {
//         setOtherUserTyping(isTyping);
//       }
//     });

//     return () => {
//       socket.off('messageReceived');
//       socket.off('typing');
//       socket.emit('leave', conversation._id);
//     };
//   }, [conversation, currentUser]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       const res = await fetch('/api/messages', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           conversationId: conversation._id,
//           text: newMessage,
//           sender: currentUser._id,
//         }),
//       });

//       const message = await res.json();
//       setMessages(prev => [...prev, message]);
//       setNewMessage('');
//       socket.emit('newMessage', message);
//     } catch (error) {
//       message.error('Failed to send message');
//     }
//   };

//   const handleTyping = (e) => {
//     setNewMessage(e.target.value);
//     if (!isTyping) {
//       setIsTyping(true);
//       socket.emit('typing', { 
//         conversationId: conversation._id, 
//         userId: currentUser._id, 
//         isTyping: true 
//       });
      
//       // Set timeout to stop typing indicator
//       setTimeout(() => {
//         setIsTyping(false);
//         socket.emit('typing', { 
//           conversationId: conversation._id, 
//           userId: currentUser._id, 
//           isTyping: false 
//         });
//       }, 2000);
//     }
//   };

//   if (!conversation) {
//     return (
//       <div className="flex items-center justify-center h-full text-gray-500">
//         Select a conversation to start chatting
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full">
//       <div className="p-3 border-b flex items-center">
//         <Button 
//           type="text" 
//           icon={<MenuOutlined />} 
//           onClick={onMenuClick}
//           className="md:hidden mr-2"
//         />
//         <div className="flex items-center">
//           <Avatar src={otherUser.avatar} />
//           <div className="ml-3">
//             <div className="font-semibold">{otherUser.name}</div>
//             {otherUserTyping && <TypingIndicator />}
//           </div>
//         </div>
//       </div>

//       <div className="flex-grow overflow-y-auto p-4">
//         <List
//           dataSource={messages}
//           renderItem={(msg) => (
//             <MessageBubble 
//               message={msg} 
//               isCurrentUser={msg.sender._id === currentUser._id} 
//             />
//           )}
//         />
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="p-3 border-t">
//         <Input.TextArea
//           value={newMessage}
//           onChange={handleTyping}
//           onPressEnter={(e) => {
//             if (!e.shiftKey) {
//               e.preventDefault();
//               handleSendMessage();
//             }
//           }}
//           placeholder="Type a message..."
//           autoSize={{ minRows: 1, maxRows: 4 }}
//           className="mb-2"
//         />
//         <Button
//           type="primary"
//           icon={<SendOutlined />}
//           onClick={handleSendMessage}
//           disabled={!newMessage.trim()}
//         >
//           Send
//         </Button>
//       </div>
//     </div>
//   );
// }