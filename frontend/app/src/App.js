import MainLayout from './components/MainLayout/MainLayout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import StudentEvaluations from './pages/StudentEvaluations/StudentEvaluations';
import StudentEvaluationsDetails from './pages/StudentEvaluationsDetails/StudentEvaluationsDetails';
import ResearchInfo from './pages/ResearchInfo/ResearchInfo';
import GrantUpload from './pages/GrantUpload/GrantUpload';
import EvalUpload from './pages/EvalUpload/EvalUpload';
import AccountSettings from './pages/AccountSettings/AccountSettings';
import UserAdmin from './pages/UserAdmin/UserAdmin';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import './pages/main_pages.css'
import PubUpload from './pages/PubUpload/PubUpload';

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
        <Route path="/student-evals" element={ getMainLayoutPage(<StudentEvaluations />) } />
        <Route path="/student-evals-details" element={ getMainLayoutPage(<StudentEvaluationsDetails />) } />
        <Route path="/research-info" element={ getMainLayoutPage(<ResearchInfo />) } />
        <Route path="/grantupload" element={ getMainLayoutPage(<GrantUpload />) } />
        <Route path="/pubupload" element={ getMainLayoutPage(<PubUpload />) } />
        <Route path="/evalupload" element={ getMainLayoutPage(<EvalUpload />) } />
        <Route path="/account-settings" element={ getMainLayoutPage(<AccountSettings />) } />
        <Route path="/useradmin" element={ getMainLayoutPage(<UserAdmin />) } />
        <Route path="*" element={ defaultPage } />
      </Routes>
    </BrowserRouter>
    : <p>Loading...</p>
  );
}

export default App;
