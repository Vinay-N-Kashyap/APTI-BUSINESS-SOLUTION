 const multiSelectData = {
            area: [
                'Koramangala',
                'Indiranagar',
                'Whitefield',
                'HSR Layout',
                'Jayanagar',
                'Malleshwaram',
                'Andheri',
                'Bandra',
                'Powai',
                'Thane',
                'Gurgaon',
                'Noida',
                'Connaught Place',
                'Dwarka',
                'Adyar',
                'T Nagar',
                'Anna Nagar',
                'Velachery'
            ],
            travelStates: [
                'Karnataka',
                'Tamil Nadu',
                'Andhra Pradesh',
                'Telangana',
                'Kerala',
                'Maharashtra',
                'Gujarat',
                'Rajasthan',
                'Delhi',
                'West Bengal',
                'Madhya Pradesh',
                'Uttar Pradesh'
            ],
            languages: [
                'Hindi',
                'English',
                'Tamil',
                'Telugu',
                'Kannada',
                'Malayalam',
                'Marathi',
                'Bengali',
                'Gujarati',
                'Punjabi',
                'Odia',
                'Urdu'
            ]
        };

        // Selected values storage
        const selectedValues = {
            area: [],
            travelStates: [],
            languages: []
        };

        // Initialize multi-select dropdowns
        function initMultiSelect(fieldName) {
            const dropdown = document.getElementById(`${fieldName}Dropdown`);
            dropdown.innerHTML = '';
            
            multiSelectData[fieldName].forEach(item => {
                const option = document.createElement('div');
                option.className = 'multi-select-option';
                option.innerHTML = `
                    <input type="checkbox" id="${fieldName}_${item}" value="${item}" 
                           onchange="updateSelection('${fieldName}', '${item}', this.checked)">
                    <label for="${fieldName}_${item}">${item}</label>
                `;
                dropdown.appendChild(option);
            });
        }

        // Toggle dropdown visibility
        function toggleDropdown(fieldName) {
            const dropdown = document.getElementById(`${fieldName}Dropdown`);
            const display = document.getElementById(`${fieldName}Display`);
            
            // Close other dropdowns
            document.querySelectorAll('.multi-select-dropdown').forEach(d => {
                if (d.id !== `${fieldName}Dropdown`) {
                    d.classList.remove('show');
                }
            });
            document.querySelectorAll('.multi-select-display').forEach(d => {
                if (d.id !== `${fieldName}Display`) {
                    d.classList.remove('active');
                }
            });
            
            dropdown.classList.toggle('show');
            display.classList.toggle('active');
        }

        // Update selection
        function updateSelection(fieldName, value, isChecked) {
            if (isChecked) {
                if (!selectedValues[fieldName].includes(value)) {
                    selectedValues[fieldName].push(value);
                }
            } else {
                selectedValues[fieldName] = selectedValues[fieldName].filter(v => v !== value);
            }
            updateDisplay(fieldName);
        }

        // Update display with selected tags
        function updateDisplay(fieldName) {
            const display = document.getElementById(`${fieldName}Display`);
            display.innerHTML = '';
            
            if (selectedValues[fieldName].length === 0) {
                const placeholder = document.createElement('span');
                placeholder.className = 'multi-select-placeholder';
                if (fieldName === 'area') {
                    placeholder.textContent = 'Select areas';
                } else if (fieldName === 'travelStates') {
                    placeholder.textContent = 'Select preferred travel states';
                } else if (fieldName === 'languages') {
                    placeholder.textContent = 'Select languages';
                }
                display.appendChild(placeholder);
            } else {
                selectedValues[fieldName].forEach(value => {
                    const tag = document.createElement('span');
                    tag.className = 'selected-tag';
                    tag.innerHTML = `${value} <span class="remove" onclick="removeTag('${fieldName}', '${value}')">×</span>`;
                    display.appendChild(tag);
                });
            }
        }

        // Remove tag
        function removeTag(fieldName, value) {
            event.stopPropagation();
            selectedValues[fieldName] = selectedValues[fieldName].filter(v => v !== value);
            const checkbox = document.getElementById(`${fieldName}_${value}`);
            if (checkbox) checkbox.checked = false;
            updateDisplay(fieldName);
        }

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.multi-select-container')) {
                document.querySelectorAll('.multi-select-dropdown').forEach(d => {
                    d.classList.remove('show');
                });
                document.querySelectorAll('.multi-select-display').forEach(d => {
                    d.classList.remove('active');
                });
            }
        });

        // Initialize on page load
        window.onload = function() {
            initMultiSelect('area');
            initMultiSelect('travelStates');
            initMultiSelect('languages');
        };

        // Function to collect all form data into an object
        function collectFormData() {
            // Create comprehensive form data object
            const formData = {
                personalInformation: {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    dateOfBirth: document.getElementById('dob').value,
                    gender: document.getElementById('gender').value
                },
                addressInformation: {
                    addressLine1: document.getElementById('address1').value,
                    addressLine2: document.getElementById('address2').value || null,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    pinCode: document.getElementById('pin').value,
                    postOffice: document.getElementById('postcard').value,
                    area: selectedValues.area
                },
                accountInformation: {
                    status: document.getElementById('status').value,
                    type: document.getElementById('type').value,
                    onboardingDate: document.getElementById('onboarding').value
                },
                preferences: {
                    preferredTravelStates: selectedValues.travelStates,
                    languagesKnown: selectedValues.languages
                },
                metadata: {
                    submittedAt: new Date().toISOString(),
                    submittedDate: new Date().toLocaleDateString('en-IN'),
                    submittedTime: new Date().toLocaleTimeString('en-IN')
                }
            };
            
            return formData;
        }
        
        // Function to save data to JSON (append to existing data)
        async function saveToJSON(data) {
            try {
                // Get existing data from localStorage
                let existingData = [];
                const storedData = localStorage.getItem('registrationData');
                
                if (storedData) {
                    existingData = JSON.parse(storedData);
                }
                
                // Add new data with unique ID
                data.id = Date.now();
                existingData.push(data);
                
                // Save back to localStorage
                localStorage.setItem('registrationData', JSON.stringify(existingData, null, 2));
                
                // Log to console for debugging
                console.log('=== NEW SUBMISSION ===');
                console.log(data);
                console.log('\n=== ALL STORED DATA ===');
                console.log(existingData);
                console.log('\n=== TOTAL RECORDS ===');
                console.log(existingData.length);
                
                // Show data in a formatted way
                displayStoredData();
                
                return existingData;
            } catch (error) {
                console.error('Error saving data:', error);
                alert('Error saving data. Please try again.');
            }
        }
        
        // Function to display all stored data
        function displayStoredData() {
            const storedData = localStorage.getItem('registrationData');
            if (storedData) {
                const data = JSON.parse(storedData);
                console.log('=== FORMATTED DATA.JSON CONTENT ===');
                console.log(JSON.stringify(data, null, 2));
            }
        }
        
        // Function to download all data as JSON file
        function downloadAllData() {
            const storedData = localStorage.getItem('registrationData');
            if (!storedData) {
                alert('No data to download!');
                return;
            }
            
            const blob = new Blob([storedData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'data.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        
        // Function to clear all data
        function clearAllData() {
            if (confirm('Are you sure you want to clear all stored data?')) {
                localStorage.removeItem('registrationData');
                console.log('All data cleared!');
                alert('All data has been cleared!');
            }
        }
        
        // Handle form submission
        function handleSubmit(event) {
            event.preventDefault();
            
            // Validate that at least one area is selected
            if (selectedValues.area.length === 0) {
                alert('Please select at least one area');
                return;
            }
            
            // Collect form data into object
            const formData = collectFormData();
            
            // Save to localStorage (append to existing data)
            saveToJSON(formData);
            
            // Show success message
            document.getElementById('successMessage').classList.add('show');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Alert user
            const recordCount = JSON.parse(localStorage.getItem('registrationData') || '[]').length;
            alert(`Form submitted successfully! Total records stored: ${recordCount}\n\nData is saved in browser storage. Open Console (F12) to view all data.`);
            
            // Clear form after 3 seconds
            setTimeout(() => {
                resetForm();
                document.getElementById('successMessage').classList.remove('show');
            }, 3000);
        }

        // Reset form
        function resetForm() {
            document.getElementById('userForm').reset();
            selectedValues.area = [];
            selectedValues.travelStates = [];
            selectedValues.languages = [];
            updateDisplay('area');
            updateDisplay('travelStates');
            updateDisplay('languages');
            document.querySelectorAll('.multi-select-dropdown input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            document.getElementById('successMessage').classList.remove('show');
        }