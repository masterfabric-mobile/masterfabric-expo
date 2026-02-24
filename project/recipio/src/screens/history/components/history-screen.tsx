import { Text, View } from 'react-native';
import { useHistoryViewModel } from '../hooks/use-history-view-model';
import { HISTORY_PLACEHOLDER } from '../utils/history-utils';
import { historyStyles } from '../styles/history.styles';

export function HistoryScreen() {
  useHistoryViewModel();

  return (
    <View style={historyStyles.container}>
      <Text style={historyStyles.text}>{HISTORY_PLACEHOLDER.title}</Text>
      <Text style={historyStyles.subtext}>{HISTORY_PLACEHOLDER.subtext}</Text>
    </View>
  );
}
