import { useEffect } from "react";
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';

//image
import linkIcon from '../../src/image/utils/link.png'

// css
import classnames from 'classnames';
import BaseCSS from "../../styles/base.module.css";

// page components
import SmallModal from '../modal/SmallModal'

function Footer() {

    const dispatch = useDispatch();
    const { smallModalBool } = useSelector((state) => state.modal);

    useEffect(() => {
        async function loadCrate() {
            const result = await import("@widgetbot/crate");
            const Crate = await result.cdn();

            new Crate({
                server: "888688918944423937",
                channel: "888719948178919464",
            });
        }

        loadCrate();
    }, []);

    return (
        <>
            {
                smallModalBool
                    ?
                    <SmallModal modalTemplate="justAlert" />
                    :
                    null
            }
            <div className={BaseCSS.footer}>
                <div className={classnames(BaseCSS.footerLogoBox, "neonShine")} onClick={() => window.open("https://linktr.ee/klaychicken")}>
                    <div className={BaseCSS.footerLogoImageBox}>
                        <Image className="image100" src={linkIcon} alt="" />
                    </div>
                    <span className={BaseCSS.footerLogoTitle}>
                        KlayChicken LinkTree
                    </span>
                </div>
                <div className={BaseCSS.copyright}>
                    <b id="notoSans">ⓒ</b> 2022. KlayChicken Team. all rights reserved.
                </div>
            </div>
        </>
    );
}

export default Footer;