module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target: 'http://test.legendpicture.com',
                // target: 'https://wonder.legendpicture.com',
                // target: 'https://192.168.101.11:80',
                // target: 'https://192.168.31.121:8080',
                // target: 'https://192.168.101.10:8080',
                // target: 'https://192.168.31.23:80',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
