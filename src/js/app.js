let app = new Vue({
    el: '#app',
    data: {
        editingName: false,
        loginVisible:false,
        signUpvisible: false,
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
                this.loginVisible = true
            }
            else {
                this.saveResume()
            }

        }

        ,

        saveResume(){}
    }
})