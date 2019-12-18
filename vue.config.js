module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target: 'http://test.legendpicture.com',
                // target: 'https://wonder.legendpicture.com',
                // target: 'https://192.168.43.169:8080',
<<<<<<< HEAD
                // target: 'https://192.168.101.10:8080',
=======
                // target: 'https://192.168.31.121:8080',
>>>>>>> 44d99d0fa5e239e6f44bf3c08002df43dc83e0ad
                // target: 'https://192.168.101.7:8080',
                // target: 'https://192.168.31.214:8080',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
