document.addEventListener("DOMContentLoaded", function () {
  const previewContainer = document.getElementById("preview-container");
  const previewImage = document.getElementById("preview-image");

  const projects = document.querySelectorAll(".project");

  projects.forEach((project, index) => {
    project.addEventListener("mousemove", function (event) {
      const rect = project.getBoundingClientRect();
      previewContainer.style.top = `${event.clientY}px`;
      previewContainer.style.left = `${event.clientX + 20}px`; // Offset for better positioning
      previewImage.src = `./assets/project${index + 1}-preview.jpg`;
      previewContainer.style.display = "block";
    });

    project.addEventListener("mouseleave", function () {
      previewContainer.style.display = "none";
    });
  });
});
