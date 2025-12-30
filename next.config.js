/** @type {import('next').NextConfig} */
const nextConfig = {
      // 配置允许的开发来源
    allowedDevOrigins: [
      'localhost:3000',    // 本地开发环境
      'cumob.com',         // 你的主域名
      'www.cumob.com'      // 你的带www域名
    ],
    images: {
      unoptimized: true,
      domains: [
        "source.unsplash.com",
        "images.unsplash.com",
        "ext.same-assets.com",
        "ugc.same-assets.com",
      ],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "source.unsplash.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "images.unsplash.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "ext.same-assets.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "ugc.same-assets.com",
          pathname: "/**",
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  