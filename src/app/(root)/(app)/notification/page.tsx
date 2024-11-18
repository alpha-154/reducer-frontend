"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '@/slices/userSlice';
import { AppDispatch, RootState } from '@/lib/store';
import Notification from './_components/NotificationList';
import { fetchUserNotifications } from '@/api';


// Notification types
interface NotificationBase {
    name: string;
    image: string;
    date: string;
  }
  
  interface GroupNotification extends NotificationBase {
    groupName?: string;
  }
  
  interface Notifications {
    acceptedSentPrivateMessageRequest: NotificationBase[];
    declinedSentPrivateMessageRequest: NotificationBase[];
    acceptedSentGroupMessageRequest: GroupNotification[];
    declinedSentGroupMessageRequest: GroupNotification[];
    receivedPrivateMessageRequest: NotificationBase[];
    receivedGroupJoinRequestAsAdmin: GroupNotification[];
  }
  
  type INotification = Notifications;
  

  const NotificationPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { username } = useSelector((state: RootState) => state.user);
  
    useEffect(() => {
      dispatch(fetchUser());
    }, [dispatch]);
  
    const [notifications, setNotifications] = useState<INotification>({
      acceptedSentPrivateMessageRequest: [],
      declinedSentPrivateMessageRequest: [],
      acceptedSentGroupMessageRequest: [],
      declinedSentGroupMessageRequest: [],
      receivedPrivateMessageRequest: [],
      receivedGroupJoinRequestAsAdmin: []
    });
  
    useEffect(() => {
      const fetchNotifications = async () => {
        console.log("username", username);
        try {
          const response = await fetchUserNotifications(username);
          console.log("notifications", response.data.notifications);
          if (response.status === 200) {
            setNotifications(response.data.notifications);
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }
      };
      fetchNotifications();
    }, [username]);
  
    const getMessage = (type: string, name: string, groupName?: string) => {
      switch (type) {
        case 'acceptedSentPrivateMessageRequest':
          return `${name} has accepted your message request`;
        case 'declinedSentPrivateMessageRequest':
          return `${name} has declined your message request`;
        case 'acceptedSentGroupMessageRequest':
          return `${groupName} has accepted your joining request`;
        case 'declinedSentGroupMessageRequest':
          return `${groupName} has declined your joining request`;
        case 'receivedPrivateMessageRequest':
          return `${name} sent you a message request`;
        case 'receivedGroupJoinRequestAsAdmin':
          return `${name} has sent a joining request to ${groupName}`;
        default:
          return 'Notification message';
      }
    };

   
  
    return (
      <div className='container-max border border-colors-custom-orange rounded-xl px-6 py-8 md:py-10'>
        <h1 className='text-center text-3xl md:text-4xl text-colors-custom-orange'>Notifications</h1>
        <div className='max-w-3xl mt-10 flex flex-col gap-5 mx-auto '>
          {Object.entries(notifications).flatMap(([type, notifArray]) =>
            // Check if array is not empty before rendering notifications
            notifArray.length > 0 ? (
              notifArray.map((notification: any, index: number) => (
                <Notification
                  key={`${type}-${index}`}
                  currentUser={username}
                  name={notification.name}
                  profileImage={notification.image}
                  date={notification.date}
                  groupName={(notification as GroupNotification).groupName}
                  message={getMessage(type, notification.name, (notification as GroupNotification).groupName)}
                  type={type}
                  index={index}
                  // onDelete={handleDeleteNotification}
                />
              ))
            ) : null // Skip rendering if array is empty
          )}
        </div>
      </div>
    );
  };
  
  export default NotificationPage;