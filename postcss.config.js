module.exports = {
	plugins: {
		//autoprefixer: {},
    	stylelint: {},
	/*
		'postcss-easy-import' : {
			extensions: '.pcss',
			plugins   : [require('stylelint')()]
		},
	*/
		'postcss-preset-env': {
			browsers     : ['last 2 versions', 'ie < 8'],
			//stage        : 0,
			autoprefixer : {
				grid: true
			}
		},
		cssnano: {
			preset: ['advanced', { zindex: false }]
		},
	/*
		'postcss-reporter': {
		clearReportedMessages: true
		}
	*/
  	}
};
