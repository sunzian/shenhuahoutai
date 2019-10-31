module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target:'http://192.168.1.117:80',
                // target:'http://192.168.31.121:8080',
                target:'http://192.168.31.219:8080',
                // target:'http://47.98.31.214:8080',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
}
