let app = new Vue({
    el: '#app',
    data: {
        editingName: false,
        loginVisible: false,
        signUpvisible: false,
        shareVisible: false,
        currentUser: {
            id: undefined,
            email: '',
        },
        resume: {
            name: '姓名',
            gender: '男',
            birthday: '1994-01-01',
            email: 'example@example.com',
            phone: '13811113322',
            jobTitle: '前端工程师',
            skills: [
                {name: '请填写技能名称', description: '请填写技能描述'},
                {name: '请填写技能名称', description: '请填写技能描述'},
                {name: '请填写技能名称', description: '请填写技能描述'},
                {name: '请填写技能名称', description: '请填写技能描述'},
            ],
            projects: [
                {name: '请填写项目名称', link: 'http://...', keywords: '请填写关键字', description: '请详细描述'},
                {name: '请填写项目名称', link: 'http://...', keywords: '请填写关键字', description: '请详细描述'},
            ]
        },
        login: {
            email: '',
            password: ''
        },
        signUp: {
            email: '',
            password: ''
        },
        shareLink: "不知道"
    },
    methods: {
        onEdit(key, value) {
            let regex = /\[(\d+)\]/g
            key = key.replace(regex, (math, number) => `.${number}`)
            keys = key.split('.')
            let result = this.resume
            for (let i = 0; i < keys.length; i++) {
                if (i === keys.length - 1) {
                    result[keys[i]] = value
                } else {
                    result = result[keys[i]]
                }

            }


            result = value
        },
        hasLogin() {
            return !!this.currentUser.objectId
        },
        onLogin(e) {
            AV.User.logIn(this.login.email, this.login.password).then((user) => {
                user = user.toJSON()
                this.currentUser.objectId = user.objectId
                this.currentUser.email = user.email
                this.loginVisible = false
            }, (error) => {
                if (error.code === 211) {
                    alert('邮箱不存在')
                } else if (error.code === 210) {
                    alert('邮箱和密码不匹配')
                }
            });
        },
        onLogout(e) {
            AV.User.logOut()
            alert('注销成功')
            window.location.reload()
            // var currentUser = AV.User.current();
        },
        onSignUp(e) {
            // 新建 AVUser 对象实例
            const user = new AV.User();
            // 设置用户名
            user.setUsername(this.signUp.email);
            // 设置密码
            user.setPassword(this.signUp.password);
            // 设置邮箱
            user.setEmail(this.signUp.email);
            user.signUp().then((user) => {
                alert('注册成功')
                user = user.toJSON()
                this.currentUser.objectId = user.objectId
                this.currentUser.email = user.email
                this.signUpvisible = false
            }, (error) => {
                alert(error.rawMessage)
            })
        },
        onClickSave() {
            let currentUser = AV.User.current()
            if (!currentUser) {
                this.loginVisible = true
            } else {
                this.saveResume()
            }

        },
        saveResume() {
            let {objectId} = AV.User.current().toJSON()
            // 第一个参数是 className，第二个参数是 objectId
            let user = AV.Object.createWithoutData('User', objectId)
            user.set('resume', this.resume);
            user.save().then(() => {
                alert('保存成功')
            }, () => {
                alert('保存失败')
            })
        },
        getResume() {
            var query = new AV.Query('User');
            query.get(this.currentUser.objectId).then((user) => {
                let resume = user.toJSON().resume
                Object.assign(this.resume, resume)
                //this.resume 的所有可枚举属性，复制到目标对象resume
            }, (error) => {

            });
        },
        addSkill() {
            this.resume.skills.push({
                name: '请填写技能名称', description: '请填写技能描述'
            })
        },
        removeSkill(index) {
            this.resume.skills.splice(index, 1)
        },
        addProject() {
            this.resume.projects.push({
                name: '请填写项目名称', link: 'http://...', keywords: '请填写关键字', description: '请详细描述'
            })
        },
        removeProject(index) {
            this.resume.projects.splice(index, 1)
        },
    }
})
let currentUser = AV.User.current()
if (currentUser) {
    app.currentUser = currentUser.toJSON()
    app.shareLink = location.origin + location.pathname + '?user_id=' + app.currentUser.objectId
    app.getResume()
}