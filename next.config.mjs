/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
      },
    images:
    {
        domains: ['utfs.io', 'img.clerk.com' , "res.cloudinary.com"]
    },
};

export default nextConfig;
