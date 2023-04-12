import {Link} from 'react-router-dom';
import {auth} from '../../config/firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
// import {signOut} from 'firebase/auth';
import './Navbar.css';

const Navbar = () => {

    const [user] = useAuthState(auth);
    console.log(user?.photoURL)



    return (
        <div className='navbar'>
            <Link to="/">Home</Link>
            {!user ? <div className='loginDiv'>
                <Link to="/login">Login</Link>
            </div> : <Link to="/createpost">Create Post</Link>}

            {user && <div className='userDiv'>
                <p>{user?.displayName}</p>
                <img src={user?.photoURL || ""} alt="profile" />
                <button onClick={() => auth.signOut()}>Sign Out</button>
            </div>}

        </div>
    )
}

export default Navbar;