module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target:'http://192.168.1.117:8080',
                // target:'http://192.168.101.219:8080',
                target:'http://192.168.31.219:8080',
                // target:'http://47.98.178.147:8080',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
}
