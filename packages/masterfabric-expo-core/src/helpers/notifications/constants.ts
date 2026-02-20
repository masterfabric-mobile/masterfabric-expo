/**
 * Local Notification Helper – Constants and default channel configs.
 */

import type { ChannelOptions } from './types';

/** Default Android notification channels created by the helper when needed. */
export const DEFAULT_CHANNELS: ChannelOptions[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Default notifications',
    importance: 'default',
  },
  {
    id: 'high_priority',
    name: 'High Priority',
    description: 'High priority notifications',
    importance: 'high',
  },
  {
    id: 'low_priority',
    name: 'Low Priority',
    description: 'Low priority notifications',
    importance: 'low',
  },
];

/** Default channel ID used when none is specified (Android). */
export const DEFAULT_CHANNEL_ID = 'default';
