import { createContext, useContext, useState } from 'react';

const AnimationContext = createContext({
  navbarRef: null,
  setNavbarRef: () => {},
  heroRef: null, 
  setHeroRef: () => {}
});

export const AnimationProvider = ({ children }) => {
  const [navbarRef, setNavbarRef] = useState(null);
  const [heroRef, setHeroRef] = useState(null);

  return (
    <AnimationContext.Provider value={{ navbarRef, setNavbarRef, heroRef, setHeroRef }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);
