import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import SignUp from '../../pages/signUp'

function PrivateRoute(Component) {

    const Auth = () => {
        const router = useRouter();
        const { isUser } = useSelector((state) => state.myInfo)
        if (!isUser) {
            return <SignUp />
        } else {
            return <Component />;
        }
    };

    return Auth;

}

export default PrivateRoute;