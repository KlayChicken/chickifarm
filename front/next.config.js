/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.klaychicken.com', 'ipfs.io']
  },
  webpack: (config, { webpack }) => {
    config.resolve.fallback = {
      fs: false,
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    }
    //config.plugins.push(new webpack.IgnorePlugin({
    //  resourceRegExp: /^electron$/
    //}));
    return config
  },
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/api/:path*',
        destination: `http://3.38.89.225:3060/api/:path*`,
      }
    ];
  },
}

module.exports = nextConfig
