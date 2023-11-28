import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

function App() {

  const { user, checkedStorage } = useAuthContext()

  return (
    checkedStorage ? 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ user ? <Dashboard /> : <Login /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/dashboard" element={ <Dashboard /> } />
        <Route path="*" element={ user ? <Dashboard /> : <Login /> } />
      </Routes>
    </BrowserRouter>
    : <p>Loading...</p>
  );
}

export default App;
