// ==========================================
// UTP STUDENT PORTAL - SHARED JAVASCRIPT
// Sidebar, mobile navigation, topbar user, logout
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const SESSION_KEY = "utpCurrentStudent";
    const DESKTOP_MIN_WIDTH = 992; // matches Bootstrap "lg"

    const sidebar    = document.getElementById("sidebar");
    const backdrop   = document.getElementById("sidebarBackdrop");
    const menuToggle = document.getElementById("menuToggle");

    // ------------------------------------------
    // Sidebar: highlight the current page
    // ------------------------------------------
    const currentPage = location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".sidebar-link[href]").forEach(function (link) {
        const isActive = link.getAttribute("href") === currentPage;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // ------------------------------------------
    // Topbar: show the signed-in student
    // (null-safe, so it works on every page)
    // ------------------------------------------
    try {
        const student = JSON.parse(sessionStorage.getItem(SESSION_KEY));

        if (student && student.fullName) {
            const nameEl     = document.getElementById("topbarStudentName");
            const initialsEl = document.getElementById("userInitials");

            if (nameEl) nameEl.textContent = student.fullName;

            if (initialsEl) {
                initialsEl.textContent = student.fullName
                    .trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map(function (word) { return word.charAt(0).toUpperCase(); })
                    .join("");
            }
        }
    } catch (error) {
        // Corrupt session data: page scripts handle the redirect.
    }

    // ------------------------------------------
    // Mobile sidebar (open / close)
    // ------------------------------------------
    if (sidebar && backdrop && menuToggle) {

        function setSidebar(open) {
            sidebar.classList.toggle("show", open);
            backdrop.classList.toggle("show", open);
            document.body.classList.toggle("sidebar-open", open);

            menuToggle.setAttribute("aria-expanded", String(open));
            menuToggle.setAttribute(
                "aria-label",
                open ? "Close navigation menu" : "Open navigation menu"
            );
        }

        menuToggle.addEventListener("click", function () {
            setSidebar(!sidebar.classList.contains("show"));
        });

        // Tap the dark area to close
        backdrop.addEventListener("click", function () {
            setSidebar(false);
        });

        // Close after choosing a page
        sidebar.querySelectorAll("a.sidebar-link").forEach(function (link) {
            link.addEventListener("click", function () {
                setSidebar(false);
            });
        });

        // Press Escape to close and return focus to the menu button
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && sidebar.classList.contains("show")) {
                setSidebar(false);
                menuToggle.focus();
            }
        });

        // Reset when the window grows to desktop size
        window.addEventListener("resize", function () {
            if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
                setSidebar(false);
            }
        });
    }

    // ------------------------------------------
    // Logout
    // ------------------------------------------
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            sessionStorage.removeItem(SESSION_KEY);
            location.replace("login.html");
        });
    }

});
