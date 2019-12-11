module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target: 'http://test.legendpicture.com',
                // target: 'https://wonder.legendpicture.com',
<<<<<<< HEAD
                // target: 'https://192.168.101.7:8080',
                // target: 'https://192.168.31.121:8080',
                // target: 'https://192.168.10.110:8080',
                target: 'https://192.168.31.219:8080',
=======
                target: 'https://192.168.101.11:80',
                // target: 'https://192.168.31.121:8080',
                // target: 'https://192.168.10.110:8080',
                // target: 'https://192.168.31.23:80',
>>>>>>> 8cf23a130bb0d7024ef174692bd8567fba13fee2
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
