var app = new Vue({
    el: '#app',
    data: {
        showLogin: false,
        user: null,
        username: '',
        password: '',
        error: '',
        addedTitle: '',
        addedDescription: '',
        projects: [],
        currentTime: null,
        currStart: 0
    },
    created() {
        this.getUser();
        this.getProjects();
        this.currentTime = new Date().getTime();
        setInterval(() => this.updateCurrentTime(), 1 * 1000);
    },
    methods: {
        toggleLogin() {
            this.error = "";
            this.username = "";
            this.password = "";
            this.showLogin = !this.showLogin;
        },
        async register() {
            this.error = "";
            try {
                let response = await axios.post("/api/users", {
                    username: this.username,
                    password: this.password
                });
                this.user = response.data;
                // close the dialog
                this.toggleLogin();
            }
            catch (error) {
                this.error = error.response.data.message;
            }
        },
        async login() {
            this.error = "";
            try {
                let response = await axios.post("/api/users/login", {
                    username: this.username,
                    password: this.password
                });
                this.user = response.data;
                // close the dialog
                this.toggleLogin();
            }
            catch (error) {
                this.error = error.response.data.message;
            }
        },
        async logout() {
            try {
                let response = await axios.delete("/api/users");
                this.user = null;
            }
            catch (error) {
                // don't worry about it
            }
        },
        async getUser() {
            try {
                let response = await axios.get("/api/users");
                this.user = response.data;
            }
            catch (error) {
                // Not logged in. That's OK!
            }
        },
        async getProjects() {
            try {
                let response = await axios.get("/api/projects");
                this.projects = response.data;
            }
            catch (error) {
                console.log(error);
            }
        },
        async addProject() {
            try {
                let response = await axios.post("/api/projects", {
                    title: this.addedTitle,
                    descript: this.addedDescription
                });
                this.addedTitle = "";
                this.addedDescription = "";
                this.getProjects();
            }
            catch (error) {
                console.log(error);
            }
        },
        async deleteProject(project) {
            try {
                let response = await axios.delete("/api/projects/" + project._id);
                this.getProjects();
            }
            catch (error) {
                this.toggleLogin();
            }
        },
        closeLogin() {
            this.showLogin = false;
        },
        async toggleProject(project) {
            if (project.started) {
                try {
                    await axios.put("/api/projects/stop/" + project._id, {
                        t: this.currentTime,
                    });
                    this.getProjects();
                }
                catch (error) {
                    this.toggleLogin();
                }
            }
            else {
                this.currStart = this.currentTime;
                try {
                    await axios.put("/api/projects/start/" + project._id, {
                        t: this.currentTime,
                    });
                    this.getProjects();
                }
                catch (error) {
                    this.toggleLogin();
                }
            }
        },
        updateCurrentTime() {
            this.currentTime = new Date().getTime();
        }
    },
    computed: {
        timeDiff: function() {
            return this.currentTime - this.currStart;
        }
    }
});
