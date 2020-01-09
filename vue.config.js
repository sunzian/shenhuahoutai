module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target: 'http://test.legendpicture.com',
                // target: 'https://wonder.legendpicture.com',
                target: 'https://192.168.43.169:8080',
                // target: 'https://192.168.43.34:8080',
                // target: 'https://192.168.1.122:8080',  // gw
                // target: 'https://192.168.31.222:8080',  // zy jzkj
                // target: 'https://192.168.101.10:8080',  // zy heloo2
                target: 'https://192.168.31.124:8080',  // sk 5g
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
