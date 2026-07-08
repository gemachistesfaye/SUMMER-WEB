document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.querySelector('.booking-form');
    const fromStationSelect = document.getElementById('from-station');
    const toStationSelect = document.getElementById('to-station');
    const departureDateInput = document.getElementById('departure-date');
    const returnDateInput = document.getElementById('return-date');
    const departureDateGuidance = document.getElementById('departure-date-guidance');
    const returnDateGuidance = document.getElementById('return-date-guidance');
    const ticketClassSelect = document.getElementById('ticket-class');
    const adultPassengersInput = document.getElementById('adult-passengers');
    const childPassengersInput = document.getElementById('child-passengers');
    const passengerNameInput = document.getElementById('passenger-name');
    const passengerPhoneInput = document.getElementById('passenger-phone');
    const routeInfoDisplay = document.getElementById('route-info-display');
    const routeDurationDisplay = document.getElementById('route-duration');
    const routeNotesDisplay = document.getElementById('route-notes');


    const bookingResultsSection = document.getElementById('booking-results');
    const ticketList = document.getElementById('ticket-list');
    const noResultsMessage = document.getElementById('no-results-message');

    const confirmationMessageSection = document.getElementById('confirmation-message');
    const confName = document.getElementById('conf-name');
    const confRef = document.getElementById('conf-ref');
    const confRoute = document.getElementById('conf-route');
    const confDepartureDate = document.getElementById('conf-departure-date');
    const confDepartureTime = document.getElementById('conf-departure-time');
    const confReturnInfo = document.getElementById('conf-return-info');
    const confReturnDate = document.getElementById('conf-return-date');
    const confReturnTime = document.getElementById('conf-return-time');
    const confAdults = document.getElementById('conf-adults');
    const confChildren = document.getElementById('conf-children');
    const confClass = document.getElementById('conf-class');
    const confAmount = document.getElementById('conf-amount');
    const confPhone = document.getElementById('conf-phone');
    const simulatedSmsText = document.getElementById('simulated-sms-text');

    // --- Sample Data & Configuration ---
    const stations = [
        { id: 'addis_ababa', name: 'Addis Ababa (Furi)' },
        { id: 'adama', name: 'Adama' },
        { id: 'awash', name: 'Awash' },
        { id: 'dire_dawa', name: 'Dire Dawa' },
        { id: 'miesso', name: 'Miesso' },
        { id: 'nagaad', name: 'Nagaad' },
        { id: 'djibouti', name: 'Djibouti (Nagad)' }
    ];

    // Base prices per passenger, per route type (international/domestic)
    // and class multiplier
    const basePrices = {
        international: {
            economy: 5000, // ETB or DJF
            business: 7500,
            first: 10000
        },
        domestic: {
            economy: 500, // ETB
            business: 750,
            first: 1000
        }
    };

    const childDiscount = 0.5; // 50% discount for children

    const routeDetails = {
        'addis_ababa-djibouti': { time: '10-12 hours', notes: 'International service on odd days from Ethiopia, even days from Djibouti. Visa might be required.', international: true },
        'djibouti-addis_ababa': { time: '10-12 hours', notes: 'International service on even days from Djibouti, odd days from Ethiopia. Visa might be required.', international: true },
        'addis_ababa-dire_dawa': { time: '5-6 hours', notes: 'Daily domestic service.', international: false },
        'dire_dawa-addis_ababa': { time: '5-6 hours', notes: 'Daily domestic service.', international: false },
        // Add more route details as needed
        // For simplicity, if a specific route isn't defined, it's treated as domestic and uses a generic time/note
    };


    let availableTickets = []; // Global array to hold generated tickets

    // --- Utility Functions ---

    function generateBookingRef() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let ref = '';
        for (let i = 0; i < 8; i++) {
            ref += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return ref;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function formatCurrency(amount, isInternational) {
        const currency = isInternational ? 'DJF' : 'ETB';
        return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function getStationName(id) {
        const station = stations.find(s => s.id === id);
        return station ? station.name : id;
    }

    function isInternationalRoute(fromId, toId) {
        const isFromDjibouti = fromId === 'djibouti';
        const isToDjibouti = toId === 'djibouti';
        return isFromDjibouti !== isToDjibouti; // True if one is Djibouti and the other is not
    }

    // --- Populate Station Selects ---
    function populateStations() {
        fromStationSelect.innerHTML = '<option value="">Select departure</option>';
        toStationSelect.innerHTML = '<option value="">Select arrival</option>';

        stations.forEach(station => {
            const optionFrom = document.createElement('option');
            optionFrom.value = station.id;
            optionFrom.textContent = station.name;
            fromStationSelect.appendChild(optionFrom);

            const optionTo = document.createElement('option');
            optionTo.value = station.id;
            optionTo.textContent = station.name;
            toStationSelect.appendChild(optionTo);
        });
    }

    // --- Dynamic Pricing Calculation ---
    function calculatePrice(routeType, travelClass, adults, children) {
        const basePricePerAdult = basePrices[routeType][travelClass];
        const adultCost = basePricePerAdult * adults;
        const childCost = (basePricePerAdult * childDiscount) * children;
        return adultCost + childCost;
    }

    // --- Ticket Generation Logic ---
    function generateTickets(from, to, departDateStr, returnDateStr, travelClass, adults, children) {
        availableTickets = []; // Clear previous results

        if (!from || !to || !departDateStr || from === to || (adults + children) === 0) {
            return; // Not enough info or same stations or no passengers
        }

        const departDate = new Date(departDateStr);
        const departDay = departDate.getDate(); // 1-31
        const departMonth = departDate.getMonth(); // 0-11
        const departYear = departDate.getFullYear();

        const isIntRoute = isInternationalRoute(from, to);
        const routeKey = `${from}-${to}`;
        const routeData = routeDetails[routeKey] || { time: 'N/A', notes: 'No specific details available for this route.', international: isIntRoute };

        const times = ['08:00 AM', '02:00 PM', '07:00 PM']; // Common times

        // --- Departure Journey ---
        let isDepartureDateValid = true;
        let departureWarningMessage = '';

        if (isIntRoute) {
            // International: Ethiopia to Djibouti (Odd days), Djibouti to Ethiopia (Even days)
            if (from === 'djibouti' && departDay % 2 !== 0) { // Djibouti to Ethiopia should be Even
                isDepartureDateValid = false;
                departureWarningMessage = 'International trains from Djibouti to Ethiopia run on even-numbered days.';
            } else if (from !== 'djibouti' && departDay % 2 === 0) { // Ethiopia to Djibouti should be Odd
                isDepartureDateValid = false;
                departureWarningMessage = 'International trains from Ethiopia to Djibouti run on odd-numbered days.';
            }
        }

        updateDateGuidance(departureDateGuidance, isDepartureDateValid, departureWarningMessage);

        if (isDepartureDateValid) {
            times.forEach(time => {
                const totalPrice = calculatePrice(isIntRoute ? 'international' : 'domestic', travelClass, adults, children);
                availableTickets.push({
                    id: `ticket_${Date.now()}_${Math.random()}`,
                    route: `${getStationName(from)} to ${getStationName(to)}`,
                    departDate: departDateStr,
                    departTime: time,
                    returnDate: null,
                    returnTime: null,
                    price: totalPrice,
                    adults: adults,
                    children: children,
                    class: travelClass,
                    isInternational: isIntRoute,
                    duration: routeData.time,
                    notes: routeData.notes
                });
            });
        }


        // --- Return Journey (if returnDate is provided and valid) ---
        if (returnDateStr) {
            const returnDate = new Date(returnDateStr);
            const returnDay = returnDate.getDate();
            const returnRouteKey = `${to}-${from}`; // Reverse route for return journey
            const returnRouteData = routeDetails[returnRouteKey] || { time: 'N/A', notes: 'No specific details available for this return route.', international: isIntRoute };


            let isReturnDateValid = true;
            let returnWarningMessage = '';

            if (returnDate < departDate) {
                isReturnDateValid = false;
                returnWarningMessage = 'Return date cannot be before departure date.';
            } else if (isIntRoute) {
                // International Return: Djibouti to Ethiopia (Even days), Ethiopia to Djibouti (Odd days)
                if (to === 'djibouti' && returnDay % 2 !== 0) { // Return from Djibouti (to Ethiopia) should be Even
                    isReturnDateValid = false;
                    returnWarningMessage = 'International return trains from Djibouti to Ethiopia run on even-numbered days.';
                } else if (to !== 'djibouti' && returnDay % 2 === 0) { // Return from Ethiopia (to Djibouti) should be Odd
                    isReturnDateValid = false;
                    returnWarningMessage = 'International return trains from Ethiopia to Djibouti run on odd-numbered days.';
                }
            }
            updateDateGuidance(returnDateGuidance, isReturnDateValid, returnWarningMessage);

            if (isReturnDateValid) {
                times.forEach(time => {
                    const totalPrice = calculatePrice(isIntRoute ? 'international' : 'domestic', travelClass, adults, children);
                    availableTickets.push({
                        id: `ticket_${Date.now()}_${Math.random()}_RT`,
                        route: `${getStationName(to)} to ${getStationName(from)} (Return Leg)`,
                        departDate: returnDateStr,
                        departTime: time,
                        returnDate: null, // This is the return leg's departure
                        returnTime: null,
                        price: totalPrice,
                        adults: adults,
                        children: children,
                        class: travelClass,
                        isInternational: isIntRoute,
                        duration: returnRouteData.time,
                        notes: returnRouteData.notes,
                        isReturnLeg: true
                    });
                });
            }
        } else {
            // Clear return date guidance if no return date
            updateDateGuidance(returnDateGuidance, true, '');
        }
    }


    // --- Display Tickets ---
    function displayTickets() {
        ticketList.innerHTML = ''; // Clear previous tickets

        if (availableTickets.length === 0) {
            bookingResultsSection.classList.add('hidden');
            noResultsMessage.classList.remove('hidden');
            return;
        }

        noResultsMessage.classList.add('hidden');
        bookingResultsSection.classList.remove('hidden');

        availableTickets.forEach(ticket => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span><strong>Route:</strong> ${ticket.route}</span>
                <span><strong>Depart:</strong> ${formatDate(ticket.departDate)} at ${ticket.departTime}</span>
                <span><strong>Adults:</strong> ${ticket.adults}, <strong>Children:</strong> ${ticket.children}</span>
                <span><strong>Class:</strong> ${ticket.class.charAt(0).toUpperCase() + ticket.class.slice(1)}</span>
                <span><strong>Price:</strong> ${formatCurrency(ticket.price, ticket.isInternational)}</span>
                <button class="btn-small book-now-btn"
                        data-id="${ticket.id}"
                        data-route="${ticket.route}"
                        data-depart-date="${ticket.departDate}"
                        data-depart-time="${ticket.departTime}"
                        data-return-date="${ticket.returnDate || ''}"
                        data-return-time="${ticket.returnTime || ''}"
                        data-adults="${ticket.adults}"
                        data-children="${ticket.children}"
                        data-class="${ticket.class}"
                        data-price="${ticket.price}"
                        data-is-international="${ticket.isInternational}">
                    Book Now
                </button>
            `;
            ticketList.appendChild(listItem);
        });

        // Attach event listeners to new "Book Now" buttons
        document.querySelectorAll('.book-now-btn').forEach(button => {
            button.addEventListener('click', handleBookNowClick);
        });
    }

    // --- Handle Booking Confirmation ---
    function handleBookNowClick(event) {
        const button = event.target;
        const ticketId = button.dataset.id;
        const route = button.dataset.route;
        const departDate = button.dataset.departDate;
        const departTime = button.dataset.departTime;
        const returnDate = button.dataset.returnDate;
        const returnTime = button.dataset.returnTime;
        const adults = button.dataset.adults;
        const children = button.dataset.children;
        const travelClass = button.dataset.class;
        const price = parseFloat(button.dataset.price);
        const isInternational = button.dataset.isInternational === 'true'; // Convert string to boolean

        // Get passenger name and phone from the main form (assuming they are still filled)
        const passengerName = passengerNameInput.value;
        const passengerPhone = passengerPhoneInput.value;

        // Populate confirmation message
        confName.textContent = passengerName;
        confRef.textContent = generateBookingRef();
        confRoute.textContent = route;
        confDepartureDate.textContent = formatDate(departDate);
        confDepartureTime.textContent = departTime;
        confAdults.textContent = adults;
        confChildren.textContent = children;
        confClass.textContent = travelClass.charAt(0).toUpperCase() + travelClass.slice(1);
        confAmount.textContent = formatCurrency(price, isInternational);
        confPhone.textContent = passengerPhone;

        if (returnDate && returnDate !== 'null' && returnDate !== '') {
            confReturnInfo.classList.remove('hidden');
            confReturnDate.textContent = formatDate(returnDate);
            confReturnTime.textContent = returnTime;
        } else {
            confReturnInfo.classList.add('hidden');
        }

        // Simulate SMS Content
        const smsFrom = getStationName(fromStationSelect.value);
        const smsTo = getStationName(toStationSelect.value);
        const smsRoute = `${smsFrom} to ${smsTo}`;
        const smsReturn = returnDate && returnDate !== 'null' && returnDate !== '' ? ` Return: ${formatDate(returnDate)} ${returnTime}.` : '';

        // Add class and passenger counts to SMS
        simulatedSmsText.textContent = `Dear ${passengerName}, your EDR booking (Ref: ${confRef.textContent}) for ${smsRoute} on ${formatDate(departDate)} ${departTime} (${adults} Adults, ${children} Children, Class: ${confClass.textContent}) is confirmed. Total: ${formatCurrency(price, isInternational)}. Payment due within 24hrs via bank transfer or mobile money. Contact us for details.`;

        bookingForm.classList.add('hidden'); // Hide the form
        bookingResultsSection.classList.add('hidden'); // Hide results
        confirmationMessageSection.classList.remove('hidden'); // Show confirmation
    }

    // --- Dynamic Route Info Display ---
    function updateRouteInfo() {
        const from = fromStationSelect.value;
        const to = toStationSelect.value;

        if (from && to && from !== to) {
            const routeKey = `${from}-${to}`;
            const details = routeDetails[routeKey];

            if (details) {
                routeDurationDisplay.innerHTML = `<i class="far fa-clock"></i> Travel Time: ${details.time}`;
                routeNotesDisplay.innerHTML = `<i class="fas fa-info-circle"></i> Notes: ${details.notes}`;
                routeInfoDisplay.classList.remove('hidden');
            } else {
                // Generic domestic message if specific route not found
                routeDurationDisplay.innerHTML = `<i class="far fa-clock"></i> Travel Time: Approx. 5-12 hours (depending on route)`;
                routeNotesDisplay.innerHTML = `<i class="fas fa-info-circle"></i> Notes: Standard domestic service.`;
                routeInfoDisplay.classList.remove('hidden');
            }
        } else {
            routeInfoDisplay.classList.add('hidden');
        }
    }

    // --- Date Guidance Update (for international rules) ---
    function updateDateGuidance(element, isValid, message) {
        element.textContent = message;
        if (message) {
            element.classList.add('is-visible');
            if (!isValid) {
                element.classList.add('warning');
            } else {
                element.classList.remove('warning');
            }
        } else {
            element.classList.remove('is-visible', 'warning');
        }
    }


    // --- Event Listener for Form Submission ---
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        const from = fromStationSelect.value;
        const to = toStationSelect.value;
        const departDate = departureDateInput.value;
        const returnDate = returnDateInput.value;
        const adults = parseInt(adultPassengersInput.value, 10);
        const children = parseInt(childPassengersInput.value, 10);
        const travelClass = ticketClassSelect.value;
        const passengerName = passengerNameInput.value;
        const passengerPhone = passengerPhoneInput.value;

        // Basic validation
        if (!from || !to || !departDate || from === to || (adults + children) === 0 || !passengerName || !passengerPhone) {
            alert('Please fill in all required fields: Departure, Destination, Departure Date, at least one passenger, Full Name, and Phone number.');
            return;
        }

        // Validate phone number format
        const phonePattern = /^\+2519\d{8}$/;
        if (!phonePattern.test(passengerPhone)) {
            alert('Please enter a valid Ethiopian phone number starting with +2519 followed by 8 digits.');
            return;
        }

        // Validate date order if return date is provided
        if (returnDate && new Date(returnDate) < new Date(departDate)) {
             alert('Return date cannot be before departure date. Please correct your dates.');
             returnDateInput.focus();
             return;
        }


        // Hide previous sections and show results section
        confirmationMessageSection.classList.add('hidden');
        bookingResultsSection.classList.add('hidden');
        noResultsMessage.classList.add('hidden'); // Ensure this is hidden initially

        generateTickets(from, to, departDate, returnDate, travelClass, adults, children);
        displayTickets();

        // Scroll to results if needed
        if (availableTickets.length > 0) {
            bookingResultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            noResultsMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // --- Event Listeners for Dynamic Updates ---
    fromStationSelect.addEventListener('change', updateRouteInfo);
    toStationSelect.addEventListener('change', updateRouteInfo);
    departureDateInput.addEventListener('change', () => {
        returnDateInput.setAttribute('min', departureDateInput.value);
        if (returnDateInput.value < departureDateInput.value) {
            returnDateInput.value = departureDateInput.value;
        }
        // Re-run ticket generation logic to update date guidance
        generateTickets(fromStationSelect.value, toStationSelect.value, departureDateInput.value, returnDateInput.value, ticketClassSelect.value, parseInt(adultPassengersInput.value), parseInt(childPassengersInput.value));
        displayTickets(); // Update displayed tickets if rules change
    });

    returnDateInput.addEventListener('change', () => {
        // Re-run ticket generation logic to update date guidance for return
        generateTickets(fromStationSelect.value, toStationSelect.value, departureDateInput.value, returnDateInput.value, ticketClassSelect.value, parseInt(adultPassengersInput.value), parseInt(childPassengersInput.value));
        displayTickets(); // Update displayed tickets if rules change
    });


    // --- Initial Setup ---
    populateStations();

    // Swap stations button
    const swapBtn = document.getElementById('swapStations');
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            const temp = fromStationSelect.value;
            fromStationSelect.value = toStationSelect.value;
            toStationSelect.value = temp;
            updateRouteInfo();
        });
    }

    // Set min date for departure to today
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    departureDateInput.setAttribute('min', todayFormatted);

    // Initial call to update route info in case default selects have values
    updateRouteInfo();
});