document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector("#btn");
    const container = document.querySelector("#buyersContainer");
    const locationInput = document.querySelector("#locationInput");
    const interestInput = document.querySelector("#interestInput");
    const buyerCount = document.querySelector("#buyerCount");

    const composeSection = document.querySelector("#composeSection");
    const buyerEmailInput = document.querySelector("#buyerEmail");
    const sendEmailBtn = document.querySelector("#sendEmailBtn");
    const cancelEmailBtn = document.querySelector("#cancelEmailBtn");

    // FUNCTION TO FETCH BUYERS FROM FLASK / MYSQL API
    function fetchBuyers() {
        const locationVal = locationInput ? locationInput.value.trim() : "";
        const interestVal = interestInput ? interestInput.value.trim() : "";

        const params = new URLSearchParams({
            location: locationVal,
            interest: interestVal
        });

        if (container) {
            container.innerHTML = '<p class="no-buyers-msg">Searching database...</p>';
        }

        fetch(`/api/buyers?${params}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load data from server");
                }
                return response.json();
            })
            .then(buyers => {
                if (!container) return;
                container.innerHTML = "";

                if (buyerCount) {
                    buyerCount.textContent = `${buyers.length} Buyers`;
                }

                if (!Array.isArray(buyers) || buyers.length === 0) {
                    container.innerHTML = '<p class="no-buyers-msg">No buyers found matching your search criteria.</p>';
                    return;
                }

                buyers.forEach(buyer => {
                    const card = document.createElement("div");
                    card.className = "buyer-card";

                    const name = buyer.name || "Business Buyer";
                    const interest = buyer.interest || "Home Decor";
                    const city = buyer.city || "";
                    const state = buyer.state || "";
                    const email = buyer.email || "";
                    const budget = buyer.budget ? `$${Number(buyer.budget).toLocaleString()}` : "N/A";

                    const locationText = [city, state].filter(Boolean).join(", ");

                    card.innerHTML = `
                        <div>
                            <h4>${name}</h4>
                            <span class="category-badge">${interest}</span>
                            <div class="buyer-details">
                                <p>📍 ${locationText || 'US Location'}</p>
                                <p>✉️ ${email}</p>
                                <p>💰 Budget: ${budget}</p>
                            </div>
                        </div>
                        <div class="buyer-actions">
                            <button class="btn-select-buyer" data-email="${email}">Select Buyer</button>
                        </div>
                    `;
                    container.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Error fetching SQL data:", error);
                if (container) {
                    container.innerHTML = '<p class="no-buyers-msg">Error loading buyers. Please ensure MySQL and Flask are running.</p>';
                }
            });
    }

    // ATTACH CLICK EVENT TO SEARCH BUTTON
    if (button) {
        button.addEventListener("click", fetchBuyers);
    }

    // SELECT BUYER BUTTON EVENT DELEGATION
    if (container) {
        container.addEventListener("click", event => {
            if (event.target && event.target.classList.contains("btn-select-buyer")) {
                const email = event.target.dataset.email || "";
                if (buyerEmailInput) buyerEmailInput.value = email;
                if (composeSection) {
                    composeSection.style.display = "block";
                    composeSection.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    }

    // EMAIL OUTREACH ACTIONS
    if (sendEmailBtn) {
        sendEmailBtn.addEventListener("click", () => {
            const email = buyerEmailInput ? buyerEmailInput.value.trim() : "";
            const subject = document.querySelector("#emailSubject")?.value || "";
            const message = document.querySelector("#emailMessage")?.value || "";

            if (!email) {
                alert("Please select or enter a valid recipient email.");
                return;
            }

            const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            window.open(mailtoUrl, "_blank");
        });
    }

    if (cancelEmailBtn && composeSection) {
        cancelEmailBtn.addEventListener("click", () => {
            composeSection.style.display = "none";
        });
    }

    // FETCH ALL BUYERS INITIALLY ON PAGE LOAD
    fetchBuyers();
});
