export interface Reminder {
  reminder_ai_text: string;
  reminder_created_at: string;
  reminder_notify_minutes: number;
  reminder_on_datetime: string;
  reminder_text: string;
  user_notified: boolean;
}

export interface RemindersData {
  reminders: {
    [id: string]: Reminder;
  };
  status: string;
  token: string;
}
