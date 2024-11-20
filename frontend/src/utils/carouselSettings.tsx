export const jobCardSettings = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 3,
	autoplay: true,
	slidesToScroll: 2,
	initialSlide: 0,
	responsive: [
		{
			breakpoint: 1024,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3,
				infinite: true,
				dots: true,
			},
		},
		{
			breakpoint: 1000,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2,
				initialSlide: 2,
			},
		},
		{
			breakpoint: 640,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
			},
		},
	],
};

export const logoSettings = {
	dots: false,
	infinite: true,
	slidesToShow: 5,
	slidesToScroll: 2,
	autoplay: true,
	speed: 5000,
	autoplaySpeed: 5000,
	cssEase: "linear",
	responsive: [
		{
			breakpoint: 1280,
			settings: {
				slidesToShow: 5,
				slidesToScroll: 5,
				infinite: true,
				dots: true,
			},
		},
		{
			breakpoint: 1024,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 4,
				infinite: true,
				dots: true,
			},
		},
		{
			breakpoint: 860,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3,
				initialSlide: 2,
			},
		},
		{
			breakpoint: 512,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
			},
		},
	],
};
