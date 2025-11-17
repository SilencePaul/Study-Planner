import { StyleSheet } from 'react-native';
import { Theme } from './index';

export const createCommonStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.md,
    },
    listContent: {
      padding: theme.spacing.sm,
    },
    sessionItem: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
      height: 130,
      overflow: 'visible',
      position: 'relative',
    },
    dateText: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    durationText: {
      fontSize: 35,
      fontWeight: '500',
    },
    badgeWrapper: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      zIndex: 10,
    },
    primaryButton: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      borderWidth: 1,
      marginBottom: theme.spacing.xs,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    emptyContainer: {
      padding: theme.spacing.xl,
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
      marginBottom: theme.spacing.md,
    },
    timerText: {
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: theme.spacing.sm,
      fontFamily: 'monospace',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: theme.spacing.sm,
    },
    tipContainer: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
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
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
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
      borderBottomLeftRadius: theme.borderRadius.md,
      borderBottomRightRadius: theme.borderRadius.md,
      // Allow larger dropdowns on small screens and enable scrolling
      maxHeight: 360,
      paddingBottom: theme.spacing.sm,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 8,
      zIndex: 1000,
    },
    dropdownItemText: {
      fontSize: 16,
    },
    addButton: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.sm,
    },
  });
