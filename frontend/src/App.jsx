import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

//Adapter Imports
import { checkForLoggedInUser } from "./adapters/auth-adapter";

//Page Imports
import HomePage from "./pages/Home.jsx";
import SignUpPage from "./pages/SignUp.jsx";
import LoginPage from "./pages/Login.jsx";
import EditAccountPage from "./pages/EditAccountPage.jsx";
// import YourProgramsPage from "./pages/YourPrograms.jsx";
// import AddProgramPage from "./pages/edit/org/AddProgram.jsx";
// import EditProgramPage from "./pages/edit/org/EditProgram.jsx";
import AllProgramsPage from "./pages/AllProgramsList.jsx";
import IndividualProgramPage from "./pages/IndividualProgramPage.jsx";
import NotFoundPage from "./components/NotFound.jsx";
import AccessDeniedPage from "./components/AccessDenied.jsx";
import ProgramsAddPage from "./pages/ProgramsAddPage.jsx";
import AboutPage from "./pages/About.jsx";

// import UsersPage from './pages/Users';
// import UserPage from './pages/User';

//Component Imports
import UserContext from "./contexts/current-user-context";
import SiteHeadingAndNav from "./components/SiteHeadingAndNav";
import Footer from "./components/Footer.jsx";
import { getOrganization } from "./adapters/organization-adapter.js";
import { getUser } from "./adapters/user-adapter.js";
import MakeComment from "./components/MakeComment.jsx";
import EditProgramPage from "./pages/EditProgramPage.jsx";

export default function App() {
  const { setCurrentUser } = useContext(UserContext);
  useEffect(() => {
    // const getAccount = async () => {
    //   const [org, id] = await checkForLoggedInUser();
    //   console.log(org,id)
    //   if (id === -1) {
    //     return setCurrentUser(null);
    //   }
    //   if (org) {
    //     return setCurrentUser(await getOrganization(id));
    //   }
    //   return setCurrentUser(await getUser(id))

    // };
    // getAccount();
  }, []);

  return (
    <>
      <SiteHeadingAndNav />
      <main>
        <Routes>
          {/* home page */}
          <Route path="/" element={<HomePage />} />
          {/* signing/logging in */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* edit stuff */}
          <Route path="/edit" element={<EditAccountPage />} />
          {/* <Route
            path="/edit/orgs/:org-id/programs"
            element={<YourProgramsPage />}
          /> */}
          {/* <Route
            path="/edit/orgs/:org-id/programs/add"
            element={<AddProgramPage />}
          /> */}
          {/* <Route
            path="/edit/orgs/:org-id/programs/:program-id"
            element={<EditProgramPage />}
          /> */}
          {/* Programs */}
          <Route path="/opportunities" element={<AllProgramsPage />} />
          <Route path="/opportunities/:id" element={<IndividualProgramPage />} />
          <Route path="/opportunities/:id/edit" element={<EditProgramPage />} />
          <Route path="/opportunities/add" element={<ProgramsAddPage />} />
          {/* Misc */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="/make-comment" element={<MakeComment/>}/>
          <Route path="/*" element={<NotFoundPage />} />
          {/* <Route path='/users' element={<UsersPage />} />
        <Route path='/users/:id' element={<UserPage />} /> */}
          {/* critikal error!!! */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
