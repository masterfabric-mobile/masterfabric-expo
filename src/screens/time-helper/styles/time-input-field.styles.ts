import { StyleSheet } from 'react-native';

export const timeInputFieldStyles = StyleSheet.create({
  // Container
  container: {
    marginBottom: 24,
  },
  
  // Input card
  inputCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  
      // Labels
      label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
      },
      description: {
        fontSize: 11,
        marginBottom: 8,
        opacity: 0.7,
      },
  
  // Input fields
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 44,
    borderWidth: 1,
  },
  
  // Layout
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  
      // Buttons
      buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
      },
      button: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
      },
  
  // Picker container
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
});
