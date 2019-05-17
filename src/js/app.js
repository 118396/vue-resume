window.App = {
    template: `
    <div>
        <app-aside  v-show="mode === 'edit'"  @save="onClickSave"></app-aside>
        <main>
            <resume :mode="mode" :display-resume = "displayResume"></resume>
        </main> 
        <button class="exitPreview" @click="mode = 'edit'" v-if="mode === 'preview'">退出预览</button>
    </div>
    `,
    data () {
        return {
            editingName: false,
            loginVisible: false,
            signUpVisible: false,
            shareVisible: false,
            shareLink: '',
            skinPickerVisible: false,
            previewUser: {
                objectId: undefined
            },
            previewResume: {},
            currentUser: {
                objectId: undefined,
                email: '',
            },
            resume: {
                name: '姓名',
                gender: '男',
                birthday: '1994-01-01',
                email: 'example@example.com',
                phone: '13811113322',
                jobTitle: '前端工程师',
                skills: [{
                        name: '请填写技能名称',
                        description: '请填写技能描述'
                    },
                    {
                        name: '请填写技能名称',
                        description: '请填写技能描述'
                    },
                    {
                        name: '请填写技能名称',
                        description: '请填写技能描述'
                    },
                    {
                        name: '请填写技能名称',
                        description: '请填写技能描述'
                    },
                ],
                projects: [{
                        name: '请填写项目名称',
                        link: 'http://...',
                        keywords: '请填写关键字',
                        description: '请详细描述'
                    },
                    {
                        name: '请填写项目名称',
                        link: 'http://...',
                        keywords: '请填写关键字',
                        description: '请详细描述'
                    },
                ]
            },
            mode: 'edit', // 'preview'
        }
    },
    computed: {
        displayResume() {
            return this.mode === 'preview' ? this.previewResume : this.resume
        }
    },
    methods: {
        onShare() {
            if (this.hasLogin()) {
                this.shareVisible = true
            } else {
                alert('请先登录')
            }
        },
        onLogin(user) {
            this.currentUser.objectId = user.objectId
            this.currentUser.email = user.email
            this.getResume(this.currentUser)
            this.loginVisible = false
        },
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
        },
        hasLogin() {
            return !!this.currentUser.objectId
        },

        onLogout(e) {
            AV.User.logOut()
            alert('注销成功')
            window.location.reload()
            // var currentUser = AV.User.current();
        },

        onClickSave() {
            let currentUser = AV.User.current()
            if (!currentUser) {
                this.$router.push('/login')
            } else {
                this.saveResume()
            }
        },
        saveResume() {
            let {
                objectId
            } = AV.User.current().toJSON()
            // 第一个参数是 className，第二个参数是 objectId
            let user = AV.Object.createWithoutData('User', objectId)
            user.set('resume', this.resume);
            user.save().then(() => {
                alert('保存成功')
            }, () => {
                alert('保存失败')
            })
        },
        getResume(user) {
            var query = new AV.Query('User');
            return query.get(user.objectId).then((user) => {
                let resume = user.toJSON().resume
                return resume
            }, (error) => {

            });
        },
        print() {
            window.print();
        },
    },
  
}

Vue.component('app', App)