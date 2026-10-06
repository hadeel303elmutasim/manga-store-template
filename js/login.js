let username = document.querySelector("#username")
let password = document.querySelector("#password")
let loginbtn = document.querySelector("#sign_in")

let getUsername = localStorage.getItem("username")
let getPassword = localStorage.getItem("password")

loginbtn.addEventListener("click" , function (e){
    e.preventDefault()
    if(username.value === ""  || password.value === ""){
        alert("Please fill in all fields")
    }else if(getUsername && getUsername.trim() === username.value && getPassword && getPassword.trim() === password.value){
        alert("Login successful")  
         setTimeout(() => {
            window.location = "../index.html"
        }, 1500)  
    }else{
        alert("Invalid username or password")
    }

})
