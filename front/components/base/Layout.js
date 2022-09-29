// page components
import Header from './Header';
import Footer from './Footer';
import SubMenuBar from './SubMenuBar';

// css
import BaseCSS from "../../styles/base.module.css"

function Layout({ children }) {
    return (
        <>
            <span className={BaseCSS.tabletPortraitWarning} >
                가로로 회전해서 이용하시면 더 편하게 이용하실 수 있습니다.
            </span>
            <Header />
            {children}
            <Footer />
            <SubMenuBar />
        </>
    );
}

export default Layout;
