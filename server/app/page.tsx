"use client"

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BeakerIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/api/graphql');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8 font-[family-name:var(--font-geist-sans)]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-10 max-w-md w-full border border-gray-700/50"
      >
        <h1 className="text-3xl font-bold text-white mb-4 text-center bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Backend Dashboard
        </h1>
        <p className="text-gray-300 mb-8 text-center">
          Welcome to the backend control panel. Access the GraphQL testing environment below.
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNavigate}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          <BeakerIcon className="h-5 w-5" />
          Go to GraphQL Testing Environment
        </motion.button>
      </motion.div>
    </div>
  );
}