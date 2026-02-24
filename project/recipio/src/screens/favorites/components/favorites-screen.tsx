import { Text, View } from 'react-native';
import { useFavoritesViewModel } from '../hooks/use-favorites-view-model';
import { FAVORITES_PLACEHOLDER } from '../utils/favorites-utils';
import { favoritesStyles } from '../styles/favorites.styles';

export function FavoritesScreen() {
  useFavoritesViewModel();

  return (
    <View style={favoritesStyles.container}>
      <Text style={favoritesStyles.text}>{FAVORITES_PLACEHOLDER.title}</Text>
      <Text style={favoritesStyles.subtext}>{FAVORITES_PLACEHOLDER.subtext}</Text>
    </View>
  );
}
