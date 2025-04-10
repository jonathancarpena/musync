import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { timeRangeTerms } from '../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { TimeRange } from '../../utils/types';

interface Props {
  sx?: string;
}
function TermSelect({ sx }: Props) {
  const { term, updateTerm } = useUser();
  const [active, setActive] = useState(false);

  const handleOnClick = () => {
    setActive(!active);
  };

  const handleOptionSelect = (value: TimeRange) => {
    updateTerm(value);
  };
  const variants = {
    initial: {
      opacity: 0,
      y: -10,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        ease: 'easeInOut',
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        ease: 'easeInOut',
        duration: 0.3,
      },
    },
  };
  return (
    <div
      onClick={handleOnClick}
      className={`w-max relative select-none z-50 text-base ${sx}`}
    >
      <div className=" bg-neutral-200  cursor-pointer py-0.5 rounded-md overflow-hidden z-50 ">
        <span className="underline underline-offset-2 text-neutral-800">
          {timeRangeTerms[term]}
        </span>
      </div>

      {/* Options */}
      <AnimatePresence>
        {active && (
          <motion.ul
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-[120%] w-max bg-neutral-100 select-none text-center rounded-md overflow-hidden -translate-x-1/2 left-1/2"
          >
            {term !== 'short_term' && (
              <li
                onClick={() => handleOptionSelect('short_term')}
                className="py-0.5 px-2 hover:bg-neutral-300 cursor-pointer"
              >
                {timeRangeTerms['short_term']}
              </li>
            )}
            {term !== 'medium_term' && (
              <li
                onClick={() => handleOptionSelect('medium_term')}
                className="py-0.5 px-2 hover:bg-neutral-300 cursor-pointer"
              >
                {timeRangeTerms['medium_term']}
              </li>
            )}

            {term !== 'long_term' && (
              <li
                onClick={() => handleOptionSelect('long_term')}
                className="py-0.5 px-2 hover:bg-neutral-300 cursor-pointer"
              >
                {timeRangeTerms['long_term']}
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TermSelect;
