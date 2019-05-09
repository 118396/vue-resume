var app = new Vue({
    el: '#app',
    data: {
        editingName: false,
        resume: {
            name: '姓名',
            gender: '男',
            birthday: '1994-01-01',
            email: 'example@example.com',
            phone: '13811113322',
            jobTitle: '前端工程师'
        }
    },
    methods: {
        onEdit(key,value) {
            this.resume[key] = value
        },
        onClickSave(){
            let currentUser = AV.User.current();
            if (!currentUser) {
                this.showLogin()
            }
            else {
                this.saveResume()
            }
            // console.log(this.resume)
            // //leanCloud 对象保存代码
            // var User = AV.Object.extend('User')
            // var user = new User()
            // user.set('resume','this.resume')
            // user.save().then(function () {
            // }, function (error) {
            // })
        },
        saveLogin(){

        },
        saveResume(){}
    }
})