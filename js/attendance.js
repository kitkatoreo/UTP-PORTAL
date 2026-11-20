document.addEventListener("DOMContentLoaded", function () {

    // CHECK LOGIN
    let student;

    try {
        student = JSON.parse(
            sessionStorage.getItem("utpCurrentStudent")
        );

        if (!student || !student.studentId) {
            throw new Error("Not logged in");
        }
    } catch (error) {
        window.location.replace("login.html");
        return;
    }

    // STUDENT DETAILS
    const studentName = student.fullName || "Student";

    const nameElement =
        document.getElementById("topbarStudentName");

    if (nameElement) nameElement.textContent = studentName;

    const initials = document.getElementById("userInitials");

    if (initials) {
        initials.textContent = studentName.trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(name => name[0].toUpperCase())
            .join("");
    }

    // Shared navigation and logout are handled by common.js.

    // ATTENDANCE STORAGE
    const storageKey = "utpAttendance_" + student.studentId;

    let attendance = [];

    try {
        const saved = localStorage.getItem(storageKey);
        if (saved !== null) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) attendance = parsed;
        }
    } catch (error) {
        console.error("Unable to load attendance", error);
    }

    function saveData() {
        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(attendance)
            );
            return true;
        } catch (error) {
            alert("Unable to save attendance.");
            return false;
        }
    }

    // ELEMENTS
    const table = document.getElementById("attendanceTableBody");
    const form = document.getElementById("attendanceForm");

    const search = document.getElementById("attendanceSearch");
    const filter = document.getElementById("attendanceFilter");

    const modal = new bootstrap.Modal(
        document.getElementById("attendanceModal")
    );

    let editId = null;

    // DISPLAY RECORDS

function render() {

    table.innerHTML = "";

    const filtered = attendance.filter(item => {

        const matchSearch = item.course.toLowerCase()
            .includes(search.value.toLowerCase());

        const matchStatus =
            filter.value === "all" ||
            item.status === filter.value;

        return matchSearch && matchStatus;
    });

    filtered.sort((a, b) => b.date.localeCompare(a.date));

    filtered.forEach(item => {

        const row = document.createElement("tr");

        // COURSE
        const courseCell = document.createElement("td");
        courseCell.textContent = item.course;

        // DATE
        const dateCell = document.createElement("td");
        dateCell.textContent = item.date;

        // STATUS
        const statusCell = document.createElement("td");

        const badge = document.createElement("span");
        badge.className = item.status === "Present"
            ? "badge bg-success-subtle text-success"
            : "badge bg-danger-subtle text-danger";

        badge.textContent = item.status;
        statusCell.appendChild(badge);

        // ACTIONS
        const actionCell = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.className = "btn btn-sm btn-outline-primary me-2";
        editBtn.innerHTML = '<i class="bi bi-pencil"></i>';

        editBtn.addEventListener("click", function () {
            editRecord(item.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-sm btn-outline-danger";
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';

        deleteBtn.addEventListener("click", function () {
            deleteRecord(item.id);
        });

        actionCell.append(editBtn, deleteBtn);

        row.append(
            courseCell,
            dateCell,
            statusCell,
            actionCell
        );

        table.appendChild(row);
    });

    document.getElementById("emptyAttendance")
        .classList.toggle("d-none", filtered.length > 0);

    updateSummary();
}

// ATTENDANCE PIE CHART
const chartCanvas = document.getElementById("attendanceChart");

const attendanceChart = new Chart(chartCanvas, {
    type: "doughnut",

    data: {
        labels: ["Present", "Absent"],

        datasets: [{
            data: [0, 0],
            backgroundColor: [
                "#22c55e",
                "#ef4444"
            ],
            borderWidth: 0,
            hoverOffset: 5
        }]
    },

    options: {
        responsive: true,
        cutout: "78%",

        plugins: {
            legend: {
                display: false
            },

            tooltip: {
                enabled: true
            }
        }
    }
});

    // SUMMARY CARDS

function updateSummary() {

    const present = attendance.filter(
        a => a.status === "Present"
    ).length;

    const absent = attendance.filter(
        a => a.status === "Absent"
    ).length;

    const total = present + absent;

    const rate = total > 0
        ? (present / total) * 100
        : 0;

    document.getElementById("attendanceRate")
        .textContent = rate.toFixed(1) + "%";

    document.getElementById("presentCount")
        .textContent = present;

    document.getElementById("absentCount")
        .textContent = absent;

        attendanceChart.data.datasets[0].data = [present, absent];
attendanceChart.update();
}

    // ADD ATTENDANCE
    document.getElementById("addAttendanceBtn")
        .addEventListener("click", function () {

            editId = null;
            form.reset();

            document.getElementById("modalTitle")
                .textContent = "Add Attendance";

            const today = new Date();

            document.getElementById("date").value = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, "0"),
                String(today.getDate()).padStart(2, "0")
            ].join("-");

            modal.show();
        });

    // EDIT ATTENDANCE
    function editRecord(id) {

        const record = attendance.find(a => a.id === id);
        if (!record) return;

        editId = id;

        document.getElementById("modalTitle")
            .textContent = "Edit Attendance";

        document.getElementById("course").value = record.course;
        document.getElementById("date").value = record.date;
        document.getElementById("status").value = record.status;

        modal.show();
    }

    // SAVE ATTENDANCE
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const data = {
            course: document.getElementById("course").value,
            date: document.getElementById("date").value,
            status: document.getElementById("status").value
        };

        const previous = [...attendance];

        if (editId !== null) {

            const index = attendance.findIndex(
                a => a.id === editId
            );

            if (index === -1) return;

            attendance[index] = {
                ...attendance[index],
                ...data
            };

        } else {

            attendance.push({
                id: crypto.randomUUID(),
                ...data
            });
        }

        if (!saveData()) {
            attendance = previous;
            return;
        }

        modal.hide();
        render();
    });

    // DELETE ATTENDANCE
    function deleteRecord(id) {

        if (!confirm("Delete this attendance record?")) {
            return;
        }

        const previous = [...attendance];

        attendance = attendance.filter(a => a.id !== id);

        if (!saveData()) {
            attendance = previous;
            return;
        }

        render();
    }

    // SEARCH AND FILTER
    search.addEventListener("input", render);
    filter.addEventListener("change", render);

    // FIRST DISPLAY
    render();

});
