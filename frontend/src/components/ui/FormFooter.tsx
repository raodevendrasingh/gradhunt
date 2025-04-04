import Spinner from "./Spinner";

interface FormFooterProps {
	isLoading: boolean;
	formId: string;
}
export const FormFooter = ({ isLoading, formId }: FormFooterProps) => {
	return (
		<div className="flex items-center justify-end mt-3 rounded-b">
			<button
				className="flex items-center justify-center bg-slate-800 w-28 text-white active:bg-zinc-900 font-semibold border rounded-lg text-sm px-4 py-2.5 shadow hover:shadow-xl outline-none focus:outline-none cursor-pointer ease-linear transition-colors duration-150"
				type="submit"
				form={formId}
				disabled={isLoading}
			>
				{isLoading ? <Spinner /> : "Save"}
			</button>
		</div>
	);
};
