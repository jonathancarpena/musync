import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { API } from '../../../utils/constants';
import { User } from '../../../utils/types';
import { MiniLoader } from '../Layout';
import { useUser } from '../../context/UserContext';

export default function Logout() {
  const { user } = useUser();
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const divInput = useRef<HTMLDivElement>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[] | []>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  useEffect(() => {
    if (input.trim() === '') {
      setFilteredUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API.user.search}/?username=${input}&userDisplay=${user?.display_name}&userId=${user?.id}`
        );
        const data = await response.json();
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setLoading(false);
    };

    // Debounce the API call to prevent too many requests
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300); // Adjust the delay as needed (300ms is a good default)

    return () => clearTimeout(delayDebounce);
  }, [input, user?.display_name, user?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        divInput.current &&
        !divInput.current.contains(event.target as Node)
      ) {
        setIsFocused(false); // Remove focus when clicking outside
      }
    }

    if (isFocused) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFocused]);

  // justin.guzman-us
  return (
    <div
      ref={divInput}
      className="absolute top-2 left-0 lg:top-3 lg:left-3 z-50 flex"
    >
      <div className="bg-white text-neutral-900 p-2 rounded-md text-sm flex">
        <input
          className="min-w-full focus:outline-none focus:ring-0"
          onFocus={() => setIsFocused(true)}
          value={input}
          onChange={handleChange}
          placeholder="Who do you wanna see?"
        />
      </div>

      {/* Results */}
      {isFocused && input && (
        <div className="bg-white w-full text-black absolute top-[110%] rounded-md flex items-center">
          {loading && <MiniLoader />}
          {!loading && (
            <>
              {filteredUsers.length ? (
                <ol className="w-full h-full rounded-md bg-white">
                  {filteredUsers.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/user/compare/${item.id}`}
                        className="flex p-2 items-center space-x-2 hover:bg-neutral-100 rounded-md"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          {item.images.length ? (
                            <img
                              src={item.images[0].url}
                              alt={`${item.display_name}`}
                            />
                          ) : (
                            <div>NONE</div>
                          )}
                        </div>

                        <div className="flex flex-col -space-y-1">
                          <span className="text-sm block">
                            {item.display_name}
                          </span>
                          <span className="text-xs text-neutral-500">
                            #{item.id}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : (
                <span className="text-sm text-neutral-500 p-2">
                  They don't exist
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
