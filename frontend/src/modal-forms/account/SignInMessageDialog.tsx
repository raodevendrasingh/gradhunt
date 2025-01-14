import { Button } from "@/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { MdLock } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const SignInMessageDialog: React.FC<{
	setShowAuthDialog: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setShowAuthDialog }) => {
	const navigate = useNavigate();

	const handleSignIn = () => {
		setShowAuthDialog(false);
		navigate("/login");
	};

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={() => setShowAuthDialog(false)}
				className="bg-slate-900/20 backdrop-blur fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
			>
				<motion.div
					initial={{ scale: 0.9, rotate: "0deg" }}
					animate={{ scale: 1, rotate: "0deg" }}
					exit={{ scale: 0, rotate: "0deg" }}
					onClick={(e) => e.stopPropagation()}
					className="bg-white p-6 rounded-2xl mx-auto w-full min-w-72 max-w-96 shadow-xl cursor-default relative overflow-hidden"
				>
					<div className="relative z-50 flex flex-col items-center text-center gap-4">
						<div className="rounded-full bg-slate-100 p-3">
							<MdLock className="w-6 h-6 text-gray-600" />
						</div>

						<div className="space-y-2">
							<h3 className="text-lg font-semibold text-gray-900">
								Log in required
							</h3>
							<p className="text-gray-500">
								You need to be logged in to perform this action
							</p>
						</div>
						<Button
							onClick={handleSignIn}
							className="w-full rounded-lg py-2.5"
						>
							Log in
						</Button>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
