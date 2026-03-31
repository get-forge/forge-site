(function () {
  function bindFormspree(form) {
    if (!form || !form.action || form.action.indexOf("formspree.io") === -1) return;
    var fid = form.id;
    if (!fid) return;
    var okEl = document.getElementById(fid + "-success");
    var errEl = document.getElementById(fid + "-error");
    if (!okEl || !errEl) return;
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      okEl.classList.add("hidden");
      errEl.classList.add("hidden");
      errEl.textContent = "";
      if (btn) btn.disabled = true;
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { res: res, data: data };
          });
        })
        .then(function (out) {
          if (out.res.ok) {
            okEl.classList.remove("hidden");
            form.reset();
            return;
          }
          var msg = "Something went wrong. Please try again.";
          if (out.data && out.data.error) msg = out.data.error;
          else if (out.data && out.data.errors && out.data.errors.length)
            msg = out.data.errors
              .map(function (x) {
                return x.message || x;
              })
              .join(" ");
          errEl.textContent = msg;
          errEl.classList.remove("hidden");
        })
        .catch(function () {
          errEl.textContent = "Network error. Please try again.";
          errEl.classList.remove("hidden");
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('form[action*="formspree.io"]').forEach(bindFormspree);
  });
})();
