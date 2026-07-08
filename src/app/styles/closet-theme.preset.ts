import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const closetSurfaces = {
  0: '#b8a993',
  50: '#3a3837',
  100: '#363433',
  200: '#343231',
  300: '#323030',
  400: '#312f2e',
  500: '#5c5856',
  600: '#4a4746',
  700: '#3a3837',
  800: '#312f2e',
  900: '#292828',
  950: '#292828',
};

const closetPrimary = {
  50: '#fdf6f0',
  100: '#f9e8d9',
  200: '#f2d0b3',
  300: '#eab88d',
  400: '#e3a984',
  500: '#dea37b',
  600: '#c88f67',
  700: '#a87550',
  800: '#885c3f',
  900: '#68452f',
  950: '#482e1f',
};

const closetScheme = {
  surface: closetSurfaces,
  primary: {
    color: '{primary.500}',
    contrastColor: '#292828',
    hoverColor: '{primary.400}',
    activeColor: '{primary.300}',
  },
  highlight: {
    background: 'color-mix(in srgb, {primary.500}, transparent 84%)',
    focusBackground: 'color-mix(in srgb, {primary.500}, transparent 76%)',
    color: '#b8a993',
    focusColor: '#dea37b',
  },
  text: {
    color: '#b8a993',
    hoverColor: '#d4be98',
    mutedColor: '#8a8070',
    hoverMutedColor: '#b8a993',
  },
  content: {
    background: '#312f2e',
    hoverBackground: '#3a3837',
    borderColor: '#4a4746',
    color: '#b8a993',
    hoverColor: '#d4be98',
  },
  formField: {
    background: '#292828',
    disabledBackground: '#3a3837',
    filledBackground: '#312f2e',
    filledHoverBackground: '#312f2e',
    filledFocusBackground: '#312f2e',
    borderColor: '#5c5856',
    hoverBorderColor: '#708a81',
    focusBorderColor: '{primary.500}',
    color: '#b8a993',
    placeholderColor: '#8a8070',
    iconColor: '#8a8070',
  },
  overlay: {
    select: {
      background: '#312f2e',
      borderColor: '#4a4746',
      color: '#b8a993',
    },
    popover: {
      background: '#312f2e',
      borderColor: '#4a4746',
      color: '#b8a993',
    },
    modal: {
      background: '#312f2e',
      borderColor: '#4a4746',
      color: '#b8a993',
    },
  },
  list: {
    option: {
      focusBackground: '#3a3837',
      selectedBackground: 'color-mix(in srgb, {primary.500}, transparent 84%)',
      selectedFocusBackground:
        'color-mix(in srgb, {primary.500}, transparent 76%)',
      color: '#b8a993',
      focusColor: '#d4be98',
      selectedColor: '#dea37b',
      selectedFocusColor: '#dea37b',
    },
  },
  navigation: {
    item: {
      focusBackground: 'rgba(255, 255, 255, 0.04)',
      activeBackground: 'rgba(255, 255, 255, 0.06)',
      color: '#b8a993',
      focusColor: '#b8a993',
      activeColor: '#b8a993',
      icon: {
        color: '#8a8070',
        focusColor: '#b8a993',
        activeColor: '#b8a993',
      },
    },
    submenuLabel: {
      color: '#8a8070',
    },
    submenuIcon: {
      color: '#8a8070',
      focusColor: '#b8a993',
      activeColor: '#b8a993',
    },
  },
};

export const ClosetTheme = definePreset(Aura, {
  semantic: {
    primary: closetPrimary,
    colorScheme: {
      light: closetScheme,
      dark: closetScheme,
    },
  },
  components: {
    menubar: {
      root: {
        background: 'transparent',
        borderColor: 'transparent',
        color: '#b8a993',
      },
    },
    card: {
      root: {
        background: 'rgba(49, 47, 46, 0.58)',
        color: '#b8a993',
        borderRadius: '16px',
        shadow: '0 8px 22px rgba(0, 0, 0, 0.22)',
      },
      title: {
        fontSize: '0.9rem',
        fontWeight: '700',
      },
      subtitle: {
        color: '#8a8070',
      },
    },
    datatable: {
      header: {
        background: '#312f2e',
        borderColor: '#4a4746',
        color: '#b8a993',
      },
      headerCell: {
        background: '#312f2e',
        borderColor: '#4a4746',
        color: '#dea37b',
      },
      row: {
        background: '#312f2e',
        color: '#b8a993',
      },
      bodyCell: {
        borderColor: '#4a4746',
      },
    },
    dialog: {
      root: {
        background: '#312f2e',
        borderColor: '#4a4746',
        color: '#b8a993',
      },
    },
  },
});
