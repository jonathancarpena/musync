import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import Spotify from '../../assets/spotify.png';
import { Link } from 'react-router';
import { API } from '../../../utils/constants';


function Home() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const fetchUser = async (token: string) => {
      setFetched(true)
      try {
        const response = await fetch(
          `${API.user.profile}/?access_token=${token}`
        );
        const data = await response.json();
        updateUser({ ...data, token, dateReceived: new Date() });
        navigate('/user')
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (accessToken && !fetched) {
      window.localStorage.setItem('spotify_token', accessToken);
      fetchUser(accessToken);
    }
  }, [navigate, updateUser]);

  const login = () => {
    window.location.href = `${API.auth.login}`; // Redirect to backend login
  };

  return (
    <>
      <main className=" w-screen h-screen flex flex-col items-center justify-center">
        <h1 className="text-7xl font-bold font-title">MUSYNC</h1>
        <h2 className="mb-5 text-neutral-500">
          Compare. Connect. Sync Your Sound.
        </h2>
        <motion.button
          initial={{ opacity: 0, backgroundColor: '#171717' }}
          animate={{
            opacity: 1,
            transition: { duration: 0.5 },
          }}
          style={{ backgroundColor: 'white' }}
          whileHover={{ backgroundColor: '#1ED760', cursor: 'pointer' }}
          whileTap={{ scale: 0.9, backgroundColor: '#1ED760' }}
          className=" bg-neutral-900 rounded-lg text-white w-24 h-10 px-3"
          onClick={login}
        >
          <img src={Spotify} alt="Login Spotify Button" />
        </motion.button>

        <Link
          to="https://github.com/jonathancarpena"
          target="_blank"
          className="absolute bottom-3 text-neutral-400 text-sm"
        >
          <h3>@jonathacarpena</h3>
        </Link>
      </main>
    </>
  );
}

export default Home;
