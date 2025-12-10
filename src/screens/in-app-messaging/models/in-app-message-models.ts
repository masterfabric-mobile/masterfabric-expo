export type InAppMessageStyle = 'modal' | 'banner' | 'card';
export type InAppMessagePosition = 'top' | 'bottom' | 'center';
export type InAppMessageActionType = 'url' | 'deep_link' | 'dismiss';
export type InAppMessageTargetAudience = 'all' | 'authenticated' | 'unauthenticated';

/**
 * Database row structure for in_app_messages table
 */
export interface InAppMessageRow {
  id: number;
  title: string;
  message: string;
  image_url: string | null;
  button_text: string | null;
  button_action: string | null;
  button_action_type: InAppMessageActionType;
  button2_text: string | null;
  button2_action: string | null;
  button2_action_type: InAppMessageActionType;
  position: InAppMessagePosition;
  style: InAppMessageStyle;
  background_color: string | null;
  text_color: string | null;
  button_background_color: string | null;
  button_text_color: string | null;
  button2_background_color: string | null;
  button2_text_color: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  priority: number;
  target_audience: InAppMessageTargetAudience;
  language: string;
  created_at: string;
  updated_at: string;
}

/**
 * Database row structure for in_app_message_dismissals table
 */
export interface InAppMessageDismissalRow {
  id: number;
  message_id: number;
  user_id: string | null;
  device_id: string | null;
  dismissed_at: string;
}

/**
 * Application model for in-app messages
 */
export interface InAppMessage {
  id: string;
  title: string;
  message: string;
  imageUrl: string | null;
  buttonText: string | null;
  buttonAction: string | null;
  buttonActionType: InAppMessageActionType;
  button2Text: string | null;
  button2Action: string | null;
  button2ActionType: InAppMessageActionType;
  position: InAppMessagePosition;
  style: InAppMessageStyle;
  backgroundColor: string | null;
  textColor: string | null;
  buttonBackgroundColor: string | null;
  buttonTextColor: string | null;
  button2BackgroundColor: string | null;
  button2TextColor: string | null;
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  priority: number;
  targetAudience: InAppMessageTargetAudience;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Convert database row to application model
 */
export function inAppMessageRowToItem(row: InAppMessageRow): InAppMessage {
  return {
    id: String(row.id),
    title: row.title,
    message: row.message,
    imageUrl: row.image_url,
    buttonText: row.button_text,
    buttonAction: row.button_action,
    buttonActionType: row.button_action_type,
    button2Text: row.button2_text || null,
    button2Action: row.button2_action || null,
    button2ActionType: row.button2_action_type || 'dismiss',
    position: row.position,
    style: row.style,
    backgroundColor: row.background_color,
    textColor: row.text_color,
    buttonBackgroundColor: row.button_background_color,
    buttonTextColor: row.button_text_color,
    button2BackgroundColor: row.button2_background_color || null,
    button2TextColor: row.button2_text_color || null,
    isActive: row.is_active,
    startDate: row.start_date ? new Date(row.start_date) : null,
    endDate: row.end_date ? new Date(row.end_date) : null,
    priority: row.priority,
    targetAudience: row.target_audience,
    language: row.language,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

