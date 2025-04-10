import { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { SingleTrack } from '../../../components/User/Tracks';
import { Container, LoaderModal } from '../../../components/Layout';
import TermSelect from '../../../components/TermSelect';
import { API } from '../../../../utils/constants';
import { formatDate } from '../../../../utils/helpers';
import { TimeRange } from '../../../../utils/types';
import LeftArrow from '../../../assets/left.svg';

function TopTracks() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
  const savePlaylist = async (
    token: string,
    name: string,
    description: string,
    trackUris: string[]
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API.user['save-playlist']}?access_token=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            description,
            trackUris,
          }),
        }
      );
      const data = await response.json();
      window.alert(data.message);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    setLoading(false);
  };

  function getPreviousMonths(
    dateInput: string | Date,
    numBefore: number
  ): string {
    const date =
      typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date provided');
    }

    const months: string[] = [];
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: '2-digit',
    });

    for (let i = 0; i <= numBefore; i++) {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() - i);
      const formattedMonth = formatter.format(newDate);

      const [month, year] = formattedMonth.split(' ');
      months.push(`${month} '${year}`);
    }

    return `${months[months.length - 1]} - ${months[0]}`;
  }

  function generateName(date: Date, term: TimeRange) {
    const base = 'Your Top Songs';
    if (term === 'short_term') {
      return `${base} from ${getPreviousMonths(date, 1)}`;
    } else if (term === 'medium_term') {
      return `${base} from ${getPreviousMonths(date, 6)}`;
    } else {
      return `${base} of All Time`;
    }
  }

  const handleOnClick = () => {
    if (user && user.topData && user.token && user.dateReceived) {
      const input = window.confirm('Are you sure?');
      if (input) {
        const description = `🎶 Generated using the app Musync (${formatDate(
          user.dateReceived
        )})`;
        const name = generateName(user.dateReceived, term);
        const trackUris = user?.topData.top_tracks[term].map(
          (item) => `spotify:track:${item.id}`
        );
        savePlaylist(user.token, name, description, trackUris);
      }
    }
  };
  return (
    <>
      {loading && <LoaderModal />}
      {user && user.topData && (
        <Container>
          <motion.div
            variants={containerVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="pt-5 relative"
          >
            <div className="flex flex-col lg:flex-row items-center w-full mb-5">
              {/* Heading + Back button */}
              <div className="flex lg:flex-row flex-col items-center w-full">
                {/* Desktop: Back Button */}
                <motion.img
                  onClick={() => navigate(-1)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={LeftArrow}
                  className="hidden lg:inline-block w-15 aspect-square  cursor-pointer"
                  alt={'Go Back'}
                />
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-7xl font-black w-max "
                >
                  On Repeat
                </motion.h3>

                <TermSelect sx="text-2xl lg:ml-3 w-max" />

                {/* Desktop: Add to Library */}
                <button
                  onClick={handleOnClick}
                  className="hidden lg:inline-block relative ml-auto hover:bg-black transition-all bg-neutral-900 text-white px-4 rounded-md cursor-pointer z-50 w-max  py-2"
                >
                  <span>add to library</span>
                </button>
              </div>
            </div>

            {/* Data */}
            <ul className="grid grid-cols-3 gap-3 md:grid-cols-5 md:gap-5 lg:gap-6 mb-16 lg:mb-6">
              {user?.topData.top_tracks[term].map((item, index) => (
                <motion.div variants={childVariant} key={`${term}-${item.id}`}>
                  <SingleTrack track={item} number={index + 1} />
                </motion.div>
              ))}
            </ul>

            <div className="lg:hidden fixed bottom-3 z-[60] flex w-[95%] space-x-2  text-white">
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

              {/* Add to Library */}
              <button
                onClick={handleOnClick}
                className="bg-neutral-900    rounded-md cursor-pointer py-2 block w-full"
              >
                <span>add to library</span>
              </button>
            </div>
            {/* Mobile: Back Button + Add To Library */}
          </motion.div>
        </Container>
      )}
    </>
  );
}

export default TopTracks;
