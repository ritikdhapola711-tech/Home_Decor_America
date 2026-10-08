
const button = document.querySelector("#btn");
const container = document.querySelector("#buyersContainer");
const locationInput = document.querySelector("#locationInput");
const interestInput = document.querySelector("#interestInput");

button.addEventListener("click", () => {
    const params = new URLSearchParams({
        location: locationInput.value,
        interest: interestInput.value
    });

    fetch(`/api/buyers?${params}`)
        .then(response => response.json())
        .then(buyers => {
            container.innerHTML = "";

            if (buyers.length === 0) {
                container.innerHTML = "<h2>No buyers found</h2>";
                return;
            }

            buyers.forEach(buyer => {
                const card = document.createElement("div");
                card.className = "buyer-card";
                card.innerHTML = `
                    <div class="buttons">
                        <button class="mail-btn" data-email="${buyer.email}">Send Mail</button>
                        <button class="info-btn">More Info</button>
                    </div>
                    <div class="buyer-info">
                        <h2>${buyer.name}</h2>
                        <p>Email: ${buyer.email}</p>
                        <p>Location: ${buyer.city}, ${buyer.state}</p>
                        <p>Interest: ${buyer.interest}</p>
                        <p>Budget: $${buyer.budget}</p>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.log("Error:", error));
});

container.addEventListener("click", event => {
    if (event.target.classList.contains("mail-btn")) {
        event.preventDefault();
        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(event.target.dataset.email)}`,
            "_blank"
        );
    }

    if (event.target.classList.contains("info-btn")) {
        alert(`
More Information

Work: Wall Decor 
Experience: 5 Years
Products Interested: Mirror
Preferred Contact: Email
Purchase Frequency: Monthly
Public Comments: Very nice work and well decoration are very nice the work is clean and nice 


        `);
    }
});
