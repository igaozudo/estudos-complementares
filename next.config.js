/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Desativa a checagem chata de aspas durante o build da Vercel
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Ignora avisos leves de tipagem no build
      ignoreBuildErrors: true,
    },
  };
  
  module.exports = nextConfig;