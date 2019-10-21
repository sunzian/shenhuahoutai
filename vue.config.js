module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
<<<<<<< HEAD
                target:'http://192.168.1.117:8080',
=======
                target:'http://192.168.31.121:8080',
>>>>>>> 04d8f8f5352006189984861485d042b6f9c554e8
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
}
