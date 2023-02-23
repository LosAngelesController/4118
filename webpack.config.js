module.exports = {
    module: {
        experiments: {
	    futureDefaults: true
	}
        rules: [
            {
                test: /\bmapbox-gl-csp-worker.js\b/i,
                use: { loader: 'worker-loader' }
            }
        ]
    }
};
