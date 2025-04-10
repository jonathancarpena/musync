import { TopGenres } from '../../../utils/types';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
interface Props {
  genres: TopGenres;
  right: boolean;
  sx?: string;
}

export default function Genres({ genres, right, sx }: Props) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 640); // Tailwind's 'sm' breakpoint
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { term } = useUser();
  const transitionDuration = isSmallScreen ? 20 : 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 2 } }}
      exit={{ opacity: 0 }}
      className={`select-none absolute mx-auto bg-neutral-900 text-white overflow-hidden py-1 left-1/2 -translate-x-1/2  -z-0 text-4xl md:text-3xl w-screen capitalize ${sx}`}
    >
      <motion.h4
        className="flex whitespace-nowrap "
        animate={{ x: right ? ['-100%', '0%'] : ['0%', '-100%'] }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: transitionDuration,
          ease: 'linear',
        }}
      >
        {Object.entries(genres[term]).map(([genre]) => (
          <span key={`${term}-${genre}`} className="mr-6 w-max">
            {genre}
          </span>
        ))}
        {Object.entries(genres[term]).map(([genre]) => (
          <span key={`${term}-${genre}`} className="mr-6 w-max">
            {genre}
          </span>
        ))}
        {Object.entries(genres[term]).map(([genre]) => (
          <span key={`${term}-${genre}`} className="mr-6 w-max">
            {genre}
          </span>
        ))}
        {Object.entries(genres[term]).map(([genre]) => (
          <span key={`${term}-${genre}`} className="mr-6 w-max">
            {genre}
          </span>
        ))}
        {Object.entries(genres[term]).map(([genre]) => (
          <span key={`${term}-${genre}`} className="mr-6 w-max">
            {genre}
          </span>
        ))}
        {Object.entries(genres[term]).map(([genre]) => (
          <span key={`${term}-${genre}`} className="mr-6 w-max">
            {genre}
          </span>
        ))}
      </motion.h4>
    </motion.div>
  );
}
