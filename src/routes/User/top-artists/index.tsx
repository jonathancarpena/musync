import { useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import { SingleArtist } from '../../../components/User/Artists';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Container } from '../../../components/Layout';
import TermSelect from '../../../components/TermSelect';
import LeftArrow from '../../../assets/left.svg';

function TopArtists() {
  const navigate = useNavigate();
  const { user, term } = useUser();

  useEffect(() => {
    if (!user?.topData) {
      navigate('/');
    }
  }, [user, navigate]);

  const containerVariant = {
    initial: { opacity: 0, y: 0, x: 0 },
    animate: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        mass: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
    exit: {
      y: 10,
      opacity: 0,
      transition: {
        ease: 'easeInOut',
        duration: 0.25,
      },
    },
  };

  const childVariant = {
    initial: { opacity: 0, y: -20, x: 0 },
    animate: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        ease: 'easeInOut',
        duration: 0.4,
      },
    },
  };

  return (
    <>
      {user && user.topData && (
        <Container>
          <motion.div
            variants={containerVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="pt-5"
          >
            <div className="flex flex-col lg:flex-row items-center w-full mb-5">
              {/* Heading + Back button */}
              <div className="flex items-center mb-5">
                <motion.img
                  onClick={() => navigate(-1)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={LeftArrow}
                  className="hidden lg:inline-block w-15 aspect-square cursor-pointer"
                  alt={'Go Back'}
                />

                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-7xl font-black w-max "
                >
                  Top Artists{' '}
                </motion.h3>
              </div>

              <TermSelect sx="text-2xl lg:ml-3 w-max" />
            </div>

            {/* Data */}
            <ul className="grid grid-cols-3 gap-3 md:grid-cols-5 md:gap-5 lg:gap-6 mb-16 lg:mb-6">
              {user.topData.top_artists[term].map((item, index) => (
                <motion.div variants={childVariant} key={`${term}-${item.id}`}>
                  <SingleArtist artist={item} number={index + 1} fullPage />
                </motion.div>
              ))}
            </ul>

            {/* Mobile: Back Button */}
            <div className="lg:hidden fixed bottom-3 w-[95%] text-white">
              <div
                onClick={() => navigate(-1)}
                className="bg-neutral-900 py-2 justify-center rounded-md flex space-x-1 items-center w-max px-5"
              >
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={LeftArrow}
                  className="invert w-5 aspect-square cursor-pointer "
                  alt={'Go Back'}
                />
                <span>home</span>
              </div>
            </div>
          </motion.div>
        </Container>
      )}
    </>
  );
}

export default TopArtists;
