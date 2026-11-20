// ==========================================
// UTP STUDENT PORTAL - CLASS TIMETABLE
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

    const topbarStudentName = document.getElementById(
        "topbarStudentName"
    );

    const userInitials = document.getElementById(
        "userInitials"
    );

    topbarStudentName.textContent = student.fullName;

    const initials = student.fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(name => name.charAt(0).toUpperCase())
        .join("");

    userInitials.textContent = initials;

    // Shared navigation and logout are handled by common.js.

    // ======================================
    // 5. SAMPLE CLASS DATA
    // ======================================

    const timetable = [
        {
            day: "Monday",
            code: "IMS566",
            course: "Advanced Web Design",
            start: "09:00",
            end: "11:00",
            lecturer: "Dr. Aisyah Rahman",
            room: "Lab 2"
        },
        {
            day: "Monday",
            code: "IMS565",
            course: "Project Management",
            start: "14:00",
            end: "16:00",
            lecturer: "Dr. Farid Hassan",
            room: "Room B204"
        },
        {
            day: "Tuesday",
            code: "MGT555",
            course: "Business Strategy",
            start: "10:00",
            end: "12:00",
            lecturer: "Dr. Nurul Huda",
            room: "Room A101"
        },
        {
            day: "Wednesday",
            code: "ICT502",
            course: "Database Management",
            start: "08:00",
            end: "10:00",
            lecturer: "Mr. Daniel Lee",
            room: "Computer Lab 1"
        },
        {
            day: "Thursday",
            code: "IMS566",
            course: "Advanced Web Design",
            start: "11:00",
            end: "13:00",
            lecturer: "Dr. Aisyah Rahman",
            room: "Lab 2"
        },
        {
            day: "Friday",
            code: "IMS565",
            course: "Project Management",
            start: "09:00",
            end: "11:00",
            lecturer: "Dr. Farid Hassan",
            room: "Room B204"
        }
    ];

    // ======================================
    // 6. WEEKDAY ORDER
    // ======================================

    const weekdays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
    ];

    // ======================================
    // 7. GET HTML ELEMENTS
    // ======================================

    const dayFilter = document.getElementById("dayFilter");

    const resetDayFilter = document.getElementById(
        "resetDayFilter"
    );

    const timetableContainer = document.getElementById(
        "timetableContainer"
    );

    const noClasses = document.getElementById("noClasses");

    const totalClasses = document.getElementById(
        "totalClasses"
    );

    const totalCourses = document.getElementById(
        "totalCourses"
    );

    const totalHours = document.getElementById(
        "totalHours"
    );

    const scheduleSubtitle = document.getElementById(
        "scheduleSubtitle"
    );

    // ======================================
    // 8. CONVERT TIME TO MINUTES
    // ======================================

    function timeToMinutes(time) {

        const [hours, minutes] = time
            .split(":")
            .map(Number);

        return hours * 60 + minutes;

    }

    // ======================================
    // 9. CREATE CLASS DETAIL
    // ======================================

    function createDetail(iconClass, text) {

        const detail = document.createElement("div");
        detail.className = "timetable-detail";

        const icon = document.createElement("i");
        icon.className = "bi " + iconClass;

        const span = document.createElement("span");
        span.textContent = text;

        detail.appendChild(icon);
        detail.appendChild(span);

        return detail;

    }

    // ======================================
    // 10. CREATE CLASS CARD
    // ======================================

    function createClassCard(item) {

        const card = document.createElement("article");
        card.className = "timetable-class-card";

        const top = document.createElement("div");
        top.className = "timetable-class-top";

        const code = document.createElement("span");
        code.className = "timetable-course-code";
        code.textContent = item.code;

        const time = document.createElement("span");
        time.className = "timetable-time";
        time.textContent = item.start + " - " + item.end;

        top.appendChild(code);
        top.appendChild(time);

        const name = document.createElement("h6");
        name.className = "timetable-course-name";
        name.textContent = item.course;

        const lecturer = createDetail(
            "bi-person",
            item.lecturer
        );

        const room = createDetail(
            "bi-geo-alt",
            item.room
        );

        card.appendChild(top);
        card.appendChild(name);
        card.appendChild(lecturer);
        card.appendChild(room);

        return card;

    }

    // ======================================
    // 11. UPDATE SUMMARY CARDS
    // ======================================

    function updateSummary(classList) {

        // Total class sessions
        totalClasses.textContent = classList.length;

        // Count unique courses
        const uniqueCourses = new Set(
            classList.map(item => item.code)
        );

        totalCourses.textContent = uniqueCourses.size;

        // Calculate total scheduled minutes
        const totalMinutes = classList.reduce(
            function(sum, item) {

                const duration =
                    timeToMinutes(item.end) -
                    timeToMinutes(item.start);

                return sum + duration;

            },
            0
        );

        const hours = totalMinutes / 60;

        totalHours.textContent =
            Number.isInteger(hours)
                ? hours
                : hours.toFixed(1);

    }

    // ======================================
    // 12. RENDER TIMETABLE
    // ======================================

    function renderTimetable(selectedDay) {

        timetableContainer.replaceChildren();

        const filteredClasses = timetable.filter(
            function(item) {

                return selectedDay === "all" ||
                    item.day === selectedDay;

            }
        );

        updateSummary(filteredClasses);

        noClasses.classList.toggle(
            "d-none",
            filteredClasses.length > 0
        );

        scheduleSubtitle.textContent =
            selectedDay === "all"
                ? "All scheduled classes"
                : selectedDay + " classes";

        if (filteredClasses.length === 0) {
            return;
        }

        const visibleDays = selectedDay === "all"
            ? weekdays
            : [selectedDay];

        visibleDays.forEach(function(day) {

            const dayClasses = filteredClasses
                .filter(item => item.day === day)
                .sort(function(a, b) {
                    return timeToMinutes(a.start) -
                           timeToMinutes(b.start);
                });

            if (dayClasses.length === 0) {
                return;
            }

            const daySection = document.createElement("section");
            daySection.className = "timetable-day";

            const header = document.createElement("div");
            header.className = "timetable-day-header";

            const heading = document.createElement("h6");
            heading.textContent = day;

            const count = document.createElement("span");
            count.className = "timetable-day-count";

            count.textContent =
                dayClasses.length +
                (dayClasses.length === 1
                    ? " class"
                    : " classes");

            header.appendChild(heading);
            header.appendChild(count);

            const classList = document.createElement("div");
            classList.className = "timetable-class-list";

            dayClasses.forEach(function(item) {

                classList.appendChild(
                    createClassCard(item)
                );

            });

            daySection.appendChild(header);
            daySection.appendChild(classList);

            timetableContainer.appendChild(daySection);

        });

    }

    // ======================================
    // 13. FILTER EVENT
    // ======================================

    dayFilter.addEventListener("change", function() {

        renderTimetable(dayFilter.value);

    });

    // ======================================
    // 14. RESET FILTER
    // ======================================

    resetDayFilter.addEventListener("click", function() {

        dayFilter.value = "all";

        renderTimetable("all");

    });

    // ======================================
    // 15. INITIAL DISPLAY
    // ======================================

    renderTimetable(dayFilter.value);

});
