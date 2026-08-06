/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep your existing ESLint and TypeScript settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Fix: prevent mongodb/mongoose from being bundled by webpack
  // (fixes "Module not found: Default condition should be last one")
  experimental: {
    serverComponentsExternalPackages: ['mongodb', 'mongoose'],
  },

  // Handle Three.js and other VR dependencies
  webpack: (config, { isServer }) => {
    // Handle Three.js on server side
    if (isServer) {
      config.externals.push('three');
    }
    
    // Optimize Three.js bundle
    config.resolve.alias = {
      ...config.resolve.alias,
      'three/examples/jsm': 'three/examples/jsm'
    };
    
    return config;
  },
  
  // Image optimization for VR content
  images: {
    // Keep unoptimized if you prefer, but add VR domains
    unoptimized: true,
    domains: [
      'img.youtube.com', 
      'i.ytimg.com',
      'ytimg.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ytimg.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
  
  // Enable HTTPS headers for WebXR compatibility
  async headers() {
    return [
      {
        source: '/vr-learning/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          }
        ]
      }
    ];
  },
  
  // Handle VR learning routes
  async rewrites() {
    return [
      {
        source: '/vr-learning',
        destination: '/vr-learning'
      },
      {
        source: '/vr-learning/:path*',
        destination: '/vr-learning/:path*'
      }
    ];
  },
  
  // PWA support for VR mobile experience
  async generateBuildId() {
    return 'edupath-vr-' + new Date().getTime();
  }
};

export default nextConfig;
