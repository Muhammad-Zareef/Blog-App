
document.addEventListener("DOMContentLoaded", () => {
    checkUserRole();
    getUsersAndBlogs();
});

async function checkUserRole() {
    try {
        const res = await axios.get("http://localhost:3000/admin/dashboard", { withCredentials: true });
        document.querySelector('.user-name').innerHTML = res.data.admin.fullName;
    } catch (err) {
        window.location.href = "/index.html";
        console.log(err);
    }
}

const getUsersAndBlogs = async () => {
    try {
        const res = await axios.get("http://localhost:3000/admin/getUsersAndBlogs", { withCredentials: true });
        renderNumbers(res.data);
        renderPosts(res.data.blogs);
        renderUsers(res.data.users);
    } catch (err) {
        console.log(err);
    }
}

const getBlogs = async () => {
    try {
        const res = await axios.get("http://localhost:3000/admin/getBlogs", { withCredentials: true });
        renderPosts(res.data);
    } catch (err) {
        console.log(err);
    }
}

const getUsers = async () => {
    try {
        const res = await axios.get("http://localhost:3000/admin/getUsers", { withCredentials: true });
        renderUsers(res.data);
    } catch (err) {
        console.log(err);
    }
}

const renderNumbers = (data) => {
    document.querySelector('.total-posts').innerHTML = data.blogs.length;;
    document.querySelector('.published-posts').innerHTML = data.blogs.length;;
    document.querySelector('.total-users').innerHTML = data.users.length;;
}

const renderPosts = (blogs) => {
    let postBody = document.getElementById('post-body');
    postBody.innerHTML = "";
    blogs.forEach(blog => {
        postBody.innerHTML += `
        <tr>
            <td>${blog.title}</td>
            <td class="d-none d-md-table-cell">${blog.author}</td>
            <td>
                <span class="status-badge status-published">Published</span>
            </td>
            <td class="d-none d-sm-table-cell">${new Date(blog.createdAt).toLocaleString('en-GB').split(',')[0]}</td>
            <td>
                <i class="fas fa-edit action-icon action-edit" onclick="openBlogUpdateModal('${blog._id}', '${blog.title}', '${blog.author}', '${blog.desc}')" title="Edit" data-bs-toggle="modal" data-bs-target="#updatePostModal"></i>
                <i class="fas fa-trash action-icon action-delete" onclick="deleteBlog('${blog._id}')" title="Delete"></i>
            </td>
        </tr>
        `;
    });
}

const renderUsers = (users) => {
    let userBody = document.getElementById('user-body');
    userBody.innerHTML = "";
    users.forEach(user => {
        userBody.innerHTML += `
        <tr>
            <td>${user.fullName}</td>
            <td class="d-none d-md-table-cell">${user.email}</td>
            <td>
                <span class="status-badge status-published">Active</span>
            </td>
            <td class="d-none d-sm-table-cell">${new Date(user.createdAt).toLocaleString('en-GB').split(',')[0]}</td>
            <td>
                <i class="fas fa-edit action-icon action-edit" onclick="openUserUpdateModal('${user._id}', '${user.fullName}', '${user.email}', '${user.role}', '${user.status}')" title="Edit" data-bs-toggle="modal" data-bs-target="#updateUserModal"></i>
                <i class="fas fa-trash action-icon action-delete" onclick="deleteUser('${user._id}')" title="Delete"></i>
            </td>
        </tr>
        `;
    });
}

const openBlogUpdateModal = (id, title, author, description) => {
    document.getElementById('postId').value = id;
    document.getElementById('postTitle').value = title;
    document.getElementById('postAuthor').value = author;
    document.getElementById('postDescription').value = description;
}

const savePostBtn = document.getElementById('savePostChanges');
savePostBtn.addEventListener('click', async function() {
    const id = document.getElementById('postId').value;
    const title = document.getElementById('postTitle').value;
    const author = document.getElementById('postAuthor').value;
    const desc = document.getElementById('postDescription').value;
    if (!title || !author || !desc) {
        Swal.fire({
            icon: "error",
            title: "Missing Information!",
            text: "Please fill in all required fields"
        });
        return;
    }
    Swal.fire({
        title: "Updated Successfully",
        text: "Your changes have been saved",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
    });
    await axios.put(`http://localhost:3000/admin/updateBlog/${id}`, {title, author, desc});
    const modal = bootstrap.Modal.getInstance(document.getElementById('updatePostModal'));
    modal.hide();
    getBlogs();
});

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
                await axios.delete(`http://localhost:3000/admin/deleteBlog/${id}`);
                Swal.fire({
                    title: "Deleted!",
                    text: "The blog post has been successfully deleted",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                getBlogs();
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const openUserUpdateModal = (id, name, email, role, status) => {
    document.getElementById('userId').value = id;
    document.getElementById('userName').value = name;
    document.getElementById('userEmail').value = email;
    const roles = document.getElementById('role');
    role == "admin" ? roles[0].selected = true : roles[1].selected = true;
}

const updateUser = async () => {
    try {
        const id = document.getElementById('userId').value;
        const fullName = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const role = document.getElementById('role').value;
        if (!id || !fullName || !email || !role) {
            Swal.fire({
                icon: "error",
                title: "Missing Information!",
                text: "Please fill in all required fields"
            });
            return;
        }
        Swal.fire({
            title: "Updated Successfully",
            text: "Your changes have been saved",
            icon: "success",
            showConfirmButton: false,
            timer: 2000
        });
        const updateModal = bootstrap.Modal.getInstance(document.getElementById('updateUserModal'));
        updateModal.hide();
        await axios.put(`http://localhost:3000/admin/updateUser/${id}`, {fullName, email, role});
        getUsers();
    } catch (error) {
        console.log(error);
    }
}

const deleteUser = (id) => {
    try {
        Swal.fire({
            title: "Are you sure?",
            text: "This User will be permanently deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete(`http://localhost:3000/admin/deleteUser/${id}`);
                Swal.fire({
                    title: "Deleted!",
                    text: "The User has been successfully deleted",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                getUsers();
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', logout);

async function logout() {
    Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out",
        icon: "success",
        showConfirmButton: false,
        timer: 1250
    });
    try {
        await axios.post("http://localhost:3000/admin/logout", { withCredentials: true });
        setTimeout(() => {
            window.location.href = "/index.html";
        }, 1000);
    } catch (err) {
        console.log(err);
    }
}

