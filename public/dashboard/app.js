
async function checkUserRole() {
    try {
        const res = await axios.get("http://localhost:3000/api/dashboard", { withCredentials: true });
        console.log(res);
        // return res.data.user.role;
    } catch (err) {
        window.location.href = "/index.html";
        console.log(err);
    }
}

console.log("Hello World!");

const foo = async () => {
    const res = await axios.post('http://localhost:3000/api/postBlog', { title, author, desc, uid },
        {
            headers: {
                "Authorization": "Bearer your_jwt_token_here",
                "Content-Type": "application/json",
                "Custom-Header": "MyValue"
            },
        }
    );
    console.log(res);
}

const login = async () => {
    try {
        const loginEmail = "zareef7@gmail.com";
        const loginPassword = "12345";
        const res = await axios.post('http://localhost:3000/api/login', { loginEmail, loginPassword },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log(res);
    } catch (err) {
        console.log(err);
    }
}
