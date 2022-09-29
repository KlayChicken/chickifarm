import Image from 'next/image'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// banner
import banner0 from "../../src/image/banner/banner0.png";
import banner2 from "../../src/image/banner/banner2.png";
import banner3 from "../../src/image/banner/banner3.png";

// styles
import HomeCSS from '../../styles/Home.module.css';

function HomeSmall_ad() {

    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    };

    return (
        <div className={HomeCSS.homeBannerBox}>
            <Slider {...settings} >
                <div className={HomeCSS.bannerImageBox}>
                    <Image className="image100" src={banner0} alt="" />
                </div>
                <div className={HomeCSS.bannerImageBox}>
                    <Image className="image100" src={banner2} alt="" />
                </div>
                <div className={HomeCSS.bannerImageBox} onClick={() => window.open("https://discord.gg/7tCEJAt7FF")}>
                    <Image className="image100" src={banner3} alt="" />
                </div>
            </Slider>
        </div>
    )
}

export default HomeSmall_ad;