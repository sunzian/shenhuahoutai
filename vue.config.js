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
                // target: 'https://192.168.101.32:8080',
                target: 'https://192.168.101.7:8080',
                // target: 'https://192.168.31.214:8080',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
