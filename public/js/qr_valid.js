// Function to generate QR code
function generateQRCode() {
    // Clear existing QR code
    clearQRCode();

    const selectedEvents = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');

    // Collect selected events
    checkboxes.forEach(checkbox => {
        if (checkbox.value !== "none") {
            selectedEvents.push(checkbox.value);
        }
    });

    // Check if the "Generate QR Code" button was clicked
    const generateButtonClicked = document.getElementById("generateQR").getAttribute("data-was-clicked") === "true";

    // Show SweetAlert alert only if the button was clicked and no events are selected
    if (generateButtonClicked && selectedEvents.length === 0) {
        Swal.fire({
            title: 'No Events Selected',
            text: 'Please select at least one event before generating the QR code.',
            icon: 'warning',
            confirmButtonText: 'OK',
        });
        return;
    }

    // Check if at least one event is selected
    if (selectedEvents.length > 0) {
        // Show SweetAlert for confirmation
        Swal.fire({
            title: 'Confirmation',
            text: 'Are you sure you want to generate the QR code? you have only one chance to change the events',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, generate QR code',
            cancelButtonText: 'No, cancel',
            confirmButtonColor: "#D92232",
            cancelButtonColor: "#2ad11a",
        }).then((result) => {
            if (result.isConfirmed) {
                // Calculate the total amount
                const amount = selectedEvents.length * 100;

                // Create the UPI string
                const filename = `${amount}.jpg`;

    // Create an image element to display the QR code image
    const img = document.createElement('img');
    img.src = `/qr/${filename}`; // Replace with the actual path to your folder
    img.alt = 'QR Code Image';
    img.width = 300; // Set the width to 400 pixels
    img.height = 400;
    
    clearQRCode();

    // Append the image to the "qrcode" div
    document.getElementById("qrcode").appendChild(img);


                // Generate QR code 
                

                // Lock the selected events and disable the remaining events
                allCheckboxes.forEach(checkbox => {
                    if (checkbox.value !== "none") {
                        checkbox.readOnly = selectedEvents.includes(checkbox.value);
                        checkbox.disabled = !selectedEvents.includes(checkbox.value);
                    }
                });

                // Disable the "Generate QR Code" button
                document.getElementById("generateQR").disabled = true;
            }
        });
    }
}

// Event listener for the "Generate QR Code" button
document.getElementById("generateQR").addEventListener("click", function () {
    // Set the "Generate QR Code" button clicked attribute to true
    document.getElementById("generateQR").setAttribute("data-was-clicked", "true");

    // Call the generateQRCode function
    generateQRCode();
});

// Function to clear the existing QR code
function clearQRCode() {
    const qrCodeElement = document.getElementById("qrcode");
    while (qrCodeElement.firstChild) {
        qrCodeElement.removeChild(qrCodeElement.firstChild);
    }
}

// Initial generation of QR code
generateQRCode();
