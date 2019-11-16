module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target: 'https://test.legendpicture.com',
                // target: 'https://wonder.legendpicture.com',
<<<<<<< HEAD
                target: 'https://192.168.31.196:8080',
                // target: 'https://192.168.31.121:8080',
                // target: 'https://192.168.31.219:8080',
=======
                // target: 'https://192.168.1.117:80',
                // target: 'https://192.168.31.121:8080',
                target: 'https://192.168.31.219:8080',
>>>>>>> 1bd34838cc046202fbec99adcd01e6afd4bcda69
                // target: 'https://192.168.31.214:8080',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
