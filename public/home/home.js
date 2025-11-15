
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    getBlogsData();
});

async function checkAuth() {
    try {
        const res = await axios.get("http://localhost:3000/api/home", { withCredentials: true });
        renderUserName(res.data.user);
    } catch (err) {
        window.location.href = "/index.html";
        console.log(err);
    }
}

const renderUserName = (user) => {
    let span = document.getElementsByClassName('user-welcome');
    span[0].innerHTML = `<i class="fas fa-user-circle me-1"></i>Welcome, ${user.fullName}!`;
}

const getBlogsData = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/blogs');
        renderBlogs(res.data);
    } catch (error) {
            console.log(error);
    }
}

const renderBlogs = blogs => {
    let blogPostsContainer = document.getElementById("blogPosts");
    blogPostsContainer.innerHTML = "";
    for (let i = blogs.length-1; i >= 0; i--) {
        blogPostsContainer.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card blog-card">
                    <div class="card-header">
                        <h5 class="card-title text-white mb-0">${blogs[i].title}</h5>
                    </div>
                    <div class="card-body">
                        <p class="text-muted"><i class="fas fa-user me-2"></i>By ${blogs[i].author}</p>
                        <p class="card-text">${blogs[i].desc}</p>
                    </div>
                    <div class="card-footer bg-white">
                        <div class="d-flex justify-content-between">
                            <small class="text-muted"><i class="fas fa-clock me-1"></i>${new Date(blogs[i].createdAt).toLocaleString()}</small>
                            <div>
                                <button class="btn btn-sm btn-outline-primary me-1"><i class="fas fa-thumbs-up"></i></button>
                                <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-comment"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

const logout = async () => {
    Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out",
        icon: "success",
        showConfirmButton: false,
        timer: 1250
    });
    try {
        await axios.post("http://localhost:3000/api/logout", { withCredentials: true });
        setTimeout(() => {
            window.location.href = "/index.html";
        }, 1000);
    } catch (err) {
        console.log(err);
    }
}
