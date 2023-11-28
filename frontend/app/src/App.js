import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import MainLayout from './components/MainLayout/MainLayout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';


function App() {

  const { user, checkedStorage } = useAuthContext()

  const defaultPage = (
    user ? 
    <MainLayout>
      <Dashboard />
    </MainLayout>
    : <Login />
  )

  const getMainLayoutPage = (page) => {
    return (
      <MainLayout>
        { page }
      </MainLayout>
    )
  }

  return (
    checkedStorage ? 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ defaultPage } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/dashboard" element={ getMainLayoutPage(<Dashboard />) } />
        <Route path="*" element={ defaultPage } />
      </Routes>
    </BrowserRouter>
    : <p>Loading...</p>
  );
}

export default App;
