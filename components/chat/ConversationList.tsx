// // app/components/chat/ConversationList.tsx
// 'use client';
// import { List, Avatar, Skeleton, Input } from 'antd';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/app/redux/store';
// import { socket } from '@/app/lib/socket';
// import OnlineStatus from './OnlineStatus';

// export default function ConversationList({ onSelect, selected }) {
//   const [conversations, setConversations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const currentUser = useSelector((state: RootState) => state.user);

//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const res = await fetch('/api/conversations');
//         const data = await res.json();
//         setConversations(data);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConversations();

//     // Socket setup
//     socket.connect();
//     socket.emit('online', currentUser._id);

//     socket.on('userOnline', (userId) => {
//       setOnlineUsers(prev => [...prev, userId]);
//     });

//     return () => {
//       socket.off('userOnline');
//       socket.disconnect();
//     };
//   }, [currentUser]);

//   return (
//     <div className="h-full overflow-y-auto">
//       <div className="p-3">
//         <Input.Search placeholder="Search conversations" />
//       </div>
//       <List
//         dataSource={conversations}
//         loading={loading}
//         renderItem={(conversation) => {
//           const otherUser = conversation.participants.find(
//             p => p._id !== currentUser._id
//           );
//           return (
//             <List.Item
//               onClick={() => onSelect(conversation)}
//               className={`cursor-pointer hover:bg-gray-100 ${
//                 selected?._id === conversation._id ? 'bg-blue-50' : ''
//               }`}
//             >
//               <List.Item.Meta
//                 avatar={
//                   <div className="relative">
//                     <Avatar src={otherUser.avatar} />
//                     <OnlineStatus 
//                       isOnline={onlineUsers.includes(otherUser._id)} 
//                       className="absolute bottom-0 right-0"
//                     />
//                   </div>
//                 }
//                 title={otherUser.name}
//                 description={conversation.lastMessage?.text || 'No messages yet'}
//               />
//             </List.Item>
//           );
//         }}
//       />
//     </div>
//   );
// }