import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IoClose,
  IoTrashOutline,
  IoCheckmarkDoneOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import type { Notification } from "../utils/types/notifications";
import NotificationSkeleton from "./NotificationSkeleton";

interface NotificationsProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
}

export default function Notifications({
  isOpen,
  onClose,
  onUnreadCountChange,
}: NotificationsProps) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read,
  ).length;

  const loadNotifications = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        "id, recipient_id, actor_id, type, title, message, link, is_read, created_at",
      )
      .eq("recipient_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Load notifications error:", error);
      setError("Could not load notifications.");
      return;
    }

    setNotifications((data ?? []) as Notification[]);
    setError("");
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    let channel: ReturnType<typeof supabase.channel> | undefined;

    const initialize = async () => {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (userError || !user) {
        setNotifications([]);
        setError("Please log in to view notifications.");
        setLoading(false);
        return;
      }

      await loadNotifications(user.id);

      if (!active) return;

      channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `recipient_id=eq.${user.id}`,
          },
          () => {
            if (active) {
              void loadNotifications(user.id);
            }
          },
        )
        .subscribe((status) => {
          if (status === "CHANNEL_ERROR") {
            console.error("Notifications Realtime channel error.");
          }
        });

      if (active) {
        setLoading(false);
      }
    };

    void initialize();

    return () => {
      active = false;

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [isOpen, loadNotifications]);

  useEffect(() => {
  onUnreadCountChange(
    notifications.filter((notification) => !notification.is_read).length,
  );
}, [notifications, onUnreadCountChange]);
  

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Mark notification as read error:", error);
      setError("Could not mark notification as read.");
      return false;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification,
      ),
    );

    return true;
  };

  const deleteNotification = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error("Delete notification error:", error);
      setError("Could not delete notification.");
      return;
    }

    setNotifications((current) =>
      current.filter((notification) => notification.id !== notificationId),
    );
  };

  const handleNotificationClick = async (
    notification: Notification,
  ) => {
    if (!notification.is_read) {
      const success = await markAsRead(notification.id);

      if (!success) return;
    }

    onClose();

    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter((notification) => !notification.is_read)
      .map((notification) => notification.id);

    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (error) {
      console.error("Mark all notifications as read error:", error);
      setError("Could not update notifications.");
      return;
    }

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        is_read: true,
      })),
    );
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[90]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full z-[100] mt-3
              w-[360px] max-w-[calc(100vw-24px)]
              overflow-hidden rounded-2xl border
              border-gray-200 text-gray-900 shadow-xl
              dark:border-white/10 bg-[#EBFAFF] dark:bg-[#030A1B] dark:text-white"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-white/10">
              <div>
                <h2 className="text-[17px] font-semibold">
                  Notifications

                  {unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-[#228EE5] px-2 py-0.5 text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Stay up to date
                </p>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => void handleMarkAllAsRead()}
                    title="Mark all as read"
                    aria-label="Mark all notifications as read"
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#228EE5] dark:text-gray-400 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <IoCheckmarkDoneOutline className="text-xl" />
                  </button>
                )}

                <button
                  onClick={onClose}
                  title="Close notifications"
                  aria-label="Close notifications"
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 cursor-pointer"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>
            </div>

            <div className="notifications-scrollbar max-h-[320px] overflow-y-auto">
              {loading && <NotificationSkeleton />}

              {!loading && error && (
                <p className="px-5 py-8 text-center text-sm text-red-500">
                  {error}
                </p>
              )}

              {!loading && !error && notifications.length === 0 && (
                <div className="flex flex-col items-center px-5 py-10 text-center">
                  <IoNotificationsOutline className="mb-3 text-4xl text-gray-400" />

                  <p className="font-medium">
                    You're all caught up
                  </p>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    New notifications will appear here.
                  </p>
                </div>
              )}

              {!loading &&
                !error &&
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex gap-3 border-b border-gray-100 px-4 py-4 transition dark:border-white/5 ${
                      notification.is_read
                        ? "opacity-75"
                        : "bg-white/20 dark:bg-[#228EE5]/10"
                    }`}
                  >
                    <button
                      onClick={() =>
                        void handleNotificationClick(notification)
                      }
                      className="min-w-0 flex-1 cursor-pointer text-left"
                    >
                      <div className="flex items-start gap-2">
                        {!notification.is_read && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#228EE5]" />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">
                            {notification.title}
                          </p>

                          <p className="mt-1 break-words text-sm text-gray-600 dark:text-gray-300">
                            {notification.message}
                          </p>

                          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        void deleteNotification(notification.id)
                      }
                      title="Delete notification"
                      aria-label="Delete notification"
                      className="h-fit rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 cursor-pointer"
                    >
                      <IoTrashOutline className="text-lg" />
                    </button>
                  </div>
                ))}
            </div>

            <div className="border-t border-gray-200 px-5 py-3 dark:border-white/10">
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Showing up to 50 recent notifications
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}