module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
<<<<<<< HEAD
                // target: 'http://test.legendpicture.com',
                // target: 'https://wonder.legendpicture.com',
                // target: 'https://192.168.43.169:8080',
                // target: 'https://192.168.101.57:8080',
                target: 'http://192.168.1.106:8080',  // gw
=======
                target: 'http://test.legendpicture.com',
                // target: 'https://wonder.legendpicture.com',
                // target: 'https://192.168.43.169:8080',
                // target: 'https://192.168.101.57:8080',
                // target: 'http://192.168.1.106:8080',  // gw
>>>>>>> 8594449e3588c400a14ee8ebf5286b9253eca235
                // target: 'https://192.168.31.219:8080',  // zy jzkj
                // target: 'http://192.168.101.57:8080',  // zy heloo2
                // target: 'http://2k887814o8.oicp.vip/',
                // target: 'https://192.168.31.121:8080',  // sk 5g
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
