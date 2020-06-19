module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target: 'http://test.legendpicture.com',
                target: 'https://wonder.legendpicture.com',
                // target: 'http://192.168.1.105:8080',  // gw
                //  target: 'http://192.168.1.103:8080',  // zy
                // target: 'http://192.168.101.57:8080',  // zy heloo2
                // target: 'http://192.168.31.221:8080',  // zy jzkj
                // target: 'http://192.168.101.235:8080',  // sk heloo2
                // target: 'http://192.168.31.122:8080',  // sk 5g
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
