
const uid = JSON.parse(localStorage.getItem("UID"));

const renderUserName = (user) => {
    let span = document.getElementsByClassName('user-welcome');
    span[0].innerHTML = `<i class="fas fa-user-circle me-1"></i>Welcome, ${user.fullName}!`;
}

const getUsersData = async () => {
    try {
        const uid = JSON.parse(localStorage.getItem("UID"));
        if (uid) {
            const res = await axios.get('http://localhost:3000/api/users');
            for (let i = 0; i < res.data.length; i++) {
                if (uid === res.data[i]._id) {
                    renderUserName(res.data[i]);
                    break;
                }
            }
        } else {
            logout();
        }
    } catch (error) {
        console.log(error);
        logout();
    }
}

const getBlogsData = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/blogs');
        renderBlogs(res.data);
    } catch (error) {
        console.log(error);
    }
}

function renderBlogs(blogs) {
    let blogPostsContainer = document.getElementById("blogPosts");
    blogPostsContainer.innerHTML = "";
    let hasPosts = false;
    for (let i = blogs.length-1; i >= 0; i--) {
        if (blogs[i].uid === uid) {
            hasPosts = true;
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
                                    <button class="btn btn-sm btn-outline-primary me-1"><i class="fas fa-edit" title="Edit"></i></button>
                                    <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash delete-btn" title="Delete"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    if (!hasPosts) {
        blogPostsContainer.innerHTML = `
            <div class="col-12 text-center my-5">
                <h4 class="text-muted">You haven’t published any blog posts yet</h4>
            </div>
        `;
    }
}

document.getElementById('blogForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    try {
        let title = document.getElementById("blogTitle").value;
        let author = document.getElementById("blogAuthor").value;
        let desc = document.getElementById("blogDescription").value;
        if (title.trim() == "" || author.trim() == "" || desc.trim() == "") {
            alert("Please fill out fields.");
            this.reset();
            return;
        }
        const res = await axios.post('http://localhost:3000/api/postBlog', { title, author, desc, uid });
        this.reset();
        alert("Blog posted successfully!");
        getBlogsData();
    } catch (error) {
        console.log(error);
    }
});

const logout = () => {
    location = '../../index.html';
    localStorage.removeItem("UID");
}
