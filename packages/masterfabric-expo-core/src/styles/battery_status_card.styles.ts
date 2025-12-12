import { StyleSheet } from 'react-native';

export const batteryStatusCardStyles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  batteryContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  batteryIcon: {
    width: 80,
    height: 40,
    borderRadius: 4,
    borderWidth: 3,
    position: 'relative',
    marginBottom: 12,
  },
  batteryTip: {
    width: 4,
    height: 12,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    position: 'absolute',
    right: -7,
    top: 10,
  },
  batteryLevel: {
    height: '100%',
    borderRadius: 1,
  },
  percentage: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

