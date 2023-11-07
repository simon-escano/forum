$(document).ready(() => {
    if (!user) window.location.href = "login.html"
    $("#username").html(user.name)
    generateLikes()
})

function generateLikes() {
    $("#no-likes").hide()
    $("#posts").empty()
    if (likes.length === 0) return $("#no-likes").show(200)
    startLoading()
    getAllPosts().then(posts => {
        $("#loading-box").hide()
        posts.forEach(post =>{
            if (!likes.has(post.id)) return
            generatePost(post)
        })
        if (!$("#posts").html()) $("#no-likes").show(200)
    })
}

$("#home-btn").click(() => {
    window.location.href = "home.html"
})

$("#logout-btn").click(() => {
    user = null
    localStorage.removeItem("user")
    window.location.href = "index.html"
})
