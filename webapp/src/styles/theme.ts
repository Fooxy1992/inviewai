import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Configuração global do tema
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Cores personalizadas
const colors = {
  brand: {
    50: '#e6e9ff',
    100: '#c4cbff',
    200: '#9facff',
    300: '#798eff',
    400: '#5470ff',
    500: '#4a6cf7', // Cor principal
    600: '#3452c9',
    700: '#283c9a',
    800: '#1c276b',
    900: '#10143d',
  },
  secondary: {
    50: '#f8f9fa',
    100: '#e9ecef',
    200: '#dee2e6',
    300: '#ced4da',
    400: '#adb5bd',
    500: '#6c757d', // Cor secundária
    600: '#495057',
    700: '#343a40',
    800: '#212529',
    900: '#0d0d0d',
  },
};

// Estilos de componentes personalizados
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
    },
    variants: {
      solid: {
        bg: 'brand.500',
        color: 'white',
        _hover: {
          bg: 'brand.600',
        },
      },
      outline: {
        border: '1px solid',
        borderColor: 'brand.500',
        color: 'brand.500',
      },
      secondary: {
        bg: 'secondary.500',
        color: 'white',
        _hover: {
          bg: 'secondary.600',
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: 'bold',
      color: 'secondary.700',
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'lg',
        boxShadow: 'md',
        overflow: 'hidden',
      },
    },
  },
};

// Estilos de texto personalizados
const textStyles = {
  h1: {
    fontSize: ['2xl', '3xl', '4xl'],
    fontWeight: 'bold',
    lineHeight: '110%',
    letterSpacing: '-1px',
  },
  h2: {
    fontSize: ['xl', '2xl', '3xl'],
    fontWeight: 'semibold',
    lineHeight: '110%',
    letterSpacing: '-0.5px',
  },
  h3: {
    fontSize: ['lg', 'xl', '2xl'],
    fontWeight: 'medium',
    lineHeight: '110%',
  },
  body: {
    fontSize: ['sm', 'md'],
    fontWeight: 'normal',
  },
};

// Estilos globais
const styles = {
  global: {
    body: {
      bg: 'white',
      color: 'secondary.700',
    },
  },
};

// Fontes personalizadas
const fonts = {
  heading: "'Poppins', sans-serif",
  body: "'Inter', sans-serif",
};

// Extensão do tema padrão
export const theme = extendTheme({
  config,
  colors,
  components,
  textStyles,
  styles,
  fonts,
}); 