let loginMsgTimeout, loginState = "signin"

$(document).ready(() => {
    if (user) window.location.href = "home.html"
})

function saveUser(name, id) {
    user = { name, id }
    localStorage.setItem("user", JSON.stringify(user))
}

function changeLoginState(state) {
    $("input").val("")
    const opp = (state === "signin") ? "signup" : "signin"
    const txt = (state === "signin") ? "Sign In" : "Sign Up"
    loginState = state
    $(`#${opp}-btn`).removeClass("btn-gradient")
    $(`#${state}-btn`).addClass("btn-gradient")
    $("#login-btn").html(txt)
    if (state === "signin") return $("#no-acct-box").show(200)
    return $("#no-acct-box").hide(200)
}

function say(type, msg) {
    $(`#login-${(type === "error") ? "success" : "error"}-msg`).hide()
    $(`#login-${type}-msg`).html(msg)
    $(`#login-${type}-msg`).show(200)
    clearInterval(loginMsgTimeout)
    loginMsgTimeout = setTimeout(() => {
        $(`#login-${type}-msg`).hide(200)
    }, 2000)
}

$("#login-btn").click(event => {
    if (!$("#firstname-inp").val()) return
    event.preventDefault()
    if (loginState === "signin") {
        login($("#firstname-inp").val(), $("#lastname-inp").val()).then(data => {
            if (!data.success) return say("error", "Username doesn't exist")
            saveUser(data.user.username, data.user.id)
            window.location.href = "home.html"
        })
    } else {
        createUser($("#firstname-inp").val(), $("#lastname-inp").val()).then(data => {
            say("success", `User ${data} has been created`)
            changeLoginState("signin")
        })
    }
})

$("#signin-btn").click(() => {
    changeLoginState("signin")
})

$("#signup-btn, #no-acct-box").click(() => {
    changeLoginState("signup")
})