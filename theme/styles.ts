import { StyleSheet } from 'react-native';
import { Theme } from './index';

export const createCommonStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    listContent: {
      padding: 12,
    },
    sessionItem: {
      padding: 12,
      borderRadius: 6,
      marginBottom: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
      height: 130,
      overflow: 'visible',
      position: 'relative',
    },
    dateText: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 10,
    },
    durationText: {
      fontSize: 35,
      fontWeight: '500',
    },
    badgeWrapper: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 10,
    },
    primaryButton: {
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 5,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      marginBottom: 5,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    emptyContainer: {
      padding: 32,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    timerText: {
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 12,
      fontFamily: 'monospace',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    tipContainer: {
      padding: 16,
      borderRadius: 8,
    },
    tipText: {
      fontSize: 16,
      fontStyle: 'italic',
    },
    dropdownTrigger: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
    },
    dropdownTriggerText: {
      fontSize: 16,
      flex: 1,
    },
    dropdownList: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      borderWidth: 1,
      borderTopWidth: 0,
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      maxHeight: 200,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 1000,
    },
    dropdownItemText: {
      fontSize: 16,
    },
    addButton: {
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
  });
