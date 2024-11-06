// /js/login.js
document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "admin123") {
        window.location.href = "../html/admin.html";
    } else if (username === "employee" && password === "employee123") {
        window.location.href = "../html/employee.html";
    } else {
        document.getElementById("loginError").textContent = "Invalid credentials";
    }
});
