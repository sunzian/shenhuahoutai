module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target: 'http://test.legendpicture.com',
                target: 'https://wonder.legendpicture.com',
                // target: 'https://192.168.43.169:8080',
                // target: 'https://192.168.31.121:8080',
<<<<<<< HEAD
                // target: 'https://192.168.10.110:8080',
=======
                target: 'https://192.168.101.10:8080',
>>>>>>> 07d2d165d1be62ec447396b84615c2864bbdd540
                // target: 'https://192.168.31.214:8080',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
