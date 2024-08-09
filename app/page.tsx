import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import styles from '../styles/Home.module.css';


export default function Home() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <MainContent />
      </div>
    </div>
  );
}
