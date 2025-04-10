import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router';
import Home from './Home';
import User from './User';
import TopArtists from './User/top-artists';
import TopTracks from './User/top-tracks';
import Compare from './User/compare';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />

        <Route path="user">
          <Route index element={<User />} />
          <Route path="top-artists" element={<TopArtists />} />
          <Route path="top-tracks" element={<TopTracks />} />
          <Route path="compare/:otherUser" element={<Compare />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
