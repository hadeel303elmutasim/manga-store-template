let username = document.querySelector("#username")
let password = document.querySelector("#password")
let email = document.querySelector("#email")
let registerbtn = document.querySelector("#sign_up")

registerbtn.addEventListener("click" , function (e){
    e.preventDefault()
    if(username.value === "" || password.value === "" || email.value === ""){
        alert("Please fill in all fields")
    }else{
        localStorage.setItem("username",username.value)
        localStorage.setItem("password",password.value)
        localStorage.setItem("email",email.value)

        alert("Registration successful")
        setTimeout(() => {
            window.location = "login.html"
        }, 1500)
    }
})
