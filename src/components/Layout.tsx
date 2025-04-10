import React from 'react';
import { motion } from 'framer-motion';
import { useViewportHeight } from '../../utils/hooks/useViewportHeight';

interface Props {
  children?: React.ReactNode;
}

export default function Layout({ children }: Props) {
  useViewportHeight();
  return (
    <div className="custom-screen bg-neutral-200 font-playfair text-neutral-900 overflow-x-hidden">
      <main>{children}</main>
    </div>
  );
}

interface Props {
  children?: React.ReactNode;
}

export function Container({ children }: Props) {
  return (
    <div className="lg:max-w-6xl xl:max-w-7xl mx-auto px-3 py-1 ">
      {children}
    </div>
  );
}

interface LoaderProps {
  message: string;
}
export function Loader({ message }: LoaderProps) {
  return (
    <div className="flex flex-col justify-center items-center h-screen ">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-4 h-4 bg-neutral-900 rounded-full"
            animate={{ y: [-10, 10, -10] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.2, // Delay each dot
            }}
          />
        ))}
      </div>
      <p className="mt-6 text-neutral-900">
        <span className="italic">{message}</span>
      </p>
    </div>
  );
}

export function MiniLoader() {
  return (
    <div className="flex justify-center items-center h-full w-full p-2">
      <div className="w-5 h-auto aspect-square border-3 border-gray-300 border-t-neutral-500 rounded-full animate-spin"></div>
    </div>
  );
}

export function LoaderModal() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-neutral-200 opacity-90 fixed w-screen z-[60]">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-4 h-4 bg-neutral-900 rounded-full"
            animate={{ y: [-10, 10, -10] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.2, // Delay each dot
            }}
          />
        ))}
      </div>
      <p className="mt-6 text-neutral-900">
        <span className="italic">
          Adding the best playlist to your library...
        </span>
        💗
      </p>
    </div>
  );
}
