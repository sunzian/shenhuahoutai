module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target: 'https://test.legendpicture.com',
                // target: 'https://wonder.legendpicture.com',
                // target: 'https://192.168.31.196:8080',
                target: 'https://192.168.31.121:8080',
                // target: 'https://192.168.10.110:8080',
                // target: 'https://192.168.31.214:8080',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
