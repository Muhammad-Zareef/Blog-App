
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

const getData = async () => {
    try {
        let uid = JSON.parse(localStorage.getItem("UID")) || false;
        if (uid) {
            const res = await axios.get('http://localhost:3000/api/users');
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i]._id === uid) {
                    location.href = './home/home.html';
                    break;
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const login = async () => {
    try {
        let loginEmail = document.getElementById("loginEmail").value;
        let loginPassword = document.getElementById("loginPassword").value;
        const res = await axios.post('http://localhost:3000/api/login', { loginEmail, loginPassword });
        if (res.data.status === 200) {
            setTimeout(() => {
                window.location.href = "home/home.html";
            }, 1000);
            notyf.success(res.data.message);
            localStorage.setItem("UID", JSON.stringify(res.data.user._id));
        } else {
            notyf.error("Invalid credentials");
        }
    } catch (error) {
        console.log(error);
    }
}
