import styles from './style.module.css';
import NavBar from './NavBar';
import TopNaveBar from './TopNaveBar';
import { useEffect, useState } from 'react';

const Header = () => {

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    useEffect(() => {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  return (
    <header className={`${isMobile ? "mobile-header" : "desktop-header"} ${styles.headerMain} ff`}>
      <TopNaveBar />
      <NavBar />
    </header>
  );

};

export default Header;