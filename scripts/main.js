let user = JSON.parse(localStorage.getItem("user")) || null
let likes = JSON.parse(localStorage.getItem("likes")) || []

function getAllPosts() {
    return $.ajax({
        url: "http://hyeumine.com/forumGetPosts.php",
        method: "GET"
    }).then(function(data) { return $.parseJSON(data).reverse() })
}

function getPosts(page) {
    return $.ajax({
        url: `http://hyeumine.com/forumGetPosts.php?page=${page}`,
        method: "GET"
    }).then($.parseJSON)
}

function createUser(firstname, lastname) {
    const username = (lastname) ? `${firstname} ${lastname}` : firstname 
    return $.ajax({
        url: "http://hyeumine.com/forumCreateUser.php",
        method: "POST",
        data: { username }
    }).then(() => {return username})
}

function login(firstname, lastname) {
    const username = (lastname) ? `${firstname} ${lastname}` : firstname 
    return $.ajax({
        url: "http://hyeumine.com/forumLogin.php",
        method: "POST",
        data: { username }
    }).then(function(data) { return $.parseJSON(data) })
}

function newPost(id, post) {
    return $.ajax({
        url: "http://hyeumine.com/forumNewPost.php",
        method: "POST",
        data: { id , post }
    }).then()
}

function deletePost(id) {
    return $.ajax({
        url: `http://hyeumine.com/forumDeletePost.php?id=${id}`,
        method: "GET"
    }).then()
}

function replyPost(user_id, post_id, reply) {
    return $.ajax({
        url: "http://hyeumine.com/forumReplyPost.php",
        method: "POST",
        data: { user_id, post_id, reply }
    }).then()
}

function deleteReply(id) {
    return $.ajax({
        url: `http://hyeumine.com/forumDeleteReply.php?id=${id}`,
        method: "GET"
    }).then()
}


$("#logo").click(() => {
    window.location.href = "index.html"
})
