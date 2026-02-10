import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto auto-detects the deployment platform.
		// Works on Vercel during dev, easily switch to adapter-node for Hostinger production.
		adapter: adapter()
	}
};

export default config;
