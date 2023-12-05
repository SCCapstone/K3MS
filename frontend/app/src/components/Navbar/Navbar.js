import './navbar.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import { LOGOUT_URL } from '../../config';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate()
  const { user, userDispatch } = useAuthContext()

  const logout = async (e) => {
    e.preventDefault()

    const response = await fetch(LOGOUT_URL, {
      credentials: 'include'
    })

    if (response.ok) {
      // update the auth context and remove from local storage
      userDispatch({type: 'LOGOUT'})

      // Navigate to login
      navigate('/login', { state: { mssg: 'Logged Out', status: 'ok' }})
    }
  }


  return (
    <div className="navbar">
      <p>Navbar</p>
      <p>{ user ? user.email : '' }</p>
      <button onClick={ (e) => navigate('/research-info') }>Research Info</button>
      <button onClick={ (e) => navigate('/dashboard') }>Dashboard</button>
      <button onClick={ (e) => navigate('/student-evals') }>Students Evals</button>
      <button onClick={ (e) => navigate('/grantupload') }>Grant Upload</button>
      <button onClick={ (e) => logout(e) }>Log out</button>
    </div>
  )
}

export default Navbar;