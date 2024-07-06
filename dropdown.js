document.addEventListener("DOMContentLoaded", () => {
    const menuBar = document.getElementById("img-menu");
    const dropdownMenu = document.getElementById("down-menu");

    menuBar.addEventListener("click", () => {
        dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
        // Check if the clicked element is not the dropdown menu or any of its children
        if (!dropdownMenu.contains(event.target) && !menuBar.contains(event.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});
