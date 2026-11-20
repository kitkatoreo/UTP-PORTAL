// ==========================================
// UTP STUDENT PORTAL - MY COURSES
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
            throw new Error("Invalid session");
        }

    } catch (error) {
        sessionStorage.removeItem("utpCurrentStudent");
        window.location.replace("login.html");
        return;
    }

    // ======================================
    // 2. DISPLAY STUDENT INFORMATION
    // ======================================

    const topbarName = document.getElementById(
        "topbarStudentName"
    );

    const avatar = document.getElementById(
        "userInitials"
    );

    topbarName.textContent = student.fullName;

    const initials = student.fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(name => name.charAt(0).toUpperCase())
        .join("");

    avatar.textContent = initials;

    // Shared navigation and logout are handled by common.js.

    // ======================================
    // 5. SAMPLE COURSE DATA
    // ======================================

    const courses = [
        {
            code: "IMS566",
            name: "Advanced Web Design Development",
            lecturer: "Dr. Aisyah Rahman",
            credits: 3,
            semester: 5,
            status: "Active"
        },
        {
            code: "IMS565",
            name: "Project Management",
            lecturer: "Dr. Farid Hassan",
            credits: 3,
            semester: 5,
            status: "Active"
        },
        {
            code: "MGT555",
            name: "Business Strategy",
            lecturer: "Dr. Nurul Huda",
            credits: 3,
            semester: 5,
            status: "Active"
        },
        {
            code: "ICT502",
            name: "Database Management",
            lecturer: "Mr. Daniel Lee",
            credits: 3,
            semester: 5,
            status: "Active"
        },
        {
            code: "ECO415",
            name: "Business Economics",
            lecturer: "Dr. Siti Aminah",
            credits: 3,
            semester: 4,
            status: "Completed"
        },
        {
            code: "STA404",
            name: "Business Statistics",
            lecturer: "Mr. Hafiz Omar",
            credits: 3,
            semester: 4,
            status: "Completed"
        }
    ];

    // ======================================
    // 6. GET HTML ELEMENTS
    // ======================================

    const courseTableBody = document.getElementById(
        "courseTableBody"
    );

    const courseSearch = document.getElementById(
        "courseSearch"
    );

    const semesterFilter = document.getElementById(
        "semesterFilter"
    );

    const totalCourses = document.getElementById(
        "totalCourses"
    );

    const totalCredits = document.getElementById(
        "totalCredits"
    );

    const noCourses = document.getElementById(
        "noCourses"
    );

    const courseCountText = document.getElementById(
        "courseCountText"
    );

    const resetFilters = document.getElementById(
        "resetFilters"
    );

    // ======================================
    // 7. RENDER COURSE TABLE
    // ======================================

    function renderCourses(courseList) {

        // Clear previous table rows
        courseTableBody.replaceChildren();

        // Show empty state if no matches
        noCourses.classList.toggle(
            "d-none",
            courseList.length > 0
        );

        courseList.forEach(function(course) {

            const row = document.createElement("tr");

            const values = [
                course.code,
                course.name,
                course.lecturer,
                course.credits,
                "Semester " + course.semester,
                course.status
            ];

            values.forEach(function(value, index) {

                const cell = document.createElement("td");

                if (index === 0) {
                    const code = document.createElement("span");
                    code.className = "course-code";
                    code.textContent = value;
                    cell.appendChild(code);

                } else if (index === 1) {
                    const name = document.createElement("span");
                    name.className = "course-name";
                    name.textContent = value;
                    cell.appendChild(name);

                } else if (index === 5) {
                    const badge = document.createElement("span");

                    badge.className =
                        "course-status " + value.toLowerCase();

                    badge.textContent = value;
                    cell.appendChild(badge);

                } else {
                    cell.textContent = value;
                }

                row.appendChild(cell);

            });

            courseTableBody.appendChild(row);

        });

        // Update course count
        totalCourses.textContent = courseList.length;

        // Calculate total credit hours
        const credits = courseList.reduce(
            (sum, course) => sum + course.credits,
            0
        );

        totalCredits.textContent = credits;

        courseCountText.textContent =
            "Showing " + courseList.length +
            " of " + courses.length + " courses";

    }

    // ======================================
    // 8. SEARCH AND FILTER
    // ======================================

    function filterCourses() {

        const keyword = courseSearch.value
            .trim()
            .toLowerCase();

        const selectedSemester = semesterFilter.value;

        const filteredCourses = courses.filter(
            function(course) {

                const matchesSearch =
                    course.code.toLowerCase().includes(keyword) ||
                    course.name.toLowerCase().includes(keyword) ||
                    course.lecturer.toLowerCase().includes(keyword);

                const matchesSemester =
                    selectedSemester === "all" ||
                    course.semester === Number(selectedSemester);

                return matchesSearch && matchesSemester;

            }
        );

        renderCourses(filteredCourses);

    }

    // Search while typing
    courseSearch.addEventListener(
        "input",
        filterCourses
    );

    // Filter when semester changes
    semesterFilter.addEventListener(
        "change",
        filterCourses
    );

    // Reset search and filter
    resetFilters.addEventListener("click", function () {

        courseSearch.value = "";
        semesterFilter.value = "all";

        filterCourses();

    });

    // ======================================
    // 9. INITIAL TABLE DISPLAY
    // ======================================

    renderCourses(courses);

});
