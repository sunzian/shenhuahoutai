<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>
import { Decrypt, Encrypt, preSign, EncryptReplace, ParamsAppend } from '@/aes/utils';
import E from 'wangeditor';
import axios from 'axios';
export default {
    name: 'editoritem',
    data() {
        return {
            editor: null,
            info_: null
        };
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        isClear: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        isClear(val) {
            // 触发清除文本域内容
            if (val) {
                this.editor.txt.clear();
                this.info_ = null;
            }
        },
        value: function(value) {
            if (value !== this.editor.txt.html()) {
                this.editor.txt.html(this.value);
            }
        }
        //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
    },
    mounted() {
        this.seteditor();
        this.editor.txt.html(this.value);
    },
    methods: {
        seteditor() {
            this.editor = new E(this.$refs.toolbar, this.$refs.editor);
            this.editor.customConfig.uploadImgHeaders = {
                'Content-Type': 'multipart/form-data'
            };
            this.editor.customConfig.uploadImgParams = {
                type: EncryptReplace('business')
            };
            this.editor.customConfig.pasteFilterStyle = false;
            this.editor.customConfig.pasteIgnoreImg = true;
            this.editor.customConfig.showLinkImg = false;
            this.editor.customConfig.uploadImgServer = '/api/upload/uploadImage'; // 配置服务器端地址
            this.editor.customConfig.uploadImgHeaders = {}; // 自定义 header
            this.editor.customConfig.uploadFileName = 'file'; // 后端接受上传文件的参数名
            this.editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024; // 将图片大小限制为 10M
            // this.editor.customConfig.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
            // this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

            // 配置菜单
            this.editor.customConfig.menus = [
                'head', // 标题
                'bold', // 粗体
                'fontSize', // 字号
                // 'fontName', // 字体
                'italic', // 斜体
                'underline', // 下划线
                'strikeThrough', // 删除线
                'foreColor', // 文字颜色
                'backColor', // 背景颜色
                // 'link', // 插入链接
                'list', // 列表
                'justify', // 对齐方式
                'quote', // 引用
                // 'emoticon', // 表情
                'image', // 插入图片
                // 'table', // 表格
                // 'video', // 插入视频
                // 'code', // 插入代码
                'undo', // 撤销
                'redo' // 重复
                // 'fullscreen' // 全屏
            ];

            this.editor.customConfig.uploadImgHooks = {
                before: function(xhr, editor, files) {
                    console.log(files);
                    let testmsg = files[0].name.substring(files[0].name.lastIndexOf('.') + 1);
                    const isLt2M = files[0].size / 1024 / 1024 < 10;
                    const extension = testmsg === 'jpg';
                    const extension2 = testmsg === 'png';
                    const extension3 = testmsg === 'gif';
                    if (!extension && !extension2 && !extension3) {
                        this.$message({
                            message: '上传文件只能是 jpg、png、gif格式!',
                            type: 'warning'
                        });
                    }
                    if (!isLt2M) {
                        this.$message({
                            message: '上传文件大小不能超过 10MB!',
                            type: 'warning'
                        });
                    }
                    return extension || (extension2 && isLt2M);
                    // 图片上传之前触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

                    // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                    // return {
                    //     prevent: true,
                    //     msg: '放弃上传'
                    // }
                },
                fail: (xhr, editor, result) => {
                    // 插入图片失败回调
                },
                success: (xhr, editor, result) => {
                    // 图片上传成功回调
                },
                timeout: (xhr, editor) => {
                    // 网络超时的回调
                },
                error: (xhr, editor) => {
                    // 图片上传错误的回调
                },
                customInsert: (insertImg, result, editor) => {
                    // 图片上传成功，插入图片的回调
                    //insertImg()为插入图片的函数
                    //循环插入图片
                    insertImg(result.data);
                }
            };
            (this.editor.customConfig.onchange = html => {
                this.info_ = html; // 绑定当前逐渐地值
                this.$emit('change', this.info_); // 将内容同步到父组件中
            }),
                (this.editor.customConfig.pasteTextHandle = function(content) {
                    // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
                    if (content == '' && !content) return '';
                    var str = content;
                    str = str.replace(/<xml>[\s\S]*?<\/xml>/gi, '');
                    str = str.replace(/<style>[\s\S]*?<\/style>/gi, '');
                    str = str.replace(/<\/?[^>]*>/g, '');
                    str = str.replace(/[ | ]*\n/g, '\n');
                    str = str.replace(/&nbsp;/gi, '');
                    return str;
                });
            // 创建富文本编辑器
            this.editor.create();
        }
    }
};
</script>

<style lang="css">
.editor {
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 0;
}
.toolbar {
    border: 1px solid #ccc;
}
.text {
    border: 1px solid #ccc;
    min-height: 500px;
}
</style>
