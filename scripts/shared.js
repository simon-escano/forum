function generatePosts() {
    switch(site()) {
        case "home": return generatePage()
        case "likes": return generateLikes()
    }
}

function generatePost(post) {
    if (post.post === "" || post.post === " ") return deletePost(post.id)
    $("#posts").append(`
    <div class="flex ${(post.uid === user.id) ? "post you" : "post"}">
        <section class="post-txt-area flex">
            <section class="post-info flex">
                <p class="post-user">${(post.uid === user.id) ? "You" : post.user}</p>
                <p class="post-date">${formatTime(post.date)}</p>
            </section>
            <section class="post-txt">
                ${post.post}
            </section>
        </section>
        <section class="post-btns flex">
            <button id="like-btn-${post.id}" class="btn" data-id="${post.id}">
                <img src="images/icons/like.svg" alt="Like">
            </button>
            <button id="replies-btn-${post.id}" class="btn flex">
                <img src="images/icons/comment.svg" alt="Replies">
                <p>${(post.reply && post.reply.length) ? post.reply.length : 0}</p>
            </button>
            <button id="del-btn-${post.id}" class="del-btn btn" data-id="${post.id}">
                <img src="images/icons/trash.svg" alt="Delete">
            </button>
        </section>
    </div>
    `)
    if (likes.has(post.id)) $(`#like-btn-${post.id}`).addClass("liked-btn")
    $(`#replies-btn-${post.id}`).click(function() {
        generatePostView(post.id)
    })
    $(`#like-btn-${post.id}`).click(function() {
        if (likes.has(post.id)) likes.cut(post.id)
        else likes.push(post.id)
        $(this).toggleClass("liked-btn")
        localStorage.setItem("likes", JSON.stringify(likes))
        if (siteIs("likes")) generateLikes()
    })
    $(`#del-btn-${post.id}`).click(function() {
        likes.cut(post.id)
        localStorage.setItem("likes", JSON.stringify(likes))
        startLoading()
        deletePost(post.id).then(() => {
            stopLoading()
            generatePosts()
        })
    })
}

function generatePostView(id) {
    startLoading()
    const get = (siteIs("home")) ? getPosts(page) : getAllPosts()
    get.then(posts => {
        stopLoading()
        const post = posts.find(post => post.id === id)
        $("#postview-box").empty()
        $("#postview-box").html(`
        <button class="close-btn flex" id="close-postview-btn"><img src="images/icons/x.svg"></button>
        <div id="postview-post" class="flex">
            <div id="postview-info" class="flex">
                <p id="postview-user">${post.user}</p>
                <p id="postview-date">${formatDate(post.date)}</p>
            </div>
            <p id="postview-txt">
                ${post.post}
            </p>
        </div>
        ${(post.reply && post.reply.length) ? `<div id="replies" class="flex"></div>`: ``}
        <div id="reply-box" class="flex">
            <input id="reply-inp" placeholder="Say something about ${(post.uid === user.id) ? "your own" : `${post.user}'s`} post">
            <button id="reply-btn" class="btn-gradient">Reply</button>
        </div>
        `)
        if (post.reply && post.reply.length) generateReplies(post)
        function reply() {
            if (!$("#reply-inp").val()) return
            startLoading()
            replyPost(user.id, post.id, $("#reply-inp").val()).then(() => {
                stopLoading()
                generatePosts()
                generatePostView(id)
            })
        }
        $("#reply-inp").on('keydown', (e) => { if (e.key === "Enter") reply() })
        $("#reply-btn").click(reply)
        $("#close-postview-btn").click(hidePopUp)
        $("#postview-box").show(200)
        $("#blank-area").show()
    })
}

function generateReplies(post) {
    post.reply.forEach(reply => {
        $("#replies").append(`
        <div class="${(reply.uid === user.id) ? "reply you flex" : "reply flex"}">
            <div class="flex">
                <div class="reply-info flex">
                    <p class="reply-user">${(reply.uid === user.id) ? "You" : reply.user}</p>
                    <p class="reply-date">${formatTime(reply.date)}</p>
                </div>
                <p class="reply-txt">
                    ${reply.reply}
                </p>
            </div>
            <button id="delreply-btn-${reply.id}" class="del-btn">
                <img src="images/icons/trash.svg">
            </button>
        </div>
        `)
        $(`#delreply-btn-${reply.id}`).click(() => {
            startLoading()
            deleteReply(reply.id).then(() => {
                stopLoading()
                generatePosts()
                generatePostView(post.id)
            })
        })
    })
}

