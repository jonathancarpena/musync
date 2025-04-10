import { Artist, TopArtists } from '../../../utils/types';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useUser } from '../../context/UserContext';
import { Container } from '../Layout';
import { Link } from 'react-router';

interface SingleArtistProps {
  artist: Artist;
  number: number;
  fullPage?: boolean;
}

export function SingleArtist({
  artist,
  number,
  fullPage = false,
}: SingleArtistProps) {
  return (
    <Link
      to={`https://open.spotify.com/artist/${artist.id}`}
      target="_blank"
      className={`${
        fullPage ? 'mx-auto md:w-full' : 'w-[45%] mx-auto md:w-full'
      }`}
    >
      <li className="w-full">
        <div
          className={` h-auto w-full relative ${
            fullPage ? 'aspect-square md:aspect-[3/4]' : 'aspect-[3/4]'
          }`}
        >
          <div className="overflow-hidden rounded-full w-full h-full ">
            {artist.images ? (
              <img
                src={artist.images[0].url}
                alt={`pic-of-${artist.name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>None</span>
            )}
          </div>

          <div
            className={`absolute -bottom-3 md:-right-3  flex justify-center items-center drop-shadow-md`}
          >
            <span
              className={`text-white font-bold font-shoulders ${
                fullPage ? 'text-6xl md:text-8xl lg:text-9xl' : 'text-9xl'
              }`}
            >
              <span
                className={`${
                  fullPage ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-6xl'
                }`}
              >
                #
              </span>
              {number}
            </span>
          </div>
        </div>

        <p className="text-center  text-neutral-800 mt-3 md:mt-4 font-medium md:text-lg truncate">
          {artist.name}
        </p>
      </li>
    </Link>
  );
}

interface ArtistsProps {
  artists: TopArtists;
}

export default function Artists({ artists }: ArtistsProps) {
  const { term } = useUser();
  const navigate = useNavigate();
  const handleOnClick = () => {
    if (artists[term].length > 5) {
      navigate('/user/top-artists');
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
    exit: {
      opacity: 0,
    },
  };
  return (
    <Container>
      <motion.div variants={childVariant} className={'relative mb-10 md:mb-20'}>
        <h3
          onClick={handleOnClick}
          className="text-6xl text-center lg:text-start lg:text-7xl font-black md:mb-5 mb-6 cursor-pointer lg:w-max flex flex-col lg:flex-row lg:items-end "
        >
          <span>Top Artists</span>
          <span className=" text-neutral-400 ml-3 text-lg">{`(See More)`}</span>
        </h3>

        <ul className="flex flex-wrap gap-5 md:grid md:grid-cols-5 md:gap-6">
          {artists[term].slice(0, 5).map((item, index) => (
            <SingleArtist
              key={`${term}-${item.id}`}
              artist={item}
              number={index + 1}
            />
          ))}
        </ul>
      </motion.div>
    </Container>
  );
}
