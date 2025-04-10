import { TimeRange, TimeTerms } from './types';

type TimeRangeTerms = {
  [key in TimeRange]: TimeTerms;
};

export const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

export const timeRangeTerms: TimeRangeTerms = {
  short_term: 'the past month',
  medium_term: 'the past 6 months',
  long_term: 'of all time',
};

export const API = {
  auth: {
    login: `${BACKEND_URL}/auth/login`,
    callback: `${BACKEND_URL}/auth/callback`,
  },
  user: {
    'top-data': `${BACKEND_URL}/user/top-data`,
    profile: `${BACKEND_URL}/user/profile`,
    'save-playlist': `${BACKEND_URL}/user/save-playlist`,
    compare: `${BACKEND_URL}/user/compare`,
    save: `${BACKEND_URL}/user/save`,
    search: `${BACKEND_URL}/user/search`,
    allowSharedPlaylist: `${BACKEND_URL}/user/allowSharedPlaylist`,
  },
};
