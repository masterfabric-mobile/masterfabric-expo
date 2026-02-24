import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import { useEnterIngredientsViewModel } from '../hooks/use-enter-ingredients-view-model';
import { enterIngredientsStyles } from '../styles/enter-ingredients.styles';

export function EnterIngredientsScreen() {
  const {
    inputValue,
    ingredients,
    setInputValue,
    handleAddIngredient,
    removeIngredient,
    clearAll,
    handleFindRecipes,
    handleBack,
    canSubmit,
    handleAddSuggestion,
  } = useEnterIngredientsViewModel();

  const suggestedFoods = [
    'Egg',
    'Milk',
    'Flour',
    'Chicken',
    'Tomato',
    'Onion',
    'Garlic',
    'Olive oil',
    'Salt',
    'Pepper',
    'Cheese',
    'Yogurt',
  ];

  return (
    <View style={enterIngredientsStyles.container}>
      <View style={enterIngredientsStyles.header}>
        <TouchableOpacity style={enterIngredientsStyles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={RecipioColors.text} />
        </TouchableOpacity>
        <Text style={enterIngredientsStyles.title}>Enter Ingredients</Text>
        <TouchableOpacity
          style={enterIngredientsStyles.clearBtn}
          onPress={clearAll}
          disabled={!canSubmit}
        >
          <Text
            style={[
              enterIngredientsStyles.clearBtnText,
              !canSubmit && { opacity: 0.5 },
            ]}
          >
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={enterIngredientsStyles.scroll}
          contentContainerStyle={enterIngredientsStyles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={enterIngredientsStyles.sectionLabel}>Add items to your pantry</Text>
          <Text style={enterIngredientsStyles.hint}>
            Start typing to add ingredients for your search.
          </Text>

          <View style={enterIngredientsStyles.inputRow}>
            <TextInput
              style={enterIngredientsStyles.input}
              placeholder="Type ingredient name..."
              placeholderTextColor={RecipioColors.textSecondary}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleAddIngredient}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={enterIngredientsStyles.addBtn}
              onPress={handleAddIngredient}
              activeOpacity={0.8}
            >
              <Text style={enterIngredientsStyles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={enterIngredientsStyles.ingredientsHeader}>
            <Text style={enterIngredientsStyles.ingredientsTitle}>
              YOUR INGREDIENTS ({ingredients.length})
            </Text>
          </View>

          {ingredients.length === 0 ? (
            <Text style={enterIngredientsStyles.emptyListHint}>
              No ingredients added yet. Type above and tap Add.
            </Text>
          ) : (
            <View style={enterIngredientsStyles.tagList}>
              {ingredients.map((item) => (
                <View key={item} style={enterIngredientsStyles.tag}>
                  <Text style={enterIngredientsStyles.tagText}>{item}</Text>
                  <TouchableOpacity
                    style={enterIngredientsStyles.tagRemove}
                    onPress={() => removeIngredient(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={RecipioColors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={enterIngredientsStyles.suggestionSection}>
            <Text style={enterIngredientsStyles.suggestionLabel}>
              Suggested
            </Text>
            <View style={enterIngredientsStyles.suggestionChipsRow}>
              {suggestedFoods.map((food) => {
                const isAdded = ingredients.includes(food);
                return (
                  <TouchableOpacity
                    key={food}
                    style={[
                      enterIngredientsStyles.suggestionChip,
                      isAdded && { opacity: 0.6, borderColor: RecipioColors.primaryAccent },
                    ]}
                    onPress={() => handleAddSuggestion(food)}
                    activeOpacity={0.7}
                  >
                    <Text style={enterIngredientsStyles.suggestionChipText}>
                      {isAdded ? '✓ ' : '+ '}{food}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={[enterIngredientsStyles.cta, !canSubmit && { opacity: 0.6 }]}
            onPress={handleFindRecipes}
            disabled={!canSubmit}
            activeOpacity={0.8}
          >
            <Text style={enterIngredientsStyles.ctaText}>
              Find Recipes with These Ingredients…
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
