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
export function exportCouponMethod(info) {
    axios({
        method: info.method,
        url: info.url,
        params: info.params,
        headers: {'Content-Type': 'application/json'},
        responseType: 'blob'
    }).then((res) => {
        const data = res.data
        // 有可能下载失败，返回{code: '500'},但responseType: 'blob'会把data强制转为blob，导致下载undefined.excel
        // 解决：将已转为blob类型的data转回json格式，判断是否下载成功
        let r = new FileReader()
        r.onload = function () {
          // 如果JSON.parse(this.result)不报错，说明this.result是json字符串，是下载报错情况的返回值，弹框提示
          // 如果JSON.parse(this.result)报错，说明下载成功，进入catch
          try {
            let resData = JSON.parse(this.result) // this.result为FileReader获取blob数据转换为json后的数据，即后台返回的原始数据
            if (resData && resData['code'] && resData['code'] === 'error') {
              alert(resData.message)
              return;
            }
          } catch (err) {
            let fileName = info.fileName
            fileName = decodeURIComponent(fileName)
            // 兼容ie11
            if (window.navigator.msSaveOrOpenBlob) {
              try {
                const blobObject = new Blob([data])
                window.navigator.msSaveOrOpenBlob(blobObject, fileName)
              } catch (e) {
                console.log(e)
              }
              return
            }
            let url = window.URL.createObjectURL(new Blob([res.data], {type: 'application/vnd.ms-excel'}))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }
        r.readAsText(data) // FileReader的API
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
    exportCouponMethod,
}
