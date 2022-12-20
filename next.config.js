/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `
      $brand-primary: "#244583",
      $primary-color: #64FF00;
      $handle-color: #666666;
    `,
  },
  images: {
    domains: ['lanka-kitchen.s3.amazonaws.com', 's3.amazonaws.com']
  }
}

module.exports = nextConfig
