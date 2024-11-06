// Array to store travel requests
let travelRequests = [];

// Logout button redirects to the login page
document.getElementById("logoutButton").addEventListener("click", function() {
    window.location.href = "login.html";
});

// Tab switching between Form and View Request
document.getElementById("formTab").addEventListener("click", function() {
    document.getElementById("travelRequestFormSection").style.display = "block";
    document.getElementById("viewRequestSection").style.display = "none";
    document.getElementById("formTab").classList.add("active");
    document.getElementById("viewRequestTab").classList.remove("active");
});

document.getElementById("viewRequestTab").addEventListener("click", function() {
    document.getElementById("travelRequestFormSection").style.display = "none";
    document.getElementById("viewRequestSection").style.display = "block";
    document.getElementById("formTab").classList.remove("active");
    document.getElementById("viewRequestTab").classList.add("active");

    // Load all requests initially
    loadRequests("all");
});

// Function to validate form
function validateForm() {
    // Get form field values
    const empId = document.getElementById("empId").value.trim();
    const empName = document.getElementById("empName").value.trim();
    const project = document.getElementById("project").value.trim();
    const cause = document.getElementById("cause").value.trim();
    const source = document.getElementById("source").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const fromDate = document.getElementById("fromDate").value.trim();
    const noOfDays = document.getElementById("noOfDays").value.trim();
    const modeOfTravel = document.getElementById("modeOfTravel").value.trim();
    const priority = document.getElementById("priority").value.trim();

    // Validate required fields
    if (!empId || !empName || !project || !cause || !source || !destination || !fromDate || !noOfDays || !modeOfTravel || !priority) {
        alert("Please fill all the required fields.");
        return false;
    }

    // Validate number of days (positive integer)
    if (isNaN(noOfDays) || noOfDays <= 0) {
        alert("Please enter a valid number of days.");
        return false;
    }

    // Validate date (ensure fromDate is not in the past)
    const currentDate = new Date();
    const fromDateObject = new Date(fromDate);
    if (fromDateObject < currentDate) {
        alert("From Date cannot be in the past.");
        return false;
    }

    // If all validation checks pass, allow form submission
    return true;
}

// Submit button for travel request form
document.getElementById("submitRequestButton").addEventListener("click", function() {
    if (validateForm()) {
        const empId = document.getElementById("empId").value;
        const empName = document.getElementById("empName").value;
        const project = document.getElementById("project").value;
        const cause = document.getElementById("cause").value;
        const source = document.getElementById("source").value;
        const destination = document.getElementById("destination").value;
        const fromDate = document.getElementById("fromDate").value;
        const noOfDays = document.getElementById("noOfDays").value;
        const modeOfTravel = document.getElementById("modeOfTravel").value;
        const priority = document.getElementById("priority").value;

        // Create a new request object
        const newRequest = {
            empId,
            empName,
            project,
            cause,
            source,
            destination,
            fromDate,
            noOfDays,
            modeOfTravel,
            priority,
            status: "pending"
        };

        // Get existing requests from localStorage or initialize empty array
        let travelRequests = JSON.parse(localStorage.getItem('travelRequests')) || [];

        // Add the new request to the travelRequests array
        travelRequests.push(newRequest);

        // Save the updated requests array back to localStorage
        localStorage.setItem('travelRequests', JSON.stringify(travelRequests));

        alert("Travel request submitted successfully!");

        // Reset the form after submission
        document.getElementById("travelRequestForm").reset();

        // Refresh the view by loading the requests again
        loadRequests("all");
    }
});

// Filter requests by priority
document.getElementById("filterStatus").addEventListener("change", function() {
    const filter = this.value;  // Get the selected value (critical, normal, all)
    loadRequests(filter);       // Pass the filter value to the loadRequests function
});

// Function to load and display travel requests based on the selected filter
function loadRequests(statusFilter) {
    const tableBody = document.getElementById("requestTableBody");
    tableBody.innerHTML = ""; // Clear previous rows

    // Get requests from localStorage
    travelRequests = JSON.parse(localStorage.getItem('travelRequests')) || [];

    // Filter requests by status or priority
    const filteredRequests = travelRequests.filter(request => {
        return (statusFilter === "all" || request.status === statusFilter) ||
            (statusFilter === "critical" && request.priority.toLowerCase() === "critical") ||
            (statusFilter === "normal" && request.priority.toLowerCase() === "normal");
    });

    // Display filtered requests in the table
    filteredRequests.forEach((request, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${request.empName}</td>
            <td>${request.destination}</td>
            <td>${request.priority}</td>
            <td>${request.project}</td>
            <td><button class="view-more" data-index="${index}">View More</button>
            <button class="delete-btn" data-empId="${request.empId}">Delete</button></td>
            
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners for View More buttons
    document.querySelectorAll('.view-more').forEach(button => {
        button.addEventListener("click", function() {
            const requestIndex = this.getAttribute("data-index");
            showRequestDetails(requestIndex);
        });
    });

    // Add event listeners for Delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener("click", function() {
            const empId = this.getAttribute("data-empId");
            deleteRequest(empId); // Call the delete function with empId
        });
    });
}

// Show all details of the selected travel request in the modal
function showRequestDetails(index) {
    // Access the global travelRequests array to fetch the request details
    travelRequests = JSON.parse(localStorage.getItem('travelRequests')) || [];

    const request = travelRequests[index];

    // Check if the request exists (to avoid errors)
    if (!request) {
        alert("Request details not found.");
        return;
    }

    // Populate modal with request details
    document.getElementById("modalEmpId").textContent = request.empId || "N/A";
    document.getElementById("modalEmpName").textContent = request.empName || "N/A";
    document.getElementById("modalProject").textContent = request.project || "N/A";
    document.getElementById("modalCause").textContent = request.cause || "N/A";
    document.getElementById("modalSource").textContent = request.source || "N/A";
    document.getElementById("modalDestination").textContent = request.destination || "N/A";
    document.getElementById("modalFromDate").textContent = request.fromDate || "N/A";
    document.getElementById("modalNoOfDays").textContent = request.noOfDays || "N/A";
    document.getElementById("modalModeOfTravel").textContent = request.modeOfTravel || "N/A";

    // Show the modal
    document.getElementById("viewMoreModal").style.display = "block";
    document.body.classList.add("modal-open");
}

// Close the modal when the Close button is clicked
document.getElementById("closeModalBtn").addEventListener("click", function() {
    document.getElementById("viewMoreModal").style.display = "none";
    document.body.classList.remove("modal-open");
});


// Add event listeners for filtering tabs
document.querySelectorAll(".tabs .tab").forEach(tab => {
    tab.addEventListener("click", function() {
        const statusFilter = this.dataset.status;
        loadRequests(statusFilter);
    });
});

// Initially load all requests
loadRequests("all");


// Function to delete a specific travel request by empId
function deleteRequest(empId) {
    // Confirm deletion with the user
    if (confirm('Are you sure you want to delete this request?')) {
        // Get the current list of requests from localStorage
        let travelRequests = JSON.parse(localStorage.getItem('travelRequests')) || [];

        // Filter out the request with the matching empId
        const updatedRequests = travelRequests.filter(request => request.empId !== empId);

        // Save the updated requests list back to localStorage
        localStorage.setItem('travelRequests', JSON.stringify(updatedRequests));

        // Notify the user
        alert('Request has been deleted.');

        // Refresh the displayed requests based on the selected filter
        const currentFilter = document.getElementById("filterStatus").value || "all";
        loadRequests(currentFilter);
    }
}
