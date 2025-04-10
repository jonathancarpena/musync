import { useNavigate } from 'react-router';
import {
  Track,
  RecentlyPlayed as SpotifyRecentlyPlayed,
  TopTracks,
} from '../../../utils/types';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { Container } from '../Layout';
import { Link } from 'react-router';
interface SingleTrackProps {
  track: Track;
  number: number;
}

export function SingleTrack({ track, number }: SingleTrackProps) {
  return (
    <Link
      to={`https://open.spotify.com/track/${track.id}`}
      target="_blank"
      className="w-[45%] mx-auto md:w-full"
    >
      <li className="w-full">
        <div className="aspect-square h-auto w-full relative">
          <div className="overflow-hidden w-full h-full">
            {track.album.images ? (
              <img
                src={track.album.images[0].url}
                alt={`album-art-for-${track.name}`}
              />
            ) : (
              <span>None</span>
            )}
          </div>
        </div>

        <p className={`text-neutral-800 mt-3 font-medium truncate`}>
          {`${number}. ${track.name}`}
        </p>
        <p className="truncate  text-neutral-400 font-medium -mt-1">
          {track.artists[0].name}
        </p>
      </li>
    </Link>
  );
}

interface SingleRecentlyPlayedProps {
  track: Track;
  since: string;
}

export function SingleRecentlyPlayed({
  track,
  since,
}: SingleRecentlyPlayedProps) {
  return (
    <Link to={`https://open.spotify.com/track/${track.id}`} target="_blank">
      <li className="flex justify-between py-1.5 md:py-1 md:px-2 cursor-pointer transition-all duration-100 md:hover:bg-neutral-950 rounded-lg text-sm md:text-base">
        <div className="flex w-9/12 overflow-hidden truncate">
          {/* Album Image */}
          <div className="aspect-square w-12 h-auto relative">
            <div className="overflow-hidden w-full h-full">
              {track.album.images ? (
                <img
                  src={track.album.images[0].url}
                  alt={`album-art-for-${track.name}`}
                />
              ) : (
                <span>None</span>
              )}
            </div>
          </div>

          {/* Track Name, Artist Name + Album Name */}
          <div className="ml-3 truncate font-semibold">
            <p className=" truncate">{track.name}</p>
            <p className="text-neutral-400  truncate">
              {`${track.artists[0].name} • ${track.album.name}`}
            </p>
          </div>
        </div>

        {/* Time Since */}
        <p className="w-3/12 font-semibold text-neutral-400  shrink-0 text-right">
          {since}
        </p>
      </li>
    </Link>
  );
}

interface RecentlyPlayedProps {
  recentlyPlayed: SpotifyRecentlyPlayed;
}

export function RecentlyPlayed({ recentlyPlayed }: RecentlyPlayedProps) {
  return (
    <ol className="flex flex-col space-y-4 font-playfair">
      {Object.entries(recentlyPlayed).map(([date, recentTracks]) => (
        <li key={date}>
          <p className="font-bold border-b mb-2.5">{date}</p>
          <ol className="flex flex-col ">
            {recentTracks.map((recentTrack) => (
              <SingleRecentlyPlayed
                key={`${recentTrack.played_at}`}
                track={recentTrack.track}
                since={recentTrack.since}
              />
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}

interface TracksProps {
  tracks: TopTracks;
}
export default function Tracks({ tracks }: TracksProps) {
  const { term } = useUser();
  const navigate = useNavigate();
  const handleOnClick = () => {
    if (tracks[term].length > 5) {
      navigate('/user/top-tracks');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
  return (
    <Container>
      <motion.div variants={childVariant} className={'relative mb-10 md:mb-20'}>
        <h3
          onClick={handleOnClick}
          className="text-6xl text-center lg:text-start lg:text-7xl font-black md:mb-5 mb-6 cursor-pointer lg:w-max flex flex-col lg:flex-row lg:items-end "
        >
          <span>On Repeat</span>
          <span className=" text-neutral-400 ml-3 text-lg">{`(See More)`}</span>
        </h3>

        <ul className="flex flex-wrap gap-5 md:grid md:grid-cols-5 md:gap-6">
          {tracks[term].slice(0, 5).map((item, index) => (
            <SingleTrack
              key={`${term}-${item.id}`}
              track={item}
              number={index + 1}
            />
          ))}
        </ul>
      </motion.div>
    </Container>
  );
}
