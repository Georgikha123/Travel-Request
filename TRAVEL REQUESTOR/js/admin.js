// Admin JavaScript to handle dynamic data population
document.addEventListener("DOMContentLoaded", function() {
    // Event listeners for tab buttons
    document.getElementById("pendingTab").addEventListener("click", function() {
        loadRequests("pending");
    });

    document.getElementById("allTab").addEventListener("click", function() {
        loadRequests("all");
    });

    document.getElementById("approvedTab").addEventListener("click", function() {
        loadRequests("approved");
    });

    document.getElementById("rejectedTab").addEventListener("click", function() {
        loadRequests("rejected");
    });

    document.getElementById("onholdTab").addEventListener("click", function() {
        loadRequests("onhold");
    });

    // Load the requests by default on page load (All requests initially)
    loadRequests("all");
});

// Function to load and display travel requests based on the selected filter
function loadRequests(statusFilter) {
    const tableBody = document.getElementById("requestsTableBody");
    tableBody.innerHTML = "";  // Clear previous rows

    // Get travel requests from localStorage (employee-side data)
    let travelRequests = JSON.parse(localStorage.getItem('travelRequests')) || [];

    // Filter requests by status
    const filteredRequests = travelRequests.filter(request => 
        statusFilter === "all" || request.status === statusFilter
    );

    // Loop through the filtered requests and append rows to the table
    filteredRequests.forEach((request, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${request.empName}</td>
            <td>${request.destination}</td>
            <td>${request.priority}</td>
            <td><a href="#" class="view-more" data-index="${index}">View Details</a></td>
            <td>
                <select class="action-dropdown" data-index="${index}">
                    <option value="pending" ${request.status === "pending" ? "selected" : ""}>Pending</option>
                    <option value="approved" ${request.status === "approved" ? "selected" : ""}>Approved</option>
                    <option value="rejected" ${request.status === "rejected" ? "selected" : ""}>Rejected</option>
                    <option value="onhold" ${request.status === "onhold" ? "selected" : ""}>On Hold</option>
                </select>
            </td>
        `;
        tableBody.appendChild(row);

        // Add event listener to each "View Details" link
        row.querySelector(".view-more").addEventListener("click", function() {
            const requestIndex = this.getAttribute("data-index");
            showRequestDetails(requestIndex);
        });

        // Add event listener for action dropdown (status change)
        row.querySelector(".action-dropdown").addEventListener("change", function() {
            const newStatus = this.value;
            const requestIndex = this.getAttribute("data-index");
            updateRequestStatus(requestIndex, newStatus);
        });
    });
}

function updateStatus(empId, status) {
    let travelRequests = JSON.parse(localStorage.getItem('travelRequests')) || [];
    const request = travelRequests.find(req => req.empId === empId);
    if (request) {
        request.status = status;
        localStorage.setItem('requests', JSON.stringify(travelRequests));
        loadRequests(document.querySelector('.tab.active').id.replace('Tab', ''));
    }
}

// Function to show request details in a modal
function showRequestDetails(index) {
    const travelRequests = JSON.parse(localStorage.getItem('travelRequests')) || [];
    const request = travelRequests[index];

    // Populate the modal with the request details
    document.getElementById("modalEmpId").innerText = request.empId;
    document.getElementById("modalEmpName").innerText = request.empName;
    document.getElementById("modalProject").innerText = request.project;
    document.getElementById("modalCause").innerText = request.cause;
    document.getElementById("modalSource").innerText = request.source;
    document.getElementById("modalDestination").innerText = request.destination;
    document.getElementById("modalFromDate").innerText = request.fromDate;
    document.getElementById("modalNoOfDays").innerText = request.noOfDays;
    document.getElementById("modalModeOfTravel").innerText = request.modeOfTravel;

    // Show the modal
    document.getElementById("viewMoreModal").style.display = "block";
}

// Close the modal when the user clicks the close button
document.getElementById("closeModalBtn").addEventListener("click", function() {
    document.getElementById("viewMoreModal").style.display = "none";
});

// Close the modal if the user clicks anywhere outside the modal content
window.addEventListener("click", function(event) {
    if (event.target == document.getElementById("viewMoreModal")) {
        document.getElementById("viewMoreModal").style.display = "none";
    }
});

// Function to update request status in localStorage
function updateRequestStatus(index, newStatus) {
    const travelRequests = JSON.parse(localStorage.getItem('travelRequests')) || [];
    travelRequests[index].status = newStatus;

    // Save the updated requests array back to localStorage
    localStorage.setItem('travelRequests', JSON.stringify(travelRequests));

    // Reload the requests table to reflect the status change
    loadRequests("all");
}

// Logout function (redirects to login page)
function logout() {
    window.location.href = "login.html";
}

