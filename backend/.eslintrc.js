module.exports = {
  rules: {
    '@typescript-eslint/no-unsafe-call': 'off', // Desactiva esta regla
    // O configuración más específica:
    '@typescript-eslint/no-unsafe-call': [
      'error',
      {
        allowUntypedCalls: true, // Permite llamadas a funciones sin tipo explícito
      },
    ],
  },
};
