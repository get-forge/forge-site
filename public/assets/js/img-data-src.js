document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("img[data-src]").forEach(function (img) {
    var d = img.getAttribute("data-src");
    if (d && (!img.src || img.src === "")) {
      img.src = d;
    }
  });
});
