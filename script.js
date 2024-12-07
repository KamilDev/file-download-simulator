document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const fileInfo = document.getElementById("fileInfo");
  const fileLabel = document.querySelector(".file-label");

  function handleFile(file) {
    if (!file) return;

    // Display file information
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    fileInfo.textContent = `Selected: ${file.name} (${fileSizeMB} MB)`;

    // Create a blob URL and trigger download immediately
    const blobUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(blobUrl);
    fileInput.value = ""; // Reset file input
  }

  // Handle file input change
  fileInput.addEventListener("change", (e) => {
    handleFile(e.target.files[0]);
  });

  // Make file input keyboard accessible
  fileLabel.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });

  // Prevent default drag behaviors
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Handle drag and drop
  document.body.addEventListener("dragenter", () => {
    document.body.classList.add("dragging");
  });

  document.body.addEventListener("dragleave", (e) => {
    if (e.target === document.body) {
      document.body.classList.remove("dragging");
    }
  });

  document.body.addEventListener("drop", (e) => {
    document.body.classList.remove("dragging");
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });
});
