function openModal(videoUrl) {
    var modal = document.getElementById("videoModal");
    var iframe = document.getElementById("modalIframe");
    iframe.src = videoUrl;
    modal.style.display = "flex";
}

function closeModal() {
    var modal = document.getElementById("videoModal");
    var iframe = document.getElementById("modalIframe");
    iframe.src = ""; // Stop video when closing
    modal.style.display = "none";
}
