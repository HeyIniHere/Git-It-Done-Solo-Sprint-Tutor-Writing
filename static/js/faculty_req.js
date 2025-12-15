document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("createRequestForm").addEventListener("submit", async function(e){
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Failed to create request");
      }

      const data = await response.json();

      // Render card from SERVER response
      const template = document.getElementById("request_card_temp");
      const card = template.content.cloneNode(true);

      card.querySelector(".card_title").textContent = data.courseName;
      card.querySelector(".card_prof").textContent = data.facultyName;

      document.getElementById("request_grid").prepend(card);

      form.reset();
      // dismiss modal after success
      const modalEl = document.getElementById("createRequestModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  });

    async function fetchMatches(requestId) {
    try {
      const response = await fetch(`/admin/match/${requestId}`);
      if (!response.ok) throw new Error("Failed to fetch matches");

      const matches = await response.json();
      renderMatches(matches);
    } catch (err) {
      console.error(err);
      alert("Error generating matches");
    }
  }

  function renderMatches(matches) {
    const container = document.getElementById("match_results");
    container.innerHTML = "";

    matches.forEach(match => {
      const div = document.createElement("div");
      div.classList.add("card", "mb-2", "p-2", "shadow-sm");
      div.innerHTML = `
        <strong>${match.tutorName}</strong> — Match Score: ${match.score}%
      `;
      container.appendChild(div);
    });
  }

  // Example trigger: button click
  document.querySelectorAll(".generate_match_btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const requestId = e.target.dataset.requestId;
      fetchMatches(requestId);
    });
  });
});
