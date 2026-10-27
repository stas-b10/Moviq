export type NotificationType =
  | "friend_request"
  | "friend_request_accepted"
  | "new_message"
  | "new_login"
  | "signup"
  | "movie_activity"
  | "account_alert";

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}
