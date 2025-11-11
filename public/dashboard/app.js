
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
        const loginEmail = "";
        const loginPassword = "";
        const res = await axios.post('http://localhost:3000/api/login', { loginEmail, loginPassword });
        console.log(res);
    } catch (err) {

    }
}

