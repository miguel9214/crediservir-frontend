const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  // Configuración del proxy
  devServer: {
    proxy: {
      '/auth': {
        target: 'http://crediservir-api.test',  // La URL de tu backend
        changeOrigin: true,  // Permite cambiar el origen de la solicitud para evitar CORS
        secure: false,       // Solo si el backend no usa HTTPS
        pathRewrite: {
          '^/auth': '/auth',  // Si necesitas modificar la ruta en el backend
        },
      },
    },
  },
});
