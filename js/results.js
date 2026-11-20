// ==========================================
// UTP STUDENT PORTAL - ACADEMIC RESULTS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // 1. CHECK LOGIN SESSION
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

    document.getElementById("topbarStudentName")
        .textContent = student.fullName;

    const initials = student.fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(name => name.charAt(0).toUpperCase())
        .join("");

    document.getElementById("userInitials")
        .textContent = initials;

    // Shared navigation and logout are handled by common.js.

    // ======================================
    // 5. GRADE POINT SCALE
    // ======================================

    const gradePoints = {
        "A+": 4.00,
        "A": 4.00,
        "A-": 3.67,
        "B+": 3.33,
        "B": 3.00,
        "B-": 2.67,
        "C+": 2.33,
        "C": 2.00,
        "C-": 1.67,
        "D+": 1.33,
        "D": 1.00,
        "F": 0.00
    };

    // ======================================
    // 6. SAMPLE ACADEMIC RESULTS
    // ======================================

    const academicResults = [
        {
            semester: 3,
            subjects: [
                {
                    code: "IMS301",
                    name: "Information Systems",
                    credits: 3,
                    grade: "A"
                },
                {
                    code: "MGT301",
                    name: "Management Principles",
                    credits: 3,
                    grade: "A-"
                },
                {
                    code: "ICT301",
                    name: "Database Fundamentals",
                    credits: 3,
                    grade: "B+"
                },
                {
                    code: "ECO301",
                    name: "Business Economics",
                    credits: 3,
                    grade: "B"
                }
            ]
        },
        {
            semester: 4,
            subjects: [
                {
                    code: "IMS401",
                    name: "Information Management",
                    credits: 3,
                    grade: "A"
                },
                {
                    code: "MGT401",
                    name: "Organizational Behaviour",
                    credits: 3,
                    grade: "A-"
                },
                {
                    code: "ICT401",
                    name: "Business Analytics",
                    credits: 3,
                    grade: "B+"
                },
                {
                    code: "STA401",
                    name: "Statistics",
                    credits: 3,
                    grade: "A-"
                }
            ]
        },
        {
            semester: 5,
            subjects: [
                {
                    code: "IMS566",
                    name: "Advanced Web Design",
                    credits: 3,
                    grade: "A"
                },
                {
                    code: "IMS565",
                    name: "Project Management",
                    credits: 3,
                    grade: "A-"
                },
                {
                    code: "MGT555",
                    name: "Business Strategy",
                    credits: 3,
                    grade: "B+"
                },
                {
                    code: "ICT502",
                    name: "Database Management",
                    credits: 3,
                    grade: "A"
                }
            ]
        }
    ];

    // ======================================
    // 7. GET HTML ELEMENTS
    // ======================================

    const semesterFilter = document.getElementById(
        "semesterFilter"
    );

    const resultsTableBody = document.getElementById(
        "resultsTableBody"
    );

    const semesterGPA = document.getElementById(
        "semesterGPA"
    );

    const cumulativeGPA = document.getElementById(
        "cumulativeGPA"
    );

    const semesterCredits = document.getElementById(
        "semesterCredits"
    );

    const tableTotalCredits = document.getElementById(
        "tableTotalCredits"
    );

    const tableTotalPoints = document.getElementById(
        "tableTotalPoints"
    );

    const resultsSubtitle = document.getElementById(
        "resultsSubtitle"
    );

    // ======================================
    // 8. CALCULATE SEMESTER TOTALS
    // ======================================

    function calculateSemester(result) {

        let totalCredits = 0;
        let totalQualityPoints = 0;

        result.subjects.forEach(function(subject) {

            const point = gradePoints[subject.grade];

            if (point === undefined) {
                throw new Error(
                    "Unknown grade: " + subject.grade
                );
            }

            totalCredits += subject.credits;

            totalQualityPoints += subject.credits * point;

        });

        const gpa = totalCredits > 0
            ? totalQualityPoints / totalCredits
            : 0;

        return {
            credits: totalCredits,
            qualityPoints: totalQualityPoints,
            gpa: gpa
        };

    }

    // ======================================
    // 9. CALCULATE CUMULATIVE GPA
    // ======================================

    function calculateCGPA(selectedSemester) {

        let cumulativeCredits = 0;
        let cumulativeQualityPoints = 0;

        academicResults.forEach(function(result) {

            if (result.semester <= selectedSemester) {

                const totals = calculateSemester(result);

                cumulativeCredits += totals.credits;

                cumulativeQualityPoints += totals.qualityPoints;

            }

        });

        return cumulativeCredits > 0
            ? cumulativeQualityPoints / cumulativeCredits
            : 0;

    }

    // ======================================
    // 10. GRADE BADGE COLOURS
    // ======================================

    function getGradeClass(grade) {

        const point = gradePoints[grade];

        if (point >= 3.67) {
            return "grade-excellent";
        }

        if (point >= 3.00) {
            return "grade-good";
        }

        if (point >= 2.00) {
            return "grade-average";
        }

        return "grade-low";

    }

    // ======================================
    // 11. RENDER SUBJECT RESULTS
    // ======================================

    function renderResults(selectedSemester) {

        const result = academicResults.find(
            item => item.semester === selectedSemester
        );

        if (!result) {
            return;
        }

        // Remove previous table rows
        resultsTableBody.replaceChildren();

        result.subjects.forEach(function(subject) {

            const point = gradePoints[subject.grade];

            const qualityPoints = subject.credits * point;

            const row = document.createElement("tr");

            const values = [
                subject.code,
                subject.name,
                subject.credits,
                subject.grade,
                point.toFixed(2),
                qualityPoints.toFixed(2)
            ];

            values.forEach(function(value, index) {

                const cell = document.createElement("td");

                if (index === 0) {

                    const span = document.createElement("span");
                    span.className = "result-code";
                    span.textContent = value;
                    cell.appendChild(span);

                } else if (index === 1) {

                    const span = document.createElement("span");
                    span.className = "result-name";
                    span.textContent = value;
                    cell.appendChild(span);

                } else if (index === 3) {

                    const badge = document.createElement("span");

                    badge.className =
                        "grade-badge " +
                        getGradeClass(subject.grade);

                    badge.textContent = value;
                    cell.appendChild(badge);

                } else {

                    cell.textContent = value;

                }

                row.appendChild(cell);

            });

            resultsTableBody.appendChild(row);

        });

        // Calculate selected semester
        const totals = calculateSemester(result);

        semesterGPA.textContent = totals.gpa.toFixed(2);

        semesterCredits.textContent = totals.credits;

        tableTotalCredits.textContent = totals.credits;

        tableTotalPoints.textContent =
            totals.qualityPoints.toFixed(2);

        // Calculate cumulative GPA
        const cgpa = calculateCGPA(selectedSemester);

        cumulativeGPA.textContent = cgpa.toFixed(2);

        resultsSubtitle.textContent =
            "Semester " + selectedSemester +
            " academic results";

    }

    // ======================================
    // 12. CHART.JS PERFORMANCE GRAPH
    // ======================================

    const chartCanvas = document.getElementById(
        "resultsChart"
    );

    let performanceChart = null;

    function renderChart() {

        if (!chartCanvas || typeof Chart === "undefined") {
            console.warn("Chart.js is not available.");
            return;
        }

        const sortedResults = [...academicResults].sort(
            (a, b) => a.semester - b.semester
        );

        const labels = sortedResults.map(
            result => "Semester " + result.semester
        );

        const gpaValues = sortedResults.map(
            result => calculateSemester(result).gpa
        );

        const cgpaValues = sortedResults.map(
            result => calculateCGPA(result.semester)
        );

        performanceChart = new Chart(chartCanvas, {

            type: "line",

            data: {
                labels: labels,

                datasets: [
                    {
                        label: "GPA",
                        data: gpaValues,
                        borderColor: "#0d9488",
                        backgroundColor: "rgba(13,148,136,0.1)",
                        borderWidth: 3,
                        tension: 0.3,
                        fill: false,
                        pointRadius: 5
                    },
                    {
                        label: "CGPA",
                        data: cgpaValues,
                        borderColor: "#2563eb",
                        backgroundColor: "rgba(37,99,235,0.1)",
                        borderWidth: 3,
                        tension: 0.3,
                        fill: false,
                        pointRadius: 5
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom"
                    },

                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ": " +
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
                            text: "Grade Point Average"
                        }
                    }
                }
            }

        });

    }

    // ======================================
    // 13. SEMESTER FILTER EVENT
    // ======================================

    semesterFilter.addEventListener("change", function() {

        const selectedSemester = Number(
            semesterFilter.value
        );

        renderResults(selectedSemester);

    });

    // ======================================
    // 14. INITIAL DISPLAY
    // ======================================

    renderResults(Number(semesterFilter.value));

    renderChart();

});
