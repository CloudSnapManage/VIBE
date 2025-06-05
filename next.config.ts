
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.skyweaver.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.skyweaver.ns',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images2.alphacoders.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
