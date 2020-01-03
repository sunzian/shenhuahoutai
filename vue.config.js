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
                target: 'https://192.168.31.195:8080',
                // target: 'https://192.168.31.214:8080',  // gw jzkj
                // target: 'https://192.168.101.7:8080',   // gw heloo2
                // target: 'https://192.168.31.219:8080',  // zy jzkj
                // target: 'https://192.168.101.10:8080',  // zy heloo2
                // target: 'https://192.168.31.121:8080',  // sk 5g
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
};
