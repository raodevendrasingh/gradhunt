import Spinner from "./Spinner";

interface FormFooterProps {
	isLoading: boolean;
	formId: string;
}
export const FormFooter = ({ isLoading, formId }: FormFooterProps) => {
	return (
		<div className="flex items-center justify-end mt-3 rounded-b">
			<button
				className="flex items-center justify-center bg-zinc-800 w-28 text-white active:bg-zinc-900 font-semibold border rounded-[10px] text-sm px-4 py-2.5 shadow hover:shadow-xl outline-none focus:outline-none cursor-pointer ease-linear transition-colors duration-150"
				type="submit"
				form={formId}
				disabled={isLoading}
			>
				{isLoading ? (
					<span className="flex items-center">
						<span className="mr-2">Saving</span>
						<Spinner />
					</span>
				) : (
					"Save"
				)}
			</button>
		</div>
	);
};
