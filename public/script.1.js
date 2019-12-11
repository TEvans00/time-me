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
    },
    created() {
        this.getUser();
        this.getProjects();
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
                let response = await axios.delete("/api/projects/" + ticket._id);
                this.getProjects();
            }
            catch (error) {
                this.toggleLogin();
            }
        },
        closeLogin() {
            this.showLogin = false;
        },
    }
});
