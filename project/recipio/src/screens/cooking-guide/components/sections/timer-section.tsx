import { View } from 'react-native';

interface TimerSectionProps {
  /** Duration in seconds; when provided, show timer (future) */
  durationSeconds?: number;
}

/**
 * Placeholder for step timer. When a step has durationSeconds, show countdown.
 * Doc: "Timer: Shown when a step has a timer"
 */
export function TimerSection({ durationSeconds }: TimerSectionProps) {
  if (durationSeconds == null || durationSeconds <= 0) return null;
  return <View />;
}
