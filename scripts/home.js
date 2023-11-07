let page = 1
let isReversed, isNonText = false

$(document).ready(() => {
    $("#postview-box").hide()
    if (!user) window.location.href = "login.html"
    $("#username").html(user.name)
    generatePage()
})

function generatePage() {
    isReversed, isNonText = false
    $("#arrow").html(`${(isReversed) ? "↓" : "↑"}`)
    $("#nontext-btn").html(`${(isNonText) ? "Hide non-text posts" : "Show non-text posts"}`)
    startLoading()
    getPosts(page).then(posts => {
        $("#loading-box").hide()
        $("#posts").empty()
        posts.forEach(post => {
            if (post.post.includes("</") || (post.post.startsWith("<") && post.post.endsWith(">"))) return
            generatePost(post)
        })
    })
}

function prevPage() {
    $("#end-of-page").hide(200)
    if (page <= 1) return
    page--
    generatePage()
}

function nextPage() {
    if (!$("#posts").html()) {
        $("#end-of-page").show(200)
        return
    }
    page++
    generatePage()
}

$("#likes-btn").click(() => {
    window.location.href = "likes.html"
})

$("#logout-btn").click(() => {
    user = null
    localStorage.removeItem("user")
    window.location.href = "index.html"
})

$("#nontext-btn").click(() => {
    isNonText = !isNonText
    if (!isNonText) return generatePage()
    $("#nontext-btn").html(`${(isNonText) ? "Hide non-text posts" : "Show non-text posts"}`)
    startLoading()
    getPosts(page).then(posts => {
        $("#loading-box").hide()
        $("#posts").empty()
        posts.forEach(post => {
            if (!(post.post.includes("</") || (post.post.startsWith("<") && post.post.endsWith(">")))) return
            generatePost(post)
        })
    })
})
$("#sortbydate-btn").click(() => {
    startLoading()
    getPosts(page).then(posts => {
        if (!isReversed) {
            posts.reverse()
        }
        isReversed = !isReversed
        $("#arrow").html(`${(isReversed) ? "↓" : "↑"}`)
        $("#loading-box").hide()
        $("#posts").empty()
        posts.forEach(post => {
            generatePost(post)
        })
    })
})
$("#nextpage-btn").click(() => {
    nextPage()
})
$("#prevpage-btn").click(() => {
    prevPage()
})
