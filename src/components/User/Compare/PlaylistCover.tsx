import { Track } from '../../../../utils/types';
import { Link } from 'react-router';
import { useState } from 'react';

interface Props {
  tracks: Track[];
  userA: { image: string; id: string };
  userB: { image: string; id: string };
  savePlaylist: () => void;
}

function PlaylistCover({ tracks, userA, userB, savePlaylist }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center relative w-2/3 lg:w-auto lg:mx-6 mx-auto">
      <div className="grid grid-cols-2 w-full lg:w-62 aspect-square h-auto">
        {tracks.slice(0, 4).map((item, index) => (
          <div key={index} className="">
            <img src={item.album.images[0].url} alt={item.name} />
          </div>
        ))}
      </div>

      <div className="flex space-x-3 mt-2 text-sm w-full lg:w-62">
        <button
          className="w-full bg-white text-neutral-900 rounded-sm py-1.5 hover:cursor-pointer hover:bg-neutral-100 transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          view tracklist
        </button>
        <button
          onClick={savePlaylist}
          className="w-full bg-neutral-900 text-white rounded-sm py-1.5 hover:cursor-pointer hover:bg-neutral-950 transition-all"
        >
          add to library
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50">
          <div className="bg-white lg:rounded-md w-full max-w-md max-h-screen lg:max-h-[80vh] overflow-y-auto relative">
            <div className="sticky top-0 z-20 bg-neutral-900 text-white p-3 flex justify-between items-center mb-1">
              <h2 className="text-lg font-semibold ">Tracklist</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:cursor-pointer"
              >
                ✕
              </button>
            </div>

            <ul className="space-y-0 py-1">
              {tracks.map((track, index) => (
                <li key={track.id} className="px-3 py-1 flex space-x-2">
                  <Link
                    to={`https://open.spotify.com/track/${track.id}`}
                    target="_blank"
                  >
                    <div className="aspect-square w-12 h-auto relative min-w-12">
                      <img
                        src={track.album.images[0].url}
                        alt={track.album.name}
                      />
                    </div>
                  </Link>

                  <div className="flex flex-col truncate w-full">
                    <Link
                      to={`https://open.spotify.com/track/${track.id}`}
                      target="_blank"
                    >
                      <span className="text-sm truncate">
                        {index + 1}. {track.name}
                      </span>
                    </Link>

                    <span className="text-sm text-neutral-500 truncate">
                      {track.artists.map((a) => a.name).join(', ')}
                    </span>
                  </div>
                  <Link
                    to={`https://open.spotify.com/user/${
                      index % 2 === 0 ? userA.id : userB.id
                    }`}
                    target="_blank"
                    className="w-9 h-9 rounded-full overflow-hidden self-center relative"
                  >
                    <div className="w-full h-full">
                      <img
                        src={index % 2 === 0 ? userA.image : userB.image}
                        alt={index % 2 === 0 ? userA.id : userB.id}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistCover;