function searchPosts(input) {
    input = input.toLowerCase()
    $("#posts").empty()
    startLoading()
    getAllPosts().then(posts => {
        posts.forEach(post => {
            const postLC = post.post.toLowerCase()
            const userLC = post.user.toLowerCase()
            if (!(postLC.includes(input) || userLC.includes(input))) return
            if (siteIs("home") || (siteIs("likes") && likes.has(post.id))) generatePost(post)
        })
        stopLoading()
    })
}

function formatDate(date) {
    var inputDate = new Date(date)
    inputDate.setHours(inputDate.getHours() + 15)
    var today = new Date()
    if (inputDate.toDateString() === today.toDateString()) return "Today (" + inputDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ")"
    return (inputDate.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }) + " (" + inputDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ")")
}

function formatTime(date) {
    const inputDate = new Date(date)
    inputDate.setHours(inputDate.getHours() + 15)
    const timeDifference = Date.now() - inputDate
    if (timeDifference < 60000) {
        const secs = Math.floor(timeDifference / 1000)
        if (secs <= 0) return `Just now`
        return `${secs} sec${(secs > 1) ? "s" : ""} ago`
    } else if (timeDifference < 3600000) {
        const mins = Math.floor(timeDifference / 60000)
        return `${mins} min${(mins > 1) ? "s" : ""} ago`
    } else if (timeDifference < 86400000) {
        const hrs = Math.floor(timeDifference / 3600000)
        return `${hrs} hr${(hrs > 1) ? "s" : ""} ago`
    } else {
        const days = Math.floor(timeDifference / 86400000)
        return `${days} day${(days > 1) ? "s" : ""} ago`
    }
}

function hidePopUp() {
    $("#blank-area").hide(0)
    $("#newpost-box").hide(200)
    $("#postview-box").hide(200)
}

function site() {
    return (window.location.pathname).split('/').pop().replace(/\.[^/.]+$/, '')
}

function siteIs(site) {
    return (window.location.pathname).endsWith(`${site}.html`)
}

function startLoading() { $("#loading-box").show() }
function stopLoading() { $("#loading-box").hide() }

Array.prototype.has = function(elem) {
    return this.includes(elem)
}

Array.prototype.cut = function(elem) {
    while (this.indexOf(elem) !== -1) this.splice(this.indexOf(elem), 1)
}

$("#post-btn").click(() => {
    if (!$("#newpost-inp").val()) return
    startLoading()
    newPost(user.id, $("#newpost-inp").val()).then(() => {
        stopLoading()
        switch(site()) {
            case "home":
                generatePage()
                return hidePopUp()
            case "likes":
                return window.location.href = "home.html"
        }
    })
})
$(document).on('keydown', (e) => { if (e.key === "Escape") hidePopUp() })
$("#search-btn").click(() => { searchPosts($("#search-box").val()) })
$("#search-box").on('keyup', function(e) {
    if (e.key === "Enter") return searchPosts($(this).val())
    if (((e.ctrlKey || e.metaKey) && e.key === "x") || (e.key === "Backspace" && !$(this).val())) generatePosts()
})
$("#blank-area").click(hidePopUp)
$("#newpost-btn").click(() => {
    $("#blank-area").show()
    $("#posting-as").html(user.name)
    $("#newpost-inp").val("")
    $("#newpost-box").show(200)
})
$("#close-newpost-btn").click(hidePopUp)