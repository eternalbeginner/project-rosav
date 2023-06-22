import decode from 'jwt-decode';
import { createContext, useState } from 'react';

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    if (window.localStorage) {
      const oldToken = JSON.parse(window.localStorage.getItem('rosav-token'));
      if (oldToken !== null) return oldToken;
      return null;
    }

    return null;
  });

  function auth() {
    if (!isAuthenticated()) return null;
    return decode(token.accessToken);
  }

  function setAuth({ accessToken, refreshToken }) {
    setToken(() => {
      if (window.localStorage) {
        window.localStorage.setItem('rosav-token', JSON.stringify({ accessToken, refreshToken }));
        return { accessToken, refreshToken };
      }

      return null;
    });
  }

  function removeAuth() {
    setToken(() => {
      if (window.localStorage) {
        if (isAuthenticated()) window.localStorage.removeItem('rosav-token');
        return null;
      }

      return null;
    });
  }

  function isAuthenticated() {
    return token !== null;
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        removeAuth,
        isAuthenticated,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
