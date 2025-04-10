import { useEffect, useState } from 'react';
import { Container, Loader } from '../../../components/Layout';
import { useParams, useNavigate } from 'react-router';
import { useUser } from '../../../context/UserContext';
import { ComparisonResults, TimeRange } from '../../../../utils/types';
import { API } from '../../../../utils/constants';
import User from '../../../components/User/Compare/User';
import { Link } from 'react-router';
import PlaylistCover from '../../../components/User/Compare/PlaylistCover';
import { LoaderModal } from '../../../components/Layout';
import { formatDate } from '../../../../utils/helpers';
import { motion } from 'framer-motion';
import LeftArrow from '../../../assets/left.svg';

function Compare() {
  const { user } = useUser();
  const { otherUser } = useParams();
  const [results, setResults] = useState<ComparisonResults | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [playlistLoading, setPlaylistLoading] = useState<boolean>(false);
  const navigate = useNavigate();

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
    initial: { opacity: 0, y: -50, x: 0 },
    animate: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        ease: 'easeInOut',
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    if (!user?.id || !otherUser) return;

    const fetchComparison = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API.user.compare}?access_token=${user.token}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              otherUserId: otherUser,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch comparison');
        }

        const data: ComparisonResults = await response.json();
        setResults(data);
        console.log(data);
      } catch (err) {
        console.error('Error fetching comparison:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [user?.id, otherUser, user?.token]);

  const savePlaylist = async (
    token: string,
    name: string,
    description: string,
    trackUris: string[]
  ) => {
    setPlaylistLoading(true);
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
    setPlaylistLoading(false);
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

  function generateName(term: TimeRange) {
    const base = `${user?.display_name} + ${results?.userB.display_name}'s`;
    if (term === 'long_term') {
      return `${base} faves of all time`;
    } else {
      return `${base} playlist`;
    }
  }

  function generateDescription(term: TimeRange) {
    if (user && user.dateReceived && results && results.userB.dateReceived) {
      const suffix = ` — 🎶 Generated using the app Musync (${formatDate(
        user.dateReceived
      )})`;
      if (term === 'short_term') {
        return `${user.display_name}'s music from ${getPreviousMonths(
          user.dateReceived,
          1
        )} and ${results?.userB.display_name}'s music from ${getPreviousMonths(
          results.userB.dateReceived,
          1
        )} ${suffix}`;
      } else if (term === 'medium_term') {
        return `${user.display_name}'s music from ${getPreviousMonths(
          user.dateReceived,
          6
        )} and ${results?.userB.display_name}'s music from ${getPreviousMonths(
          results.userB.dateReceived,
          6
        )} ${suffix}`;
      } else {
        return `${user.display_name}'s music since ${
          getPreviousMonths(user.dateReceived, 1).split('- ')[1]
        } and ${results?.userB.display_name}'s music since ${
          getPreviousMonths(results.userB.dateReceived, 1).split('- ')[1]
        } ${suffix}`;
      }
    } else {
      return `🎶 Generated using the app Musync`;
    }
  }

  const handleOnClick = (term: TimeRange) => {
    if (user && user.topData && user.token && user.dateReceived) {
      const input = window.confirm('Are you sure?');
      if (input) {
        const description = generateDescription(term);
        const name = generateName(term);
        const trackUris = results?.merged[term].map(
          (item) => `spotify:track:${item.id}`
        );

        if (trackUris) {
          savePlaylist(user.token, name, description, trackUris);
        }
      }
    }
  };

  if (loading) {
    return <Loader message="Seeing if you guys vibe with each other...🎶💫" />;
  }

  if (!results?.userB) {
    return (
      <Container>
        <div className="pt-10 pb-20 text-center">
          <p className="text-xl font-bold">
            Unable to fetch comparison results
          </p>
        </div>
      </Container>
    );
  }

  if (playlistLoading) return <LoaderModal />;
  return (
    user &&
    results && (
      <motion.div
        variants={containerVariant}
        initial="initial"
        animate="animate"
        exit="exit"
        className="lg:max-w-6xl xl:max-w-7xl mx-auto lg:px-3 lg:py-1 "
      >
        <motion.div
          variants={containerVariant}
          initial="initial"
          animate="animate"
          exit="exit"
          className="lg:pt-10 pb-20"
        >
          {/* USERS */}
          <div className="flex ">
            <User user={user} results={results} />
            <User user={results.userB} results={results} other />
          </div>

          {/* SHARED TRACKS */}
          {results.tracks.sharedTracks.length && (
            <motion.div
              variants={childVariant}
              className="mt-16 text-center max-w-11/12 mx-auto"
            >
              <h2 className="text-3xl lg:text-5xl font-black mb-2 lg:mb-4">
                Similar Tracks
              </h2>

              <ol
                className={`flex space-x-3 overflow-x-auto mx-auto pb-2 ${
                  results.tracks.sharedTracks.length > 4
                    ? ''
                    : 'lg:justify-center'
                }`}
              >
                {results.tracks.sharedTracks.map((item) => (
                  <li
                    key={`${item.id}-sharedTracks`}
                    className={`${
                      results.tracks.sharedTracks.length > 4
                        ? 'min-w-52'
                        : 'min-w-52 lg:w-52'
                    }`}
                  >
                    <Link
                      to={`https://open.spotify.com/track/${item.id}`}
                      target="_blank"
                      className="block w-full aspect-square relative"
                    >
                      <img
                        src={item.album.images[0].url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <p className="lg:text-xs text-center mt-1 truncate">
                      {item.name}
                    </p>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}

          {/* SHARED ARTISTS */}
          {results.artists.sharedArtists.length && (
            <motion.div
              variants={childVariant}
              className="mt-14 text-center max-w-11/12 mx-auto"
            >
              <h2 className="text-3xl lg:text-5xl font-black mb-2 lg:mb-4">
                Similar Artists
              </h2>

              <ol
                className={`flex space-x-3 overflow-x-auto mx-auto pb-2 ${
                  results.artists.sharedArtists.length > 4
                    ? ''
                    : 'lg:justify-center'
                }`}
              >
                {results.artists.sharedArtists.map((item) => (
                  <li
                    key={`${item.id}-sharedArtist`}
                    className={`${
                      results.artists.sharedArtists.length > 4
                        ? 'min-w-52'
                        : 'min-w-52 lg:w-52'
                    }`}
                  >
                    <Link
                      to={`https://open.spotify.com/artist/${item.id}`}
                      target="_blank"
                      className="block w-full aspect-square relative"
                    >
                      <img
                        src={item.images[0].url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <p className="lg:text-xs text-center mt-1 truncate">
                      {item.name}
                    </p>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}

          {/* MERGED PLAYLIST */}
          {results.userB.allowSharedPlaylist && (
            <motion.div variants={childVariant}>
              <h2 className="text-3xl lg:text-5xl font-black mt-16 text-center">
                {`${user.display_name} + ${results.userB.display_name}'s playlists`}
              </h2>

              <div className="flex flex-col space-y-10 lg:space-y-0 lg:flex-row justify-center lg:space-x-8  mt-5">
                <PlaylistCover
                  tracks={results.merged.short_term}
                  userA={{ id: user.id, image: user.images[0].url }}
                  userB={{
                    id: results.userB.id,
                    image: results.userB.images[0].url,
                  }}
                  savePlaylist={() => handleOnClick('short_term')}
                />
                <PlaylistCover
                  tracks={results.merged.medium_term}
                  userA={{ id: user.id, image: user.images[0].url }}
                  userB={{
                    id: results.userB.id,
                    image: results.userB.images[0].url,
                  }}
                  savePlaylist={() => handleOnClick('medium_term')}
                />
                <PlaylistCover
                  tracks={results.merged.long_term}
                  userA={{ id: user.id, image: user.images[0].url }}
                  userB={{
                    id: results.userB.id,
                    image: results.userB.images[0].url,
                  }}
                  savePlaylist={() => handleOnClick('long_term')}
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Mobile: Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-3 w-[95%] text-white left-3"
        >
          <div
            onClick={() => navigate(-1)}
            className="bg-neutral-900 py-2 justify-center rounded-md flex space-x-1 items-center w-max px-5 lg:hidden"
          >
            <img
              src={LeftArrow}
              className="invert w-5 aspect-square cursor-pointer "
              alt={'Go Back'}
            />
            <span>home</span>
          </div>
        </motion.div>
      </motion.div>
    )
  );
}

export default Compare;
