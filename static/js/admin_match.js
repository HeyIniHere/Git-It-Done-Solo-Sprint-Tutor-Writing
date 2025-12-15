document.addEventListener("DOMContentLoaded", () => {

    const requestContainer = document.getElementById("requests-container");

    fetch("/api/v1/admin-top-matches")
        .then(response => response.json())
        .then(data => {
            data.forEach(request => {
                const requestRow = document.createElement("div");
                requestRow.classList.add("request-row", "mb-4");
                requestRow.requestId = request.id;

                let selectedTutorId = null;

                const requestContent = document.createElement("div");
                requestContent.classList.add("request-content");


                requestContent.innerHTML = `<h5>${request.courseName} - ${request.professorName}</h5>
                <p>${request.details}</p>`;


                const topTutorContainer = document.createElement("div");
                topTutorContainer.classList.add("suggested-tutors", "mb-2");

                const operationDiv = document.createElement("div");
                operationDiv.classList.add("operation-btns", "d-none");

                const confirmBtn = document.createElement("button");
                confirmBtn.innerText = "Confirm";
                confirmBtn.classList.add("confirm-btn");

                confirmBtn.addEventListener("click", () => {
                        fetch("/api/confirm-match", { method: "POST",
                            body : JSON.stringify({
                                request_id : request.id,
                                tutor_id : selectedTutorId
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                alert(data.message)
                            });
                        });

                    const cancelBtn = document.createElement("button");
                    cancelBtn.innerText = "Cancel";
                    cancelBtn.classList.add("cancel-btn");
                    cancelBtn.addEventListener("click", () => {  
                        selectedTutorId = null;
                        operationDiv.classList.add("d-none");

                        topTutorContainer.querySelectorAll(".tutor-select-btn").forEach(btn => btn.classList.remove("active"));

                    });
                        
                    operationDiv.append(confirmBtn, cancelBtn);

                    request.suggestedTutors.forEach(tutor => {
                        const tutorSelectBtn = document.createElement("button");
                        tutorSelectBtn.classList.add("tutor-select-btn");
                        tutorSelectBtn.innerText = tutor.name;
                        tutorSelectBtn.dataset.tutorId = tutor.id;

                        tutorSelectBtn.addEventListener("click", () => {
                            selectedTutorId = tutor.id;

                            topTutorContainer.querySelectorAll(".tutor-select-btn").forEach(btn => btn.classList.remove("active"));
                            tutorSelectBtn.classList.add("active");
                            operationDiv.classList.remove("d-none");    

                        });
                        
                        topTutorContainer.appendChild(tutorSelectBtn);

                    });
                    requestRow.append(requestContent, topTutorContainer, operationDiv);
                    requestContainer.appendChild(requestRow);
                

        });
    });

});