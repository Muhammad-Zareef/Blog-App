
document.addEventListener("DOMContentLoaded", async () => {
    await checkAuth();
    let blogPostsContainer = document.getElementById("blogPosts");
    blogPostsContainer.innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary me-2" role="status"></div>
            <span class="text-dark fs-4">Loading...</span>
        </div>
    `;
    await getBlogsData();
    initSearch();
});

let user = null;

async function checkAuth() {
    try {
        const res = await axios.get("http://localhost:3000/api/home", { withCredentials: true });
        renderUserName(res.data.user);
        user = res.data.user;
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
        const res = await axios.get('http://localhost:3000/api/userBlogs', { withCredentials: true });
        renderBlogs(res.data);
    } catch (error) {
        console.log(error);
    }
}

const openUpdateModal = async (id) => {
    try {
        const res = await axios.get(`http://localhost:3000/api/blogs/${id}`);
        document.getElementById('postId').value = id;
        document.getElementById('postTitle').value = res.data.blog.title;
        document.getElementById('postAuthor').value = res.data.blog.author;
        document.getElementById('postDescription').value = res.data.blog.desc;
        const updateModal = new bootstrap.Modal(document.getElementById('updatePostModal'));
        updateModal.show();
    } catch (error) {
        console.error(error);
    }
}

const updateBlog = async () => {
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement.closest('#updatePostModal')) {
        focusedElement.blur();
    }
    try {
        const id = document.getElementById('postId').value;
        const title = document.getElementById('postTitle').value;
        const author = document.getElementById('postAuthor').value;
        const desc = document.getElementById('postDescription').value;
        let img = document.querySelector("#updateBlogImage");
        if (!title || !author || !desc) {
            Swal.fire({
                icon: "error",
                title: "Missing Information!",
                text: "Please fill in all required fields"
            });
            return;
        }
        const updateModal = bootstrap.Modal.getInstance(document.getElementById('updatePostModal'));
        updateModal.hide();
        if (img.files.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(img.files[0]);
            reader.onload = async function (e) {
                img = e.target.result;
                const res = await axios.put(`http://localhost:3000/api/updateBlog/${id}`, { title, author, desc, imgURL: img });
                Swal.fire({
                    title: "Updated Successfully",
                    text: "Your changes have been saved",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                getBlogsData();
            }
        } else {
            const res = await axios.put(`http://localhost:3000/api/updateBlog/${id}`, { title, author, desc });
            Swal.fire({
                title: "Updated Successfully",
                text: "Your changes have been saved",
                icon: "success",
                showConfirmButton: false,
                timer: 2000
            });
            getBlogsData();
        }
    } catch (error) {
        console.error(error);
    }
}

const deleteBlog = (id) => {
    try {
        Swal.fire({
            title: "Are you sure?",
            text: "This blog post will be permanently deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axios.delete(`http://localhost:3000/api/deleteBlog/${id}`);
                Swal.fire({
                    title: "Deleted!",
                    text: "The blog post has been successfully deleted",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                getBlogsData();
            }
        });
    } catch (error) {
        console.log(error);
    }
}

function renderBlogs(blogs, order = "latest") {
    let blogPostsContainer = document.getElementById("blogPosts");
    blogPostsContainer.innerHTML = "";
    let hasPosts = false;
    for (let i = 0; i < blogs.length; i++) {
        hasPosts = true;
        blogPostsContainer.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="card blog-card">
                    <img src="${blogs[i].imgURL}" class="card-img-top" alt="${blogs[i].title} Image By ${blogs[i].author}" style="height: 230px; border-top-left-radius: 7px; border-top-right-radius: 7px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title mb-3">${blogs[i].title}</h5>
                        <p class="text-muted"><i class="fas fa-user me-2"></i>By ${blogs[i].author}</p>
                        <p class="card-text">${blogs[i].desc}</p>
                    </div>
                    <div class="card-footer bg-white">
                        <div class="d-flex justify-content-between">
                            <small class="text-muted"><i class="fas fa-clock me-1"></i>${timeAgo(blogs[i].createdAt)}</small>
                            <div>
                                <button class="btn btn-sm btn-outline-primary me-1" onclick="openUpdateModal('${blogs[i]._id}')"><i class="fas fa-edit" title="Edit"></i></button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteBlog(${blogs[i]._id})"><i class="fas fa-trash delete-btn" title="Delete"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    if (!hasPosts) {
        blogPostsContainer.innerHTML = `
            <div class="col-12 text-center my-5">
                <h4 class="text-muted">You haven’t published any blog posts yet</h4>
            </div>
        `;
    }
}

const searchBlog = async () =>  {
    let blogPostsContainer = document.getElementById("blogPosts");
    blogPostsContainer.innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary me-2" role="status"></div>
            <span class="text-dark fs-4">Loading...</span>
        </div>
    `;
    let input = document.getElementById('searchInput');
    if (input.value.trim() == "") {
        input.value = "";
        getBlogsData();
        return;
    }
    try {
        const res = await axios.get(`http://localhost:3000/api/searchWithUserId?query=${input.value}`);
        let blog = [];
        let isFound = false;
        for (let i = 0; i < res.data.blogs.length; i++) {
            if ((res.data.blogs[i].title).toLowerCase() == input.value.toLowerCase()) {
                blog.push(res.data.blogs[i]);
                isFound = true;
            }
        }
        if (!isFound) {
            blogPostsContainer.innerHTML = `
                <div class="col-12 text-center my-5">
                    <h4 class="text-muted">No blog posts found for your search</h4>
                </div>
            `;
            return;
        }
        renderBlogs(blog);
    } catch (error) {
        console.error(error);
    }
}

function initSearch() {
    const input = document.getElementById("searchInput");
    const btn = document.getElementById("searchBtn");
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchBlog();
        }
    });
    btn.addEventListener("click", searchBlog);
}

