export const isDevice = (function () {
		const userAgent = navigator.userAgent;

		const isMobile = () => {
			// Regex patterns for commonly used mobile devices
			const mobilePatterns = [
				/Android/i,
				/BlackBerry/i,
				/iPhone/i,
				/iPad/i,
				/iPod/i,
				/Opera Mini/i,
				/Windows Phone/i
			];

			return mobilePatterns.some((pattern) => pattern.test(userAgent));
		};

		const isTablet = () => {
			// Heuristic check for larger screens and touch support
			return (
				/Mobile|iP(ad|hone)/.test(userAgent) &&
				!window.matchMedia('(max-device-width: 768px)').matches
			);
		};

		return (deviceType) => {
			switch (deviceType) {
				case 'mobile':
					return isMobile();
				case 'tablet':
					return isTablet();
				case 'desktop':
					return !isMobile() && !isTablet();
				default:
					throw new Error(`Invalid device type: ${deviceType}`);
			}
		};
	})();

	// Example usage:
	// const isMobileView = isDevice('mobile');
	// const isTabletView = isDevice('tablet');
	// const isDesktopView = isDevice('desktop');
