const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click',function(){
    menu.classList.toggle('is-active')
    menuLinks.classList.toggle('active')
})

const feedbackForm = document.getElementById("feedbackForm");
const API_URL = "http://localhost:8080/api/feedback";

if (feedbackForm) {
    feedbackForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("feedback-name").value;
        const email = document.getElementById("feedback-email").value;
        const message = document.getElementById("feedback-message").value;

        const selectedRating =
            document.querySelector('input[name="rating"]:checked');

        const rating = selectedRating
            ? Number(selectedRating.value)
            : null;

        try {

            const response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message,
                        rating: rating
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to submit feedback");
            }

            const result = await response.json();

            console.log("Feedback saved:", result);

            alert("Thank you for your feedback!");

            feedbackForm.reset();

        } catch (error) {

            console.error("Error submitting feedback:", error);

            alert("Something went wrong. Please try again.");
        }
    });
}
