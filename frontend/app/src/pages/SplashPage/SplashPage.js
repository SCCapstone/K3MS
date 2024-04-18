import USCLogo from '../../assets/navbar-usc-logo.svg';
import DashboardScreenshot from '../../assets/splashPageScreenshots/dashboard.png';
import CourseAnalyticsScreenshot from '../../assets/splashPageScreenshots/courseAnalytics.png';
import ResearchInfoScreenshot from '../../assets/splashPageScreenshots/researchInfo.png';
import TeamAssessmentScreenshot from '../../assets/splashPageScreenshots/teamAssessments.png';
import { useNavigate } from "react-router-dom";
import './splash-page.css';

const SplashPage = () => {
  const navigate = useNavigate()
  const onClickLogin = () => {
    navigate('/login')
  }

  const LinkedInIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="splashPageIcon" viewBox="0 0 16 16">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
      </svg>
    )
  }

  const GithubIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="splashPageIcon" viewBox="0 0 16 16">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    )
  }

  return (
    <div className="splash">
      <div className="spashPageHeader">
        <div className="spashPageLogo">
          <img src={ USCLogo } alt="SC Logo" className="splashPageLogo" />
        </div>
        <button className="splashPageLoginButton" onClick={ onClickLogin }>Login</button>
      </div>
      <div className="splashPageFirstSection">
        <div className="splashPageFirstSectionHeader">
          <h1>USC Faculty Dashboard</h1>
          <h2>For All Your Academic Managing Needs</h2>
        </div>
        <div className="spashPageFirstSectionImage">
          <img src={ DashboardScreenshot } alt="App Screenshot" className="dashboardScreenshot" />
        </div>
      </div>
      <div className="splashPageSignup">
        <h1>Want In? Request an Account From Your Department Head Today!</h1>
      </div>
      <div className="splashPageFeatures">
        <div className="splashPageFeature">
          <img src={ CourseAnalyticsScreenshot } alt="splashPageFeature 1" className="splashPageFeatureScreenshot" />
          <h2>Visualize</h2>
          <p>
            Comprehensive plots provide a visual representation of the performance of your team. Easily identify trends and patterns in their performance.
          </p>
        </div>
        <div className="splashPageFeature">
          <img src={ ResearchInfoScreenshot } alt="splashPageFeature 2" className="splashPageFeatureScreenshot" />
          <h2>Summarize</h2>
          <p>
            Summarize your research information and easily access it. Keep track of your and your team's research grants, publications, and expenditures.
          </p>
        </div>
        <div className="splashPageFeature">
          <img src={ TeamAssessmentScreenshot } alt="splashPageFeature 3" className="splashPageFeatureScreenshot" />
          <h2>Analyze</h2>
          <p>
            Analyze your team's performance and provide feedback. Easily manage your team's assessments and track their progress on an individual scale.
          </p>
        </div>
      </div>
      <div className="splashPageSection splashPageAbout">
        <h1>About</h1>
        <p>
          USC Faculty Dashboard is a web application designed to revolutionize how department heads and professors monitor and make decisions, providing a centralized hub for efficient data storage and analysis. Currently, there's a gap in web applications tailored for department heads to concisely manage the performance of their department, which our platform aims to fill. We offer easy access to student evaluation and research information, empowering department heads to evaluate the performance of their department members and seamlessly track their research grants, publications, and expenditures. Professors and instructors gain personalized performance analysis tools, with full access to their own data as well as curated access to peer data to assess their relative performance.
        </p>
      </div>
      <div className="splashPageSection splashPageDemo">
        <h1>Demo</h1>
        <iframe width="420" height="315"
          src="https://www.youtube.com/embed/tgbNymZ7vqY">
        </iframe>
        <h2>
          See demo to experience the USC Faculty Dashboard in action!
        </h2>
      </div>
      <div className="splashPageSection splashPageTeam">
        <h1>Meet the Developers</h1>
        <div className="splashPageTeamMembers">
          <div className="splashPageTeamMember">
            <div>
              <h2>Musa Azeem</h2>
              <p>musa.mazeem@gmail.com</p>
            </div>
            <a className="splashPageTeamMemberLinkedIn" href="https://www.linkedin.com/in/mmazeem" target="_blank">
              <LinkedInIcon />
            </a>
            <a className="splashPageTeamMemberGithub" href="https://github.com/Musa-Azeem" target="_blank">
              <GithubIcon />
            </a>
          </div>
          <div className="splashPageTeamMember">
            <div>
              <h2>Muhammad Tukhtasunov</h2>
              <p>tukhtasm@email.sc.edu</p>
            </div>
            <a className="splashPageTeamMemberLinkedIn" href="https://www.linkedin.com/in/muhammad-tukhtasunov/" target="_blank">
              <LinkedInIcon />
            </a>
            <a className="splashPageTeamMemberGithub" href="https://github.com/MuhammadTukhtasunov" target="_blank">
              <GithubIcon />
            </a>
          </div>
          <div className="splashPageTeamMember">
            <div>
              <h2>Savannah Noblitt</h2>
              <p>snoblitt@email.sc.edu</p>
            </div>
            <a className="splashPageTeamMemberLinkedIn" href="https://www.linkedin.com/in/savannahnoblitt" target="_blank">
              <LinkedInIcon />
            </a>
            <a className="splashPageTeamMemberGithub" href="https://github.com/SavannahNoblitt" target="_blank">
              <GithubIcon />
            </a>
          </div>
          <div className="splashPageTeamMember">
            <div>
              <h2>Mitchel Jonker</h2>
              <p>mjonker@email.sc.edu</p>
            </div>
            <a className="splashPageTeamMemberLinkedIn" href="https://www.linkedin.com/in/jonker-mitchell/" target="_blank">
              <LinkedInIcon />
            </a>
            <a className="splashPageTeamMemberGithub" href="https://github.com/mcjonker" target="_blank">
              <GithubIcon />
            </a>
          </div>
          <div className="splashPageTeamMember">
            <h2></h2>
          </div>
          <div className="splashPageTeamMember">
            <div>
              <h2>Kevin Protzman</h2>
              <p>kwprotz@gmail.com</p>
            </div>
            <a className="splashPageTeamMemberLinkedIn" href="https://www.linkedin.com/in/kevin-protzman-661709217/" target="_blank">
              <LinkedInIcon />
            </a>
            <a className="splashPageTeamMemberGithub" href="https://github.com/k-protz" target="_blank">
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="footer">
        <p>Copyright &copy; 2024 K3MS Inc.</p>
        <div className="splashPageSourceCode">
          <p>
            Source Code
          </p>
          <a href="https://github.com/SCCapstone/K3MS" target="_blank">
            <GithubIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

export default SplashPage;