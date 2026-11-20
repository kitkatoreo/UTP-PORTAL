// =====================================
// UTP STUDENT PORTAL
// DEMO AUTHENTICATION
// =====================================

// Demo student account
const demoStudent = {
    studentId: "UTP2026001",
    fullName: "Demo Student",
    email: "demo@example.com",
    password: "Student@123"
};

// Get registered accounts
function getStudents() {
    try {
        return JSON.parse(
            localStorage.getItem("utpStudents") || "[]"
        );
    } catch {
        return [];
    }
}

// Display an error message
function showError(elementId, message) {
    const errorBox = document.getElementById(elementId);

    if (errorBox) {
        errorBox.textContent = message;
        errorBox.classList.remove("d-none");
    }
}

// =====================================
// STUDENT LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const studentId = document
            .getElementById("studentId")
            .value.trim()
            .toUpperCase();

        const password = document
            .getElementById("password")
            .value;

        const students = [
            demoStudent,
            ...getStudents()
        ];

        const student = students.find(function(account) {
            return account.studentId === studentId &&
                   account.password === password;
        });

        if (student) {

            // Store non-sensitive session information
            const sessionStudent = {
                studentId: student.studentId,
                fullName: student.fullName,
                email: student.email
            };

            sessionStorage.setItem(
                "utpCurrentStudent",
                JSON.stringify(sessionStudent)
            );

            // Redirect to dashboard
            window.location.href = "dashboard.html";

        } else {

            showError(
                "loginError",
                "Invalid Student ID or password."
            );

        }

    });

}

// =====================================
// STUDENT REGISTRATION
// =====================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const fullName = document
            .getElementById("fullName")
            .value.trim();

        const studentId = document
            .getElementById("registerStudentId")
            .value.trim()
            .toUpperCase();

        const email = document
            .getElementById("email")
            .value.trim();

        const password = document
            .getElementById("registerPassword")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;

        // Validate student ID
        if (!/^UTP\d{7}$/.test(studentId)) {
            showError(
                "registerError",
                "Student ID must follow UTP followed by 7 digits."
            );
            return;
        }

        // Validate password
        if (password !== confirmPassword) {
            showError(
                "registerError",
                "Passwords do not match."
            );
            return;
        }

        const students = getStudents();

        // Check duplicate student ID
        if (
            studentId === demoStudent.studentId ||
            students.some(student =>
                student.studentId === studentId
            )
        ) {
            showError(
                "registerError",
                "This Student ID is already registered."
            );
            return;
        }

        // Save new demo account
        students.push({
            fullName,
            studentId,
            email,
            password
        });

        localStorage.setItem(
            "utpStudents",
            JSON.stringify(students)
        );

        alert("Registration successful! Please log in.");

        window.location.href = "login.html";

    });

}

// =====================================
// SHOW / HIDE PASSWORD
// =====================================

const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {

    togglePassword.addEventListener("click", function() {

        const passwordInput =
            document.getElementById("password");

        const isHidden = passwordInput.type === "password";

        passwordInput.type = isHidden ? "text" : "password";

        togglePassword.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );

        togglePassword.querySelector("i").className =
            isHidden ? "bi bi-eye-slash" : "bi bi-eye";

    });

}
