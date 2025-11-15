
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});

async function checkAuth() {
    try {
        const res = await axios.post("http://localhost:3000/api/verifyToken", { withCredentials: true });
        if (res.data.user.role === "admin") {
            window.location.href = "dashboard/index.html";
        } else {
            window.location.href = "home/home.html";
        }
    } catch (err) {
        
    }
}

let notyf = new Notyf({
    position: {
        x: 'left',
        y: 'bottom'
    }
});

const signup = async () => {
    try {
        let fullName = document.getElementById("fullName").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let role = document.getElementById("role").value;
        if (fullName.trim() == "" || email.trim() == "" || password.trim() == "") {
            notyf.error("Please fill out fields");
            return;
        }
        if (password.length < 5) {
            notyf.error("Password must be at least 5 characters long");
            return;
        }
        if (role === "") {
            notyf.error("Please select your role");
            return;
        }
        const res = await axios.post('http://localhost:3000/api/signup', { fullName, email, password, role });
        if (res.data.status == 200) {
            setTimeout(() => {
                showForm('login');
            }, 1000);
            notyf.success("Account created successfully");
        } else {
            notyf.error(res.data.message);
        }
    } catch (err) {
        notyf.error(err.response.data.message);
    }
}

const login = async () => {
    try {
        let loginEmail = document.getElementById("loginEmail").value;
        let loginPassword = document.getElementById("loginPassword").value;
        const res = await axios.post('http://localhost:3000/api/login', { loginEmail, loginPassword }, { withCredentials: true });
        console.log(res)
        if (res.data.status === 200) {
            if (res.data.user.role === "admin") {
                setTimeout(() => {
                    window.location.href = "dashboard/index.html";
                }, 1000);
                notyf.success(`Admin, ${res.data.message}`);
            } else {
                setTimeout(() => {
                    window.location.href = "home/home.html";
                }, 1000);
                notyf.success(res.data.message);
                localStorage.setItem("UID", JSON.stringify(res.data.user._id));
            }
        } else {
            notyf.error("Invalid credentials");
        }
    } catch (error) {
        console.log(error);
    }
}
