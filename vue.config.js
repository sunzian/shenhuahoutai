module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target: 'http://test.legendpicture.com',
                // target: 'https://wonder.legendpicture.com',
                // target: 'https://192.168.43.169:8080',
                // target: 'https://192.168.31.121:8080',
<<<<<<< HEAD
                target: 'https://192.168.31.219:8080',
                // target: 'https://192.168.31.214:8080',
=======
                // target: 'https://192.168.101.10:8080',
                target: 'https://192.168.31.219:8080',
>>>>>>> 3ab6ff950fb935c106a1c61bfaa491ffa2c593d2
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
