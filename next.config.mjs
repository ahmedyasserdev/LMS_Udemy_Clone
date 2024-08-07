/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'utfs.io',
         
        },
        {
          protocol: 'https',
          hostname: 'img.clerk.com',
         
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
         
        },
      ],
    },
  };
  
  export default nextConfig;
  