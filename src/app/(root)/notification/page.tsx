"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserThunk } from "@/slices/userSlice";
import {
  seenNotificationThunk,
  updateUnseenNotifications,
} from "@/slices/notificationSlice";
import { AppDispatch, RootState } from "@/lib/store";
import Notification from "./_components/NotificationList";
import CustomSkeleton from "@/components/customComponents/CustomSkeleton";

const NotificationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { username } = useSelector((state: RootState) => state.user);
  //console.log("username -> app/notification/page.tsx ", username);
  const { notifications, unSeenNotifications, status, error } = useSelector(
    (state: RootState) => state.notification
  );

  //console.log("notifications -> app/notification/page.tsx ", notifications);

  useEffect(() => {
    dispatch(fetchUserThunk());
  }, [dispatch]);

  // Track if the component is unmounting
  const isUnmounting = useRef(false);

  //marking all the notifications as seen as soon as this `notification` components loads
  // & also updating the unReadNotification to 0
  // Dispatch seenNotificationThunk when the component unmounts
  useEffect(() => {
    if (username) {
      return () => {
        if (isUnmounting.current && unSeenNotifications !== 0) {
          dispatch(updateUnseenNotifications());
          dispatch(seenNotificationThunk({ currentUserUserName: username }));
        }
      };
    }
  }, [dispatch, username, unSeenNotifications]);

  // Set the unmounting flag in cleanup
  useEffect(() => {
    return () => {
      isUnmounting.current = true;
    };
  }, []);

  const getMessage = (type: string, name: string, groupName?: string) => {
    switch (type) {
      case "acceptedSentPrivateMessageRequest":
        return `${name} has accepted your message request`;
      case "declinedSentPrivateMessageRequest":
        return `${name} has declined your message request`;
      case "acceptedSentGroupMessageRequest":
        return `${groupName} has accepted your joining request`;
      case "declinedSentGroupMessageRequest":
        return `${groupName} has declined your joining request`;
      case "receivedPrivateMessageRequest":
        return `${name} sent you a message request`;
      case "receivedGroupJoinRequestAsAdmin":
        return `${name} has sent a joining request to ${groupName}`;
      default:
        return "Notification message";
    }
  };

  if (status === "failed") {
    return (
      <div className="container-max border border-burntSienna rounded-xl px-6 py-8 md:py-10">
        <h1 className="text-center text-2xl md:text-3xl text-colors-custom-orange">
          Notifications
        </h1>
        <div className="max-w-3xl mt-10 flex flex-col gap-5 mx-auto ">
          <p className="text-center text-colors-custom-orange">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-max bg-albasterInnerBg border border-burntSienna rounded-xl px-6 py-8 md:py-10">
      <h1 className="text-center text-2xl md:text-3xl text-darkbrownText">
        Notifications
      </h1>
      <div className="max-w-3xl mt-10 flex flex-col gap-5 mx-auto ">
        {status === "loading" ? (
          <CustomSkeleton numOfTimes={4} isChatSkeleton={false} />
        ) : (
          <>
            {unSeenNotifications === 0 ? (
              <p className="text-center text-md text-colors-custom-orange">
                No new notifications!
              </p>
            ) : (
              <>
                {Object.entries(notifications).flatMap(([type, notifArray]) =>
                  // Check if array is not not empty before rendering notifications

                  notifArray.length > 0
                    ? notifArray.map((notification: any) => (
                        <Notification
                          key={`${type}-${notification.index}`}
                          isSeen={notification.isSeen}
                          currentUser={username}
                          name={notification.name}
                          profileImage={notification.image}
                          date={notification.date}
                          groupName={notification.groupName}
                          message={getMessage(
                            type,
                            notification.name,
                            notification.groupName
                          )}
                          type={type}
                          index={notification.index}
                        />
                      ))
                    : null
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
