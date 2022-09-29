import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
// Image
import questionIcon_white from "../../../src/image/utils/question_white.png";

// page components
import CreateRaffle_NFTList from './CreateRaffle_NFTList';

function CreateRaffleBig({ setRaffleNft }) {

    return (
        <>
            <div className="subBoard_big">
                <div className="pageHeaderBox">
                    <div className="pageTitleBox">
                        <Link href="/">
                            <span className="pageTitle">
                                HOME
                            </span>
                        </Link>
                        <span className="pageTitleArrow">
                            &gt;
                        </span>
                        <Link href="/raffle">
                            <span className="pageTitle">
                                래플
                            </span>
                        </Link>
                        <span className="pageTitleArrow">
                            &gt;
                        </span>
                        <span className="pageTitle">
                            래플 생성
                        </span>
                    </div>
                    <div className="pageUtilBox">
                        <div id="balloon_light" balloon="래플 가이드 보기" className="pageUtilIconBox" onClick={() => window.open('https://klayproject.notion.site/021431fde9c44c88882dd016fabcd1ed')}>
                            <Image className="pageUtilIcon" src={questionIcon_white} alt="" />
                        </div>
                    </div>
                </div>
                <div className="pageContentBox">
                    <CreateRaffle_NFTList setRaffleNft={setRaffleNft} />
                </div>
            </div>
        </>
    );
}

export default CreateRaffleBig;