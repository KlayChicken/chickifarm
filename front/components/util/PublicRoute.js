import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import Home from '../../pages/index'

function PublicRoute(Component) {

    const Auth = () => {
        const router = useRouter();
        const { isUser } = useSelector((state) => state.myInfo)
        if (!isUser) {
            return <Component />;
        } else {
            return <Home />;
        }
    };

    return Auth;

}

export default PublicRoute;