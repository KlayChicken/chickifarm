import Link from 'next/link';
import Image from 'next/image';

// images
import farmIcon from "../../src/image/menu/farm.png";
import farmIconGray from "../../src/image/menu/farm_gray.png";
import bankIcon from "../../src/image/menu/bank.png";
import bankIconGray from "../../src/image/menu/bank_gray.png";
import playgroundIcon from "../../src/image/menu/playground.png";
import playgroundIconGray from "../../src/image/menu/playground_gray.png";
import galleryIcon from "../../src/image/menu/gallery.png";
import galleryIconGray from "../../src/image/menu/gallery_gray.png";
import schoolIcon from "../../src/image/menu/school.png";
import schoolIconGray from "../../src/image/menu/school_gray.png";
import storeIcon from "../../src/image/menu/store.png";
import storeIconGray from "../../src/image/menu/store_gray.png";

// styles
import classnames from 'classnames';
import HomeCSS from '../../styles/Home.module.css';

function HomeBig() {
    return (
        <div className={HomeCSS.mainIconBox}>
            <Link href="/farm">
                <div className={classnames(HomeCSS.mainEachIconBox, HomeCSS.iconBoxIndigo)}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={farmIcon} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonIndigo)}>치키농장</span>
                </div>
            </Link>
            <Link href="/land">
                <div className={classnames(HomeCSS.mainEachIconBox, HomeCSS.iconBoxRed)}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={playgroundIcon} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonRed)}>치키랜드</span>
                </div>
            </Link>
            <Link href="/raffle">
                <div className={classnames(HomeCSS.mainEachIconBox, HomeCSS.iconBoxGreen)}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={galleryIcon} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonGreen)}>래플</span>
                </div>
            </Link>
            <Link href="/lab">
                <div className={classnames(HomeCSS.mainEachIconBox, HomeCSS.iconBoxPurple)}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={schoolIcon} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonPurple)}>치키연구소</span>
                </div>
            </Link>
            <Link href="/chickStore">
                <div className={classnames(HomeCSS.mainEachIconBox, HomeCSS.iconBoxBlue)}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={storeIcon} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonBlue)}>상점</span>
                </div>
            </Link>
            <Link href="/bank">
                <div className={classnames(HomeCSS.mainEachIconBox, HomeCSS.iconBoxYellow)}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={bankIcon} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonYellow)}>은행</span>
                </div>
            </Link>
            {/*
            <Link href="/">
                <div className={classnames(HomeCSS.mainEachIconBox, HomeCSS.iconBoxPurple)}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={schoolIcon} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonPurple)}>치키학교</span>
                </div>
            </Link>
            <Link href="/">
                <div className={HomeCSS.mainEachIconBox_dead}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={playgroundIconGray} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonGray)}>치키랜드</span>
                </div>
            </Link>
            
            <Link href="/">
                <div className={HomeCSS.mainEachIconBox_dead}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={schoolIconGray} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonGray)}>치키학교</span>
                </div>
            </Link>
            <Link href="/">
                <div className={HomeCSS.mainEachIconBox_dead}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={galleryIconGray} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonGray)}>은행</span>
                </div>
            </Link>
            <Link href="/">
                <div className={classnames(HomeCSS.mainEachIconBox, HomeCSS.iconBoxIndigo)}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={storeIcon} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonIndigo)}>상점</span>
                </div>
            </Link>
            <Link href="/">
                <div className={classnames(HomeCSS.mainEachIconBox, HomeCSS.iconBoxGreen)}>
                    <div className={HomeCSS.mainIconImage}>
                        <Image className="image100" src={galleryIcon} alt="" />
                    </div>
                    <span className={classnames(HomeCSS.mainIconButton, HomeCSS.iconButtonGreen)}>치키연구소</span>
                </div>
            </Link>
    */}
        </div>
    )
}

export default HomeBig;