import { motion } from 'framer-motion';
import TermSelect from '../TermSelect';
import { Container } from '../Layout';
import { formatDate } from '../../../utils/helpers';
import { useUser } from '../../context/UserContext';
import Genres from './Genres';
import { Link } from 'react-router';
import Menu from './Menu';
import Search from './Search';

function Profile() {
  const { user } = useUser();
  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  return (
    <>
      <Container>
        {user && (
          <motion.div
            variants={variants}
            className={
              'flex flex-col justify-center items-center pt-18 lg:pt-14 pb-5 relative z-10 '
            }
          >
            <Search />
            <Menu />
            <motion.div className="relative">
              {/* Image */}
              <div
                className={`w-60 h-60 mx-auto rounded-full overflow-hidden relative z-20 ${
                  user?.topData
                    ? ''
                    : 'hover:cursor-pointer active:scale-90 transition-all'
                }`}
              >
                {user.images.length ? (
                  <img
                    src={user.images[0].url}
                    alt={`pic-of-${user.display_name}`}
                  />
                ) : (
                  <div>NONE</div>
                )}
              </div>

              {user?.topData?.top_genres && (
                <Genres
                  genres={user.topData.top_genres}
                  right
                  sx={'bottom-1/2 -translate-y-1'}
                />
              )}

              {user?.topData?.top_genres && (
                <Genres
                  genres={user.topData.top_genres}
                  right={false}
                  sx={'top-1/2 translate-y-1'}
                />
              )}
            </motion.div>

            {user?.topData && (
              <>
                <div className="mt-4 text-center -mb-1 ">
                  <Link
                    to={`https://open.spotify.com/user/${user.id}`}
                    target="_blank"
                  >
                    <h2 className="text-3xl lg:text-4xl  xl:text-5xl xl:mb-1 font-bold ">
                      {user.display_name}
                    </h2>
                    <h3 className="mb-1 xl:mb-1 text-xs lg:text-sm">
                      #{user.id}
                    </h3>
                  </Link>

                  {user.dateReceived && (
                    <h3 className="font-medium text-neutral-400 lg:text-sm text-xs xl:text-base italic">
                      on {formatDate(user.dateReceived)}
                    </h3>
                  )}
                </div>

                <TermSelect sx={'text-base text-center'} />
              </>
            )}
          </motion.div>
        )}
      </Container>
    </>
  );
}

export default Profile;
