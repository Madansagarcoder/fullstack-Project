(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


      // Handle Add Bio
                  const addBioBtn = document.getElementById("addBioBtn");
                  const editBioBtn = document.getElementById("editBioBtn");
                  const bioForm = document.getElementById("bioForm");
                  const noBioText = document.getElementById("noBioText");

                  if (addBioBtn && bioForm) {
                     addBioBtn.addEventListener("click", () => {
                        bioForm.classList.remove("d-none");
                        addBioBtn.classList.add("d-none");
                        if (noBioText) noBioText.classList.add("d-none");
                     });
                  }

                  if (editBioBtn && bioForm) {
                     editBioBtn.addEventListener("click", () => {
                        bioForm.classList.remove("d-none");
                        editBioBtn.classList.add("d-none");
                     });
                  }
                  // Handle Messages
                  const openBtn = document.getElementById("openChatBtn");
                  const form = document.getElementById("messageForm");
                  const input = document.getElementById("messageInput");
                  const list = document.getElementById("messageList");

                  if (openBtn && form) {
                     openBtn.addEventListener("click", () => {
                        form.classList.remove("d-none");
                        openBtn.classList.add("d-none");
                        input.focus();
                     });

                     form.addEventListener("submit", function (e) {
                        e.preventDefault();
                        const text = input.value.trim();
                        if (text) {
                           const msg = document.createElement("div");
                           msg.className = "p-2 mb-2 bg-light rounded text-start";
                           msg.textContent = text;
                           list.appendChild(msg);
                           input.value = "";
                           list.scrollTop = list.scrollHeight;
                        }
                     });
                  }