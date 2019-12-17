import axios from 'axios'
import qs from 'qs'

axios.defaults.timeout = 1150000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = '/api';   //配置接口地址
axios.defaults.withCredentials = true;

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if(config.method  === 'post'){
        config.data = qs.stringify(config.data);
    }
    return config;
},(error) =>{
    console.log('错误的传参')
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) =>{
    //对响应数据做些事
    if(!res.data.success){
        return Promise.resolve(res);
    }
    return res;
},
    (error) => {
    console.log('网络异常');
    console.log(error);
    return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送get请求)
export function fetchGet(url, param) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: param})
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送Delete请求)
export function fetchDelete(url, param) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {params: param})
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送Put请求)
export function fetchPut(url, param) {
    return new Promise((resolve, reject) => {
        axios.put(url, {params: param})
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
// 导出Excel公用方法
export function exportMethod(data) {
    axios({
        method: data.method,
        url: data.url,
        params: data.params,
        headers: {'Content-Type': 'application/json'},
        responseType: 'blob'
    }).then((res) => {
        // console.log(res.data.type);
        if(res.data.type=='application/json'){
            alert('您没有该权限!');
            return
        }
        const link = document.createElement('a');
        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);

        // link.download = res.headers['content-disposition'] //下载后文件名
        link.download = data.fileName;//下载的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
    })
        .catch(error => {
        this.$Notice.error({
            title: '错误',
            desc: '网络连接错误'
        });
        console.log(error)
    })
}
export default {
    fetchPost,
    fetchGet,
    fetchDelete,
    fetchPut,
    exportMethod,
}
