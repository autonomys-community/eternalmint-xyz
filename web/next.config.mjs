/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true, //@dev note this is to allow svg to display
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demo.auto-drive.autonomys.xyz',
        port: '',
        pathname: '/api/objects/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3006',
        pathname: '/api/cid/**',
      },
    ],
  },
};

export default nextConfig;
