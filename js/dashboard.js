// ==========================================
// UTP STUDENT PORTAL - DASHBOARD JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 1. CHECK STUDENT LOGIN
    // ======================================

    const savedStudent = sessionStorage.getItem(
        "utpCurrentStudent"
    );

    if (!savedStudent) {
        window.location.replace("login.html");
        return;
    }

    let student;

    try {
        student = JSON.parse(savedStudent);

        if (!student.studentId || !student.fullName) {
            throw new Error("Invalid student session");
        }

    } catch (error) {
        sessionStorage.removeItem("utpCurrentStudent");
        window.location.replace("login.html");
        return;
    }

    // ======================================
    // 2. DISPLAY STUDENT INFORMATION
    // ======================================

    const studentName = document.getElementById(
        "studentName"
    );

    const topbarStudentName = document.getElementById(
        "topbarStudentName"
    );

    const displayStudentId = document.getElementById(
        "displayStudentId"
    );

    const userInitials = document.getElementById(
        "userInitials"
    );

    studentName.textContent = student.fullName;

    topbarStudentName.textContent = student.fullName;

    displayStudentId.textContent = student.studentId;

    // Create initials from student's name
    const initials = student.fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(name => name.charAt(0).toUpperCase())
        .join("");

    userInitials.textContent = initials;

    // Shared navigation and logout are handled by common.js.

    // ======================================
    // 5. GPA PERFORMANCE CHART
    // ======================================

    const chartCanvas = document.getElementById("gpaChart");

    // Fictional GPA values for demonstration
    const semesterLabels = [
        "Semester 1",
        "Semester 2",
        "Semester 3",
        "Semester 4",
        "Semester 5"
    ];

    const semesterGPA = [
        3.10,
        3.25,
        3.45,
        3.35,
        3.60
    ];

    if (chartCanvas && typeof Chart !== "undefined") {

        new Chart(chartCanvas, {

            type: "line",

            data: {
                labels: semesterLabels,

                datasets: [{
                    label: "Semester GPA",
                    data: semesterGPA,

                    borderColor: "#0d9488",
                    backgroundColor: "rgba(13,148,136,0.12)",

                    borderWidth: 3,
                    tension: 0.35,
                    fill: true,

                    pointBackgroundColor: "#0d9488",
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                interaction: {
                    intersect: false,
                    mode: "index"
                },

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return "GPA: " +
                                    Number(context.parsed.y).toFixed(2);
                            }
                        }
                    }
                },

                scales: {
                    y: {
                        min: 0,
                        max: 4,

                        ticks: {
                            stepSize: 1
                        },

                        title: {
                            display: true,
                            text: "GPA"
                        }
                    },

                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }

        });

    } else {
        console.warn("Chart.js is not available.");
    }

});
