import { formatDate } from '../../../../utils/helpers';
import { User as IUser, ComparisonResults } from '../../../../utils/types';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

interface Props {
  user: IUser;
  results: ComparisonResults;
  other?: boolean;
}

function User({ user, results, other = false }: Props) {
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
    <motion.div
      variants={childVariant}
      className={`w-1/2 py-10 rounded-b-2xl px-3 lg:rounded-3xl lg:px-6   ${
        other ? 'bg-neutral-900 text-white' : ''
      }`}
    >
      {/* Profile */}
      <div className="flex flex-col justify-center items-center mb-8">
        <Link to={`https://open.spotify.com/user/${user.id}`} target="_blank">
          <div className="w-32 lg:w-60 h-auto aspect-square rounded-full overflow-hidden">
            {user.images.length ? (
              <img src={user.images[0].url} alt={user.display_name} />
            ) : (
              <span>None</span>
            )}
          </div>
        </Link>

        <div className="text-center mt-1 lg:mt-2">
          <p className="text-lg lg:text-xl font-bold">{user.display_name}</p>
          <p className="text-xs text-neutral-500">#{user.id}</p>
          {user.dateReceived && (
            <p className="text-xs text-neutral-500 italic">{`on ${formatDate(
              user.dateReceived
            )}`}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center items-center space-y-12 lg:space-y-10">
        {/* Top Artists */}
        <div>
          <h3 className="text-2xl text-center font-black mb-1">Top Artists</h3>
          <ol className="flex space-y-3 flex-col lg:space-y-0 lg:flex-row lg:space-x-3 justify-center items-center">
            {[0, 1, 2].map(
              (item) =>
                user.topData && (
                  <li
                    key={`${user.id}-${item}-topArtists`}
                    className="w-11/12 lg:w-1/3 h-auto aspect-square"
                  >
                    <Link
                      to={`https://open.spotify.com/artist/${user.topData.top_artists['short_term'][item].id}`}
                      target="_blank"
                      className=""
                    >
                      <img
                        src={
                          user.topData.top_artists['short_term'][item].images[0]
                            .url
                        }
                        alt={user.topData.top_artists['short_term'][item].name}
                        className="w-full aspect-square h-auto"
                      />
                      <p className="text-xs text-center mt-1 truncate">
                        {user.topData.top_artists['short_term'][item].name}
                      </p>
                    </Link>
                  </li>
                )
            )}
          </ol>
        </div>

        {/* Top Tracks */}
        <div>
          <h3 className="text-2xl text-center font-black mb-1">On Repeat</h3>
          <ol className="flex space-y-3 flex-col lg:space-y-0 lg:flex-row lg:space-x-3 justify-center items-center">
            {[0, 1, 2].map(
              (item) =>
                user.topData && (
                  <li
                    key={`${user.id}-${item}-topArtists`}
                    className="w-11/12 lg:w-1/3 h-auto aspect-square"
                  >
                    <Link
                      to={`https://open.spotify.com/track/${user.topData.top_tracks['short_term'][item].id}`}
                      target="_blank"
                      className=""
                    >
                      <img
                        src={
                          user.topData.top_tracks['short_term'][item].album
                            .images[0].url
                        }
                        alt={user.topData.top_tracks['short_term'][item].name}
                        className="w-full aspect-square h-auto"
                      />
                      <p className="text-xs text-center mt-1 truncate">
                        {user.topData.top_tracks['short_term'][item].name}
                      </p>
                    </Link>
                  </li>
                )
            )}
          </ol>
        </div>

        {/* Top Genre */}
        <div>
          <h3 className="text-2xl text-center font-black mb-1">Top Genres</h3>

          {user.topData && (
            <ol className="flex flex-wrap space-x-1 justify-center w-11/12 lg:w-4/5 mx-auto min-h-28 max-h-28 lg:min-h-12 lg:max-h-12 overflow-hidden">
              {Object.entries(user.topData.top_genres['short_term']).map(
                ([genre]) => (
                  <li
                    key={`${user.id}-${genre}-topGenre`}
                    className="text-xs after:content-[','] last:after:content-none"
                  >
                    {genre}
                  </li>
                )
              )}
            </ol>
          )}
        </div>

        {/* Popularity Score */}
        <div className="text-center">
          <h3 className="text-2xl font-black">Mainstream Meter:</h3>
          <p className="text-xs text-neutral-400 my-1 italic font-light">
            Based on the average popularity of your top tracks
          </p>
          <span className="text-7xl font-black leading-15">{`${Math.floor(
            results.popularity[other ? 'userB' : 'userA']
          )}`}</span>
        </div>

        {/* Time Travel */}
        <div className="text-center">
          <h3 className="text-2xl font-black">Enjoys Music from:</h3>
          <p className="text-xs text-neutral-400 my-1 italic font-light">
            Based on the average release year of your top tracks
          </p>
          <span className="text-7xl font-black leading-10">{`${Math.floor(
            results.timeTravel[other ? 'userB' : 'userA'].averageReleaseYear
          )}`}</span>
        </div>

        {/* Explicit */}
        <div className="text-center">
          <h3 className="text-2xl font-black">Explicit Content:</h3>
          <p className="text-xs text-neutral-400 my-1 italic font-light">
            Based on the ratio of explicit tracks in your top tracks
          </p>
          <span className="text-7xl font-black leading-17">{`${Math.floor(
            results.explicit[other ? 'userB' : 'userA']
          )}%`}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default User;
