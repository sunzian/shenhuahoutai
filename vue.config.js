module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target: 'http://test.legendpicture.com',
                target: 'https://wonder.legendpicture.com',
                // target: 'http://192.168.1.106:8080',  // gw
                // target: 'http://192.168.101.57:8080',  // zy heloo2
                // target: 'http://192.168.31.221:8080',  // zy jzkj
                // target: 'http://2k887814o8.oicp.vip/',
                // target: 'http://192.168.31.122:8080',  // sk 5g
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
