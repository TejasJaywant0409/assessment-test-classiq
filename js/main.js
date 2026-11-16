/* ClassIQ – vanilla JavaScript (no libraries) */
(function () {
  "use strict";

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- helpers ---------- */
  function setError(input, message) {
    var err = input.parentElement.querySelector(".err");
    input.classList.toggle("invalid", !!message);
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (err) err.textContent = message || "";
  }

  function validate(input) {
    var v = input.value.trim();
    var msg = "";
    if (input.name === "email") {
      if (!v) msg = "Enter your email.";
      else if (!EMAIL_RE.test(v)) msg = "Enter a valid email, like name@example.com.";
    } else if (input.name === "fullname") {
      if (v.length < 2) msg = "Enter your full name.";
    } else if (input.name === "password") {
      if (!input.value) msg = "Enter your password.";
      else if (input.dataset.min && input.value.length < +input.dataset.min)
        msg = "Use at least " + input.dataset.min + " characters.";
    }
    setError(input, msg);
    return !msg;
  }

  function wireForm(form, onValid) {
    var inputs = Array.prototype.slice.call(form.querySelectorAll("input"));
    inputs.forEach(function (input) {
      input.addEventListener("blur", function () { if (input.value) validate(input); });
      input.addEventListener("input", function () { if (input.classList.contains("invalid")) validate(input); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = inputs.map(validate).every(Boolean);   // validate all, don't short-circuit
      if (!ok) { var bad = form.querySelector(".invalid"); if (bad) bad.focus(); return; }
      onValid(inputs.reduce(function (o, i) { o[i.name] = i.value.trim(); return o; }, {}));
    });
  }

  /* ---------- Signup ---------- */
  var signup = document.getElementById("signup-form");
  if (signup) {
    signup.querySelector('[name="password"]').dataset.min = "6";
    wireForm(signup, function (data) {
      // Demo only: a real app would send this to a server, never store passwords in the browser.
      try { localStorage.setItem("classiq_user", JSON.stringify({ email: data.email, fullname: data.fullname })); } catch (e) {}
      window.location.href = "dashboard.html";
    });
  }

  /* ---------- Login ---------- */
  var login = document.getElementById("login-form");
  if (login) {
    wireForm(login, function () { window.location.href = "dashboard.html"; });
  }

  /* ---------- Footer subscribe ---------- */
  var sub = document.getElementById("subscribe-form");
  if (sub) {
    var subInput = document.getElementById("sub-email");
    var subMsg = document.getElementById("sub-msg");
    sub.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = subInput.value.trim();
      if (!EMAIL_RE.test(v)) {
        subMsg.className = "form-msg err";
        subMsg.textContent = "Enter a valid email address.";
        subInput.focus();
        return;
      }
      subMsg.className = "form-msg ok";
      subMsg.textContent = "Subscribed. Check your inbox for updates.";
      subInput.value = "";
    });
  }

  /* ---------- Active nav link on scroll (landing only) ---------- */
  var courses = document.getElementById("courses");
  var navLink = document.querySelector(".nav-link");
  if (courses && navLink && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      navLink.classList.toggle("active", entries[0].isIntersecting);
    }, { threshold: 0.3 }).observe(courses);
  }
})();
