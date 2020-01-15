module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
<<<<<<< HEAD
                target: 'http://test.legendpicture.com',
                // target: 'https://wonder.legendpicture.com',
                // target: 'https://192.168.43.169:8080',
=======
                // target: 'http://test.legendpicture.com',
                // target: 'https://wonder.legendpicture.com',
                target: 'https://192.168.43.169:8080',
>>>>>>> 8ccf2d6dab6d5b8deda85dae2dcdf3b614c72765
                // target: 'https://192.168.43.34:8080',
                // target: 'https://192.168.1.122:8080',  // gw
                // target: 'https://192.168.31.220:8080',  // zy jzkj
                // target: 'https://192.168.101.10:8080',  // zy heloo2
                // target: 'https://192.168.31.121:8080',  // sk 5g
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
