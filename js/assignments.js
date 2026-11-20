document.addEventListener("DOMContentLoaded", function () {

    // 1. CHECK STUDENT LOGIN
    let student;

    try {
        student = JSON.parse(
            sessionStorage.getItem("utpCurrentStudent")
        );

        if (!student?.studentId || !student?.fullName) {
            throw new Error("Invalid session");
        }

    } catch (error) {
        window.location.replace("login.html");
        return;
    }

    // 2. STUDENT INFORMATION
    document.getElementById("topbarStudentName").textContent =
        student.fullName;

    document.getElementById("userInitials").textContent =
        student.fullName.trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(name => name[0].toUpperCase())
            .join("");

    // Shared navigation and logout are handled by common.js.

    // 5. LOAD ASSIGNMENTS
    const storageKey =
        "utpAssignments_" + student.studentId;

    const sampleAssignments = [
        {
            id: "a1",
            title: "Web Design Project",
            course: "IMS566",
            dueDate: "2026-12-05",
            priority: "High",
            status: "In Progress"
        },
        {
            id: "a2",
            title: "Project Management Report",
            course: "IMS565",
            dueDate: "2026-12-12",
            priority: "Medium",
            status: "Pending"
        },
        {
            id: "a3",
            title: "Database Exercise",
            course: "ICT502",
            dueDate: "2026-11-25",
            priority: "Low",
            status: "Completed"
        }
    ];

    let assignments = sampleAssignments;

    try {
        const saved = localStorage.getItem(storageKey);

        if (saved !== null) {
            const parsed = JSON.parse(saved);
            assignments = Array.isArray(parsed) ? parsed : [];
        }
    } catch (error) {
        console.error("Unable to load assignments:", error);
        assignments = [];
    }

    function saveAssignments() {
        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(assignments)
            );
            return true;
        } catch (error) {
            alert("Unable to save assignments.");
            return false;
        }
    }

    // 6. GET HTML ELEMENTS
    const tableBody =
        document.getElementById("assignmentTableBody");

    const searchInput =
        document.getElementById("assignmentSearch");

    const statusFilter =
        document.getElementById("statusFilter");

    const priorityFilter =
        document.getElementById("priorityFilter");

    const form =
        document.getElementById("assignmentForm");

    const modal = new bootstrap.Modal(
        document.getElementById("assignmentModal")
    );

    let editingId = null;

    // 7. UPDATE SUMMARY CARDS
    function updateSummary() {

        const countStatus = status =>
            assignments.filter(a => a.status === status).length;

        document.getElementById("totalAssignments")
            .textContent = assignments.length;

        document.getElementById("pendingAssignments")
            .textContent = countStatus("Pending");

        document.getElementById("progressAssignments")
            .textContent = countStatus("In Progress");

        document.getElementById("completedAssignments")
            .textContent = countStatus("Completed");
    }

    // 8. DISPLAY ASSIGNMENTS
    function renderAssignments() {

        const search = searchInput.value.trim().toLowerCase();

        const filtered = assignments.filter(a => {

            const matchesSearch =
                a.title.toLowerCase().includes(search) ||
                a.course.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter.value === "all" ||
                a.status === statusFilter.value;

            const matchesPriority =
                priorityFilter.value === "all" ||
                a.priority === priorityFilter.value;

            return matchesSearch &&
                   matchesStatus &&
                   matchesPriority;
        });

        filtered.sort((a, b) =>
            a.dueDate.localeCompare(b.dueDate)
        );

        tableBody.replaceChildren();

        const priorityColors = {
            High: "bg-danger-subtle text-danger",
            Medium: "bg-warning-subtle text-warning-emphasis",
            Low: "bg-success-subtle text-success"
        };

        const statusColors = {
            Pending: "bg-secondary-subtle text-secondary",
            "In Progress": "bg-primary-subtle text-primary",
            Completed: "bg-success-subtle text-success"
        };

        filtered.forEach(function (assignment) {

            const row = document.createElement("tr");

            function addCell(value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            }

            addCell(assignment.title);
            addCell(assignment.course);
            addCell(assignment.dueDate);

            const priorityCell = document.createElement("td");
            const priorityBadge = document.createElement("span");

            priorityBadge.className =
                "badge rounded-pill " +
                priorityColors[assignment.priority];

            priorityBadge.textContent = assignment.priority;
            priorityCell.appendChild(priorityBadge);
            row.appendChild(priorityCell);

            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");

            statusBadge.className =
                "badge rounded-pill " +
                statusColors[assignment.status];

            statusBadge.textContent = assignment.status;
            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);

            const actions = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.className =
                "btn btn-sm btn-outline-primary me-2";
            editButton.innerHTML =
                '<i class="bi bi-pencil"></i>';
            editButton.title = "Edit assignment";
            editButton.setAttribute("aria-label", "Edit assignment");

            editButton.addEventListener("click", function () {
                editAssignment(assignment.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className =
                "btn btn-sm btn-outline-danger";
            deleteButton.innerHTML =
                '<i class="bi bi-trash"></i>';
            deleteButton.title = "Delete assignment";
            deleteButton.setAttribute("aria-label", "Delete assignment");

            deleteButton.addEventListener("click", function () {
                deleteAssignment(assignment.id);
            });

            actions.append(editButton, deleteButton);
            row.appendChild(actions);
            tableBody.appendChild(row);
        });

        document.getElementById("assignmentCountText")
            .textContent = filtered.length + " assignments";

        document.getElementById("noAssignments")
            .classList.toggle("d-none", filtered.length > 0);

        updateSummary();
    }

    // 9. ADD ASSIGNMENT
    document.getElementById("addAssignmentBtn")
        .addEventListener("click", function () {

            editingId = null;
            form.reset();

            document.getElementById("assignmentModalLabel")
                .textContent = "Add Assignment";

            modal.show();
        });

    // 10. EDIT ASSIGNMENT
    function editAssignment(id) {

        const assignment = assignments.find(a => a.id === id);
        if (!assignment) return;

        editingId = id;

        document.getElementById("assignmentModalLabel")
            .textContent = "Edit Assignment";

        document.getElementById("assignmentTitle")
            .value = assignment.title;

        document.getElementById("assignmentCourse")
            .value = assignment.course;

        document.getElementById("assignmentDueDate")
            .value = assignment.dueDate;

        document.getElementById("assignmentPriority")
            .value = assignment.priority;

        document.getElementById("assignmentStatus")
            .value = assignment.status;

        modal.show();
    }

    // 11. SAVE ADD / EDIT
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const data = {
            title: document.getElementById("assignmentTitle")
                .value.trim(),
            course: document.getElementById("assignmentCourse")
                .value,
            dueDate: document.getElementById("assignmentDueDate")
                .value,
            priority: document.getElementById("assignmentPriority")
                .value,
            status: document.getElementById("assignmentStatus")
                .value
        };

        const previous = [...assignments];

        if (editingId !== null) {

            const index = assignments.findIndex(
                a => a.id === editingId
            );

            if (index === -1) return;

            assignments[index] = {
                ...assignments[index],
                ...data
            };

        } else {

            assignments.push({
                id: crypto.randomUUID(),
                ...data
            });
        }

        if (!saveAssignments()) {
            assignments = previous;
            return;
        }

        modal.hide();
        renderAssignments();
    });

    // 12. DELETE ASSIGNMENT
    function deleteAssignment(id) {

        if (!confirm("Delete this assignment?")) {
            return;
        }

        const previous = [...assignments];

        assignments = assignments.filter(a => a.id !== id);

        if (!saveAssignments()) {
            assignments = previous;
            return;
        }

        renderAssignments();
    }

    // 13. SEARCH AND FILTER
    searchInput.addEventListener("input", renderAssignments);
    statusFilter.addEventListener("change", renderAssignments);
    priorityFilter.addEventListener("change", renderAssignments);

    document.getElementById("resetAssignmentFilters")
        .addEventListener("click", function () {

            searchInput.value = "";
            statusFilter.value = "all";
            priorityFilter.value = "all";

            renderAssignments();
        });

    // 14. INITIAL DISPLAY
    renderAssignments();

});
