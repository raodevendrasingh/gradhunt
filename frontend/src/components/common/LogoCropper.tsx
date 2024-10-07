import React, { useState, useRef, useEffect } from "react";
import ReactCrop, {
	Crop,
	PixelCrop,
	centerCrop,
	makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "@/helpers/setCanvasPreview";
import { FaCropSimple } from "react-icons/fa6";
import { FiZoomIn, FiZoomOut, FiMaximize } from "react-icons/fi";

interface ImageCropperProps {
	imageSrc: string | null;
	onCropComplete: (croppedImageData: string) => void;
	onClose: () => void;
}

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const INITIAL_ZOOM = 1;

export const LogoCropper: React.FC<ImageCropperProps> = ({
	imageSrc,
	onCropComplete,
	onClose,
}) => {
	const imgRef = useRef<HTMLImageElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const [zoom, setZoom] = useState(INITIAL_ZOOM);
	const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [onClose]);

	const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const { naturalWidth: width, naturalHeight: height } = e.currentTarget;
		const containerWidth = containerRef.current?.clientWidth || 0;
		const containerHeight = containerRef.current?.clientHeight || 0;

		const imageAspectRatio = width / height;
		const containerAspectRatio = containerWidth / containerHeight;

		let newWidth, newHeight;

		if (imageAspectRatio > containerAspectRatio) {
			// Wide image
			newWidth = containerWidth;
			newHeight = containerWidth / imageAspectRatio;
		} else {
			// Tall image
			newHeight = containerHeight;
			newWidth = containerHeight * imageAspectRatio;
		}

		setImageSize({ width: newWidth, height: newHeight });

		const cropWidthInPercent = (MIN_DIMENSION / newWidth) * 100;

		const crop = makeAspectCrop(
			{
				unit: "%",
				width: cropWidthInPercent,
			},
			ASPECT_RATIO,
			newWidth,
			newHeight
		);
		const centeredCrop = centerCrop(crop, newWidth, newHeight);
		setCrop(centeredCrop);
	};

	const handleCropComplete = () => {
		if (completedCrop && imgRef.current && previewCanvasRef.current) {
			setCanvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
			const dataUrl = previewCanvasRef.current.toDataURL();
			onCropComplete(dataUrl);
			onClose();
		}
	};

	const handleZoomIn = () => {
		setZoom((prevZoom) => Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM));
	};

	const handleZoomOut = () => {
		setZoom((prevZoom) => Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM));
	};

	const handleResetZoom = () => {
		setZoom(INITIAL_ZOOM);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
			<div className="bg-white rounded-2xl shadow-xl overflow-hidden w-[400px] h-[500px] flex flex-col">
				<div className="p-4 border-b border-gray-200">
					<h2 className="text-xl font-semibold">Crop Image</h2>
				</div>
				<div ref={containerRef} className="flex-grow p-4 overflow-hidden flex items-center justify-center"> 
					<ReactCrop
						crop={crop}
						onChange={(_, percentCrop) => setCrop(percentCrop)}
						onComplete={(c) => setCompletedCrop(c)}
						aspect={ASPECT_RATIO}
						minWidth={MIN_DIMENSION}
					>
						<div className="w-full h-full flex items-center justify-center overflow-hidden">
							<img
								ref={imgRef}
								src={imageSrc || ""}
								alt="Crop me"
								onLoad={onImageLoad}
								className="object-contain transition-transform duration-200 ease-in-out" 
								style={{
									width: `${imageSize.width}px`,
									height: `${imageSize.height}px`,
									transform: `scale(${zoom})`,
								}}
							/>
						</div>
					</ReactCrop>
				</div>
				<div className="flex justify-center gap-4 p-2 border-t border-gray-200">
					<button
						type="button"
						onClick={handleZoomOut}
						className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
						title="Zoom Out"
					>
						<FiZoomOut />
					</button>
					<button
						type="button"
						onClick={handleResetZoom}
						className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
						title="Reset Zoom"
					>
						<FiMaximize />
					</button>
					<button
						type="button"
						onClick={handleZoomIn}
						className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
						title="Zoom In"
					>
						<FiZoomIn />
					</button>
				</div>
				<div className="flex justify-end gap-4 p-4 border-t border-gray-200">
					<button
						type="button"
						className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold border rounded-lg text-sm px-4 py-2 hover:shadow outline-none focus:outline-none ease-linear transition-all duration-150"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						onClick={handleCropComplete}
						className="flex items-center justify-center gap-2 w-full bg-slate-800 text-white font-semibold border rounded-lg text-sm px-4 py-2 shadow hover:shadow-xl outline-none focus:outline-none ease-linear transition-all duration-150"
					>
						Crop
						<FaCropSimple />
					</button>
				</div>
				<canvas ref={previewCanvasRef} className="hidden" />
			</div>
		</div>
	);
};
