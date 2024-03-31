import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Profile } from "./pages/Profile";
import { GetStarted } from "./pages/GetStarted";
import { Home } from "./pages/Home";

// pnpm add @material-tailwind/react
// mui

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/home" element={<Home />} />
				<Route path="/get-started" element={<GetStarted />} />
				<Route path="/profile" element={<Profile />} />
			</Routes>
		</Router>
	);
};

export default App;