/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000', // Port backend kamu
                pathname: '/uploads/**', // Folder tempat gambar disimpan
            },
        ],
    },
};

export default nextConfig;