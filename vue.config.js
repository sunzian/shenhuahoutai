module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://192.168.10.110:8080',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
}
