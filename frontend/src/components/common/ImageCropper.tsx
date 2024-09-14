import { useState, useRef } from "react";
import ReactCrop, {
	Crop,
	PixelCrop,
	centerCrop,
	makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "@/helpers/setCanvasPreview";
import { FaCropSimple } from "react-icons/fa6";

interface ImageCropperProps {
	imageSrc: string | null;
	onCropComplete: (croppedImageData: string) => void;
}

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

export const ImageCropper: React.FC<ImageCropperProps> = ({
	imageSrc,
	onCropComplete,
}) => {
	const imgRef = useRef<HTMLImageElement>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

	const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const { width, height } = e.currentTarget;
		const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

		const crop = makeAspectCrop(
			{
				unit: "%",
				width: cropWidthInPercent,
			},
			ASPECT_RATIO,
			width,
			height
		);
		const centeredCrop = centerCrop(crop, width, height);
		setCrop(centeredCrop);
	};

	const handleCropComplete = () => {
		if (completedCrop && imgRef.current && previewCanvasRef.current) {
			setCanvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
			const dataUrl = previewCanvasRef.current.toDataURL();
			onCropComplete(dataUrl);
		}
	};

	return (
		<div className="absolute flex flex-col items-center p-10 z-[60] bg-white mt-36 rounded-lg">
			<ReactCrop
				crop={crop}
				onChange={(_, percentCrop) => setCrop(percentCrop)}
				onComplete={(c) => setCompletedCrop(c)}
				aspect={ASPECT_RATIO}
				minWidth={MIN_DIMENSION}
			>
				<img
					ref={imgRef}
					src={imageSrc || ""}
					alt="Crop me"
					style={{ maxHeight: "300px" }}
					onLoad={onImageLoad}
                    className="rounded"
				/>
			</ReactCrop>
			<button
				className="flex items-center justify-center gap-2 w-full mt-4 bg-slate-800 text-white font-semibold border rounded-lg text-sm px-4 py-2 shadow hover:shadow-xl outline-none focus:outline-none ease-linear transition-all duration-150"
				onClick={handleCropComplete}
			>
				Crop 
                <FaCropSimple/>
			</button>
			<canvas ref={previewCanvasRef} style={{ display: "none" }} />
		</div>
	);
};
