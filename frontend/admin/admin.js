

const API_URL = "http://localhost:8080/api/feedback";



const loginForm = document.getElementById("adminLoginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const adminId =
            document.getElementById("adminId").value.trim();

        const password =
            document.getElementById("adminPassword").value;

        const errorMessage =
            document.getElementById("loginError");


        
       

        if (
            adminId === "admin" &&
            password === "admin123"
        ) {

            sessionStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            window.location.href =
                "admin-dashboard.html";

        } else {

            errorMessage.textContent =
                "Invalid Admin ID or Password.";
        }

    });
}




const dashboardPage =
    document.getElementById("feedbackTableBody");

if (dashboardPage) {

    const isLoggedIn =
        sessionStorage.getItem("adminLoggedIn");

    if (isLoggedIn !== "true") {

        window.location.href =
            "admin-login.html";

    } else {

        loadFeedback();
    }
}



const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        sessionStorage.removeItem(
            "adminLoggedIn"
        );

        window.location.href =
            "admin-login.html";
    });
}




async function loadFeedback() {

    const tableBody =
        document.getElementById(
            "feedbackTableBody"
        );

    const loadingMessage =
        document.getElementById(
            "loadingMessage"
        );

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    try {

        loadingMessage.style.display = "block";

        errorMessage.textContent = "";


        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load feedback"
            );
        }


        const feedbackList =
            await response.json();


        tableBody.innerHTML = "";


        

        const total =
            feedbackList.length;

        const responded =
            feedbackList.filter(
                feedback => feedback.responded === true
            ).length;

        const pending =
            total - responded;


        document.getElementById(
            "totalFeedback"
        ).textContent = total;


        document.getElementById(
            "pendingFeedback"
        ).textContent = pending;


        document.getElementById(
            "respondedFeedback"
        ).textContent = responded;


        

        if (feedbackList.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6"
                        style="text-align:center;">
                        No feedback available.
                    </td>
                </tr>
            `;

            return;
        }


        

        feedbackList.forEach(feedback => {

            const row =
                document.createElement("tr");


            const status =
                feedback.responded
                    ? "Responded"
                    : "Pending";


            const statusClass =
                feedback.responded
                    ? "responded"
                    : "pending";


            row.innerHTML = `

                <td>
                    ${feedback.id}
                </td>

                <td>
                    ${escapeHtml(feedback.name)}
                </td>

                <td>
                    ${escapeHtml(feedback.email)}
                </td>

                <td>
                    ${getStars(feedback.rating)}
                </td>

                <td>
                    <span class="status ${statusClass}">
                        ${status}
                    </span>
                </td>

                <td>

                    <button
                        class="view-btn"
                        onclick="viewFeedback(${feedback.id})">

                        View

                    </button>

                </td>
            `;


            tableBody.appendChild(row);

        });


    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Unable to load feedback. Make sure the Spring Boot server is running.";

    } finally {

        loadingMessage.style.display = "none";
    }
}



let selectedFeedbackId = null;


async function viewFeedback(id) {

    try {

        const response =
            await fetch(`${API_URL}/${id}`);


        if (!response.ok) {

            throw new Error(
                "Feedback not found"
            );
        }


        const feedback =
            await response.json();


        selectedFeedbackId =
            feedback.id;


        document.getElementById(
            "detailName"
        ).textContent =
            feedback.name;


        document.getElementById(
            "detailEmail"
        ).textContent =
            feedback.email;


        document.getElementById(
            "detailRating"
        ).textContent =
            getStars(feedback.rating);


        document.getElementById(
            "detailMessage"
        ).textContent =
            feedback.message;


       
        document.getElementById(
            "replyText"
        ).value =
            feedback.reply || "";


        document.getElementById(
            "feedbackModal"
        ).classList.add("active");


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load this feedback."
        );
    }
}


const closeModal =
    document.getElementById("closeModal");

if (closeModal) {

    closeModal.addEventListener(
        "click",
        function () {

            closeFeedbackModal();

        }
    );
}


function closeFeedbackModal() {

    document.getElementById(
        "feedbackModal"
    ).classList.remove("active");

    selectedFeedbackId = null;
}



const modal =
    document.getElementById("feedbackModal");

if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                closeFeedbackModal();

            }

        }
    );
}



const sendReplyBtn =
    document.getElementById(
        "sendReplyBtn"
    );

if (sendReplyBtn) {

    sendReplyBtn.addEventListener(
        "click",
        async function () {

            if (!selectedFeedbackId) {

                return;
            }


            const replyText =
                document.getElementById(
                    "replyText"
                ).value.trim();


            if (!replyText) {

                alert(
                    "Please write a reply first."
                );

                return;
            }


            try {

                sendReplyBtn.disabled = true;

                sendReplyBtn.textContent =
                    "Sending...";


                const response =
                    await fetch(
                        `${API_URL}/${selectedFeedbackId}/reply`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                reply: replyText
                            })
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to send reply"
                    );
                }


                alert(
                    "Reply sent successfully!"
                );


                closeFeedbackModal();

                loadFeedback();


            } catch (error) {

                console.error(error);

                alert(
                    "Unable to send reply. Please try again."
                );

            } finally {

                sendReplyBtn.disabled = false;

                sendReplyBtn.textContent =
                    "Send Reply";
            }

        }
    );
}




const deleteFeedbackBtn =
    document.getElementById(
        "deleteFeedbackBtn"
    );

if (deleteFeedbackBtn) {

    deleteFeedbackBtn.addEventListener(
        "click",
        async function () {

            if (!selectedFeedbackId) {

                return;
            }


            const confirmed =
                confirm(
                    "Are you sure you want to delete this feedback?"
                );


            if (!confirmed) {

                return;
            }


            try {

                deleteFeedbackBtn.disabled = true;

                deleteFeedbackBtn.textContent =
                    "Deleting...";


                const response =
                    await fetch(
                        `${API_URL}/${selectedFeedbackId}`,
                        {
                            method: "DELETE"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to delete feedback"
                    );
                }


                alert(
                    "Feedback deleted successfully."
                );


                closeFeedbackModal();

                loadFeedback();


            } catch (error) {

                console.error(error);

                alert(
                    "Unable to delete feedback."
                );

            } finally {

                deleteFeedbackBtn.disabled = false;

                deleteFeedbackBtn.textContent =
                    "Delete";
            }

        }
    );
}



const refreshBtn =
    document.getElementById("refreshBtn");

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        function () {

            loadFeedback();

        }
    );
}



function getStars(rating) {

    if (!rating) {

        return "No rating";
    }


    return "★".repeat(rating) +
           "☆".repeat(5 - rating);
}




function escapeHtml(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}