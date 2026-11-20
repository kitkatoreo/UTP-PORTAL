document.addEventListener("DOMContentLoaded", function () {

    const student = JSON.parse(
        sessionStorage.getItem("utpCurrentStudent")
    );

    if (!student) {
        window.location.replace("login.html");
        return;
    }

    document.getElementById("profileName").textContent =
        student.fullName;

    document.getElementById("profileId").textContent =
        student.studentId;

    document.getElementById("studentName").textContent =
        student.fullName;

    document.getElementById("studentId").textContent =
        student.studentId;

    document.getElementById("studentEmail").textContent =
        student.email;

});