const filterBlogs = async () => {
    let blogPostsContainer = document.getElementById("blogPosts");
    blogPostsContainer.innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary me-2" role="status"></div>
            <span class="text-dark fs-4">Loading...</span>
        </div>
    `;
    let filter = document.getElementById("filter").value;
    if (filter === "latest") {
        try {
            const res = await axios.get('http://localhost:3000/api/userBlogs');
            renderBlogs(res.data);
        } catch (error) {
            console.error(error);
        }
    } else if (filter === "oldest") {
        try {
            const res = await axios.get('http://localhost:3000/api/oldestBlogsOfUser');
            renderBlogs(res.data);
        } catch (error) {
            console.error(error);
        }
    }
}

function timeAgo(timestamp) {
    const time = new Date(timestamp).getTime();
    const seconds = Math.floor((Date.now() - time) / 1000);
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    for (let key in intervals) {
        const value = intervals[key];
        if (seconds >= value) {
            const count = Math.floor(seconds / value);
            return `${count} ${key}${count > 1 ? 's' : ''} ago`;
        }
    }
    return "just now";
}

document.getElementById('blogForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const uid = user.id;
    try {
        let title = document.getElementById("blogTitle").value;
        let author = document.getElementById("blogAuthor").value;
        let desc = document.getElementById("blogDescription").value;
        let img = document.querySelector('#blogImage').files[0];
        if (title.trim() == "" || author.trim() == "" || desc.trim() == "" || !img) {
            Swal.fire({
                icon: "error",
                title: "Missing Information!",
                text: "Please fill in all required fields"
            });
            this.reset();
            return;
        }
        if (img) {
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = async function(e) {
                const imgURL = e.target.result;
                blogs.push({ title, author, desc, id: Date.now(), uid, imgURL, createdAt: Date.now() });
                const res = await axios.post('http://localhost:3000/api/postBlog', { title, author, desc, uid, imgURL });
                Swal.fire({
                    title: "Blog Published!",
                    text: "Your blog post has been published successfully",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                getBlogsData();
            }
        }
        this.reset();
    } catch (error) {
        console.log(error);
    }
});

const logout = async () => {
    try {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.post("http://localhost:3000/api/logout", { withCredentials: true });
                Swal.fire({
                    title: "Logged out!",
                    text: "You have been successfully logged out",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                setTimeout(() => {
                    window.location.href = "/index.html";
                }, 1000);
            }
        });
    } catch (err) {
        console.error(err);
    }
}
