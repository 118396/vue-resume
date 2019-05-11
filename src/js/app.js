let app = new Vue({
    el: '#app',
    data: {
        editingName: false,
        loginVisible:false,
        signUpvisible: false,
        currentUser:{
            id: undefined,
            email: '',
        },
        resume: {
            name: '姓名',
            gender: '男',
            birthday: '1994-01-01',
            email: 'example@example.com',
            phone: '13811113322',
            jobTitle: '前端工程师'
        },
        login:{
            email :'',
            password:''
        },
        signUp:{
            email :'',
            password:''
        }
    },
    methods: {
        onEdit(key,value){
            this.resume[key] = value
        },
        onLogin(e){
            AV.User.logIn(this.login.email,this.login.password).then(function (user) {
                this.currentUser.id = user.id
                this.currentUser.email = user.attributes.email
            },  (error)=> {
                if(error.code === 211){
                    alert('邮箱不存在')
                }else if(error.code === 210 ){
                    alert('邮箱和密码不匹配')
                }
            });
        },
        onLogout(e){
            AV.User.logOut();
            alert('注销成功')
            window.location.reload()
            // var currentUser = AV.User.current();
        },
        onSignUp(e){
            // 新建 AVUser 对象实例
            const user = new AV.User();
            // 设置用户名
            user.setUsername(this.signUp.email);
            // 设置密码
            user.setPassword(this.signUp.password);
            // 设置邮箱
            user.setEmail(this.signUp.email);
            user.signUp().then( (user)=> {

            }, (error)=> {
            })
        },
        onClickSave(){
            let currentUser = AV.User.current()
            if (!currentUser) {
                this.loginVisible = true
            } else {
                this.saveResume()
            }

        },
        saveResume(){
            let {id} = AV.User.current()
            // 第一个参数是 className，第二个参数是 objectId
            let user = AV.Object.createWithoutData('User', id)
            user.set('resume', this.resume);
            user.save();
        }
    }
})
let currentUser = AV.User.current()
if(currentUser){
    app.currentUser = currentUser
}