document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const fileInfo = document.getElementById("fileInfo");
  const downloadList = document.getElementById("downloadList");
  const fileLabel = document.querySelector(".file-label");

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  }

  function handleFiles(files) {
    if (!files || files.length === 0) return;

    // Clear previous downloads
    downloadList.innerHTML = "";

    // Start downloads
    Array.from(files).forEach((file) => {
      const blobUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    });

    // Display summary
    const totalSize = Array.from(files).reduce(
      (acc, file) => acc + file.size,
      0
    );
    fileInfo.textContent = `Downloaded ${files.length} file${
      files.length === 1 ? "" : "s"
    } (${formatFileSize(totalSize)} total)`;

    // Update UI for each file
    Array.from(files).forEach((file) => {
      const downloadItem = document.createElement("div");
      downloadItem.className = "download-item";

      const nameSpan = document.createElement("span");
      nameSpan.className = "download-item-name";
      nameSpan.textContent = file.name;

      const sizeSpan = document.createElement("span");
      sizeSpan.className = "download-item-size";
      sizeSpan.textContent = formatFileSize(file.size);

      downloadItem.appendChild(nameSpan);
      downloadItem.appendChild(sizeSpan);
      downloadList.insertBefore(downloadItem, downloadList.firstChild);
    });

    fileInput.value = ""; // Reset file input
  }

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Handle file input change
  fileInput.addEventListener("change", (e) => {
    handleFiles(e.target.files);
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
    handleFiles(e.dataTransfer.files);
  });
});
