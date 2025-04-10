import { useState, useEffect, useCallback } from 'react';
import { TopData, User as AppUser } from '../../../utils/types';
import { useUser } from '../../context/UserContext';
import Tracks, { RecentlyPlayed } from '../../components/User/Tracks';
import Artists from '../../components/User/Artists';
import Profile from '../../components/User/Profile';
import { motion } from 'framer-motion';
import { Loader } from '../../components/Layout';
import { useNavigate } from 'react-router';
import { API } from '../../../utils/constants';

function User() {
  const { user, updateUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (user.topData) {
      if (!fetched) {
        fetchCachedData();
      }
    } else {
      if (!fetched) {
        fetchTopData();
      }
    }
  });

  const fetchCachedData = useCallback(() => {
    if (!user?.topData) return;
    setFetched(true);
  }, [user]);

  const fetchTopData = useCallback(async () => {
    if (fetched || !user?.token) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${API.user['top-data']}?access_token=${user.token}&id=${user.id}`
      );
      const topData = (await response.json()) as TopData;

      const updatedUser: AppUser = { ...user, topData };
      updateUser(updatedUser);

      setFetched(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      alert(error);
      navigate('/');
    }
    setLoading(false);
  }, [fetched, user, updateUser, navigate]);

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

  if (loading) {
    return <Loader message={'Lurking your Spotify profile...🎧'} />;
  }
  return (
    user?.topData && (
      <motion.div
        variants={containerVariant}
        initial="initial"
        animate="animate"
        exit="exit"
        className="mx-auto "
      >
        <div className="relative ">
          <Profile />
        </div>

        {/* Top Artists */}
        <Artists artists={user.topData.top_artists} />

        {/* Top Tracks */}
        <Tracks tracks={user.topData.top_tracks} />

        {/* Recently Played */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="max-w-[82rem] mx-auto relative bg-neutral-900 text-white rounded-t-3xl"
        >
          <div className="lg:max-w-6xl xl:max-w-7xl mx-auto px-3 py-5">
            <h3 className="text-5xl text-center lg:text-start md:text-7xl font-black md:mb-5 mb-6  lg:w-max">
              Recent Listens
            </h3>
            <RecentlyPlayed recentlyPlayed={user.topData.recentlyPlayed} />
          </div>
        </motion.div>
      </motion.div>
    )
  );
}
export default User;
