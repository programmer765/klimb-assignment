const form = document.getElementById("form");
const file = document.getElementById("file");

function canSubmit() {
  const submit = document.getElementsByClassName("submit");
  const desc = document.getElementsByClassName("desc");
  const fileName = document.getElementById("fileName");
  if (file.files.length === 0) {
    desc[0].classList.remove("hidden");
    submit[0].classList.add("hidden");
  } else {
    fileName.textContent += file.files[0].name;
    submit[0].classList.remove("hidden");
    desc[0].classList.add("hidden");
  }
}

form.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  const status = document.getElementById("status");
  const data = new FormData();
  data.append("file", file.files[0]);
  fetch("/upload", {
    method: "POST",
    body: data,
  })
    .then((res) => {
      document.getElementById("form").classList.add("hidden");
      document.getElementsByClassName("status")[0].classList.remove("hidden");
    })
    .catch((err) => console.log(err));
}
