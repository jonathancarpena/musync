import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '../../context/UserContext';
import { API } from '../../../utils/constants';

type ToggleSwitchProps = {
  checked?: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
};

const ToggleSwitch = ({
  checked = true,
  onChange,
  label,
  disabled = false,
}: ToggleSwitchProps) => {
  return (
    <label className="flex items-center cursor-pointer space-x-3">
      {label && <span className="text-sm ">{label}</span>}
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-300 ${
            checked ? 'bg-blue-600' : 'bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        ></div>
        <div
          className={`dot absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            checked ? 'translate-x-5' : ''
          }`}
        ></div>
      </div>
    </label>
  );
};

export default function Menu() {
  const { logoutUser, user } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [allow, setAllow] = useState(user?.allowSharedPlaylist);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // const handleDeleteProfile = () => {
  //   alert('Delete profile clicked');
  // };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  };

  const handleOnChange = async () => {
    if (user) {
      const curr = allow;
      setAllow(!allow);
      try {
        await fetch(
          `${API.user.allowSharedPlaylist}?access_token=${user.token}&id=${user.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ allowSharedPlaylist: !curr }),
          }
        );
      } catch (error) {
        console.error('Failed to update allowSharedPlaylist:', error);
      }
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      className="absolute top-2 right-0 lg:top-3 lg:right-3 z-50"
      ref={menuRef}
    >
      {/* Hamburger */}
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className=" bg-neutral-900 flex flex-col justify-center items-center w-9 h-9  rounded-lg hover:cursor-pointer"
      >
        <div
          className={`w-6 h-0.5 bg-white transition-transform duration-300 ease-in-out ${
            menuOpen ? 'rotate-45 translate-y-1.5' : ''
          }`}
        />
        <div
          className={`w-6 h-0.5 bg-white my-1 transition-opacity duration-200 ${
            menuOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <div
          className={`w-6 h-0.5 bg-white transition-transform duration-300 ease-in-out ${
            menuOpen ? '-rotate-45 -translate-y-1.5' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="text-neutral-900 absolute right-0 top-[110%] w-max bg-white rounded-md shadow-lg p-4 space-y-3 items-end">
          <ToggleSwitch
            checked={allow}
            onChange={handleOnChange}
            label="Allow shared playlists"
          />

          <button
            onClick={handleLogout}
            className="w-full text-sm bg-neutral-900 py-2 text-white rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
