import HomeBig from '../components/home/HomeBig';
import HomeSmall_announce from '../components/home/HomeSmall_announce';
import HomeSmall_commu from '../components/home/HomeSmall_commu';
import HomeSmall_ad from '../components/home/HomeSmall_ad';

// store
import { getAnnounce } from '../store/modules/etc'
import { wrapper } from '../store';

// styles
import HomeCSS from '../styles/Home.module.css';

function Home() {

  return (
    <>
      <div className="mainBoard home_mobile">
        <div className="subBoard_big">
          <HomeBig />
        </div>
        <div className="subBoard_small">
          <div className={HomeCSS.homeUtilBox}>
            <HomeSmall_announce />
            <HomeSmall_commu />
            <HomeSmall_ad />
          </div>
        </div >
      </div >
    </>
  );
}

export default Home;

export const getServerSideProps = wrapper.getServerSideProps((store) =>
  async () => {
    await store.dispatch(getAnnounce());
  })