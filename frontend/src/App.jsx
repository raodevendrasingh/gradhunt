import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Profile } from "./pages/Profile";
import { GetStarted } from "./pages/GetStarted";
import { Home } from "./pages/Home";
import NotFound from "./pages/NotFound";
import { CandidateForm } from "./pages/CandidateForm";
import { ManagerForm } from "./pages/ManagerForm";
import { UserSettings } from "./pages/UserSettings";


const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/home" element={<Home />} />
				<Route path="/get-started" element={<GetStarted />} />
                <Route path="/get-started/cad" element={<CandidateForm/>} />
                <Route path="/get-started/hrm" element={<ManagerForm/> } />
				<Route path="/profile/*" element={<Profile />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
};

export default App;
