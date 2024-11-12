// _components/Notification.tsx
import axios from 'axios';
import React, { useEffect } from 'react';

interface NotificationProps {
  currentUser: string;
  name: string;
  image: string;
  date: string;
  groupName?: string;
  message: string;
  type: string; // Notification type
  index: number; // Notification index
  // onDelete: (type: string, index: number) => void; // Callback to remove from parent
}



const Notification: React.FC<NotificationProps> = ({currentUser, name, image, date, groupName, message, type, index }) => {

 const handleAcceptRequest = async () => {

    try {
      console.log("currentUser", currentUser, "requestedUser", name)
      const response = await axios.post("http://localhost:8000/api/user/accept-message-request", {
        currentUserUsername: currentUser,
        requestedUserUsername: name,
      })
      if(response.status === 200){
        alert(response.data.message)
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.")
    }
 }

 const handleRejectRequest = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/user/decline-private-message-request", {
        currentUser: currentUser,
        requestedUser: name,
      })
      if(response.status === 200){
        alert(response.data.message)
      }
    } catch (error) {
      alert("Something went wrong. Please try again later.")
    }
 }

 const handleDelete = async () => {
  try {
    const response = await axios.delete(`http://localhost:8000/api/notification/delete-user-notification/${currentUser}`, {
     data:{
      notificationType: type,
      notificationIndex: index,
     } 
    });
    if (response.status === 200) {
      alert(response.data.message);
      // onDelete(type, index);
    }
  } catch (error) {
    alert("Failed to delete notification.");
  }
};

const handleAcceptRequestAsJoinGroup = async () => {

  try {
    const response = await axios.post("http://localhost:8000/api/group/acceptGroupJoinRequest", {
      requestedUserName: name,
      groupName: groupName
      
    })
    if(response.status === 200){
      alert(response.data.message)
    }
  } catch (error) {
    alert("Something went wrong. Please try again later.")
  }
}
const handleDeclineRequestAsJoinGroup = async () => {

  try {
    const response = await axios.post("http://localhost:8000/api/group/declineGroupJoinRequest", {
      requestedUserName: name,
      groupName: groupName
      
    })
    if(response.status === 200){
      alert(response.data.message)
    }
  } catch (error) {
    alert("Something went wrong. Please try again later.")
  }
}


  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-center">
        <img src={image} alt="profileImage"  className="w-10 h-10 rounded-full mr-4" />
        <div>
          <p className="text-white font-semibold">{message}</p>
        </div>
      </div>
      { type.includes("receivedPrivate") && (
        <>
          <button onClick={handleAcceptRequest} className='bg-green-500 text-white px-2 py-1 rounded-full text-sm'>Accept Friend</button>
          <button onClick={handleRejectRequest} className='bg-red-500 text-white px-2 py-1 rounded-full text-sm'>Reject</button>
          </>
     )}
     {
        type.includes("receivedGroup") && (
          <>
          <button onClick={handleAcceptRequestAsJoinGroup} className='bg-green-500 text-white px-2 py-1 rounded-full text-sm'>Accept join</button>
          <button onClick={handleDeclineRequestAsJoinGroup} className='bg-red-500 text-white px-2 py-1 rounded-full text-sm'>Reject</button>
          </>
        )
     }
      
      <p className="text-gray-400 text-sm">{date}</p>
      <button onClick={handleDelete} className='font-bold text-red-500'>D</button>
    </div>
  );
};

export default Notification;