
async function signup() {
    try {
        let fullName = document.getElementById("fullName").value;
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        if (fullName.trim() == "" || email.trim() == "" || password.trim() == "") {
            alert("Please fill out fields");
            return;
        }
        const res = await axios.post('http://localhost:3000/api/signup', { fullName, email, password });
        if (res.data.status == 200) {
            alert("Account created successfully");
            showForm('login');
        } else {
            alert(res.data.message);
        }
    } catch (err) {
        console.log(err);
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
            localStorage.setItem("UID", JSON.stringify(res.data.user._id));
            window.location.href = "home/home.html";
            alert(res.data.message);
        } else {
            alert("Invalid credentials");
        }
    } catch (error) {
        console.log(error);
    }
}
