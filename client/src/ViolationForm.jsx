import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function ViolationForm() {
    // ==========================================
    // 1. STATE MANAGEMENT (Storing Data)
    // ==========================================
    
    // State to hold the text data from the form inputs
    const [formData, setFormData] = useState({
        passengerName: '',
        vehicleNumber: '',
        routeNumber: '',
        violationType: '',
        otherDescription: '',
        currentLocation: '' // This will be filled automatically by GPS or manually
    });

    // State to hold the selected image/video files
    const [files, setFiles] = useState([]);

    // State to show a loading spinner while fetching GPS location
    const [loadingLocation, setLoadingLocation] = useState(false);

    // ==========================================
    // 2. EVENT HANDLERS (Handling User Input)
    // ==========================================

    // Function to handle text input changes
    // It updates the specific field in the formData object
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to handle file selection
    // It updates the files state with the selected files from the input
    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    // ==========================================
    // 3. GPS LOCATION FUNCTION (New Feature)
    // ==========================================
    
    // Function to get the user's current position using the Browser API
    const getLocation = () => {
        // Check if the browser supports Geolocation
        if (!navigator.geolocation) {
            Swal.fire('Error', 'Geolocation is not supported by your browser', 'error');
            return;
        }

        // Start loading animation on the button
        setLoadingLocation(true);

        // Request the current position from the device
        navigator.geolocation.getCurrentPosition(async (position) => {
            // Success: We got the coordinates
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                // Call OpenStreetMap API (Nominatim) to convert coordinates to an address (Reverse Geocoding)
                // We use this because it is free and does not require an API key like Google Maps
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                
                // Get the readable address from the API response
                const address = response.data.display_name; 
                
                // Update the form state with the found address
                setFormData(prevState => ({
                    ...prevState,
                    currentLocation: address
                }));

                // Stop loading animation
                setLoadingLocation(false);

            } catch (error) {
                console.error("Error fetching address from OpenStreetMap", error);
                
                // If the API fails, just show the raw coordinates (Latitude, Longitude)
                setFormData(prevState => ({
                    ...prevState,
                    currentLocation: `Lat: ${latitude}, Lon: ${longitude}`
                }));
                setLoadingLocation(false);
            }

        }, (error) => {
            // Error: User denied permission or GPS is off
            setLoadingLocation(false);
            Swal.fire('GPS Error', 'Unable to retrieve your location. Please allow location access.', 'error');
        });
    };

    // ==========================================
    // 4. FORM SUBMISSION (Sending Data to Backend)
    // ==========================================
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the page from reloading

        // We use FormData because we are sending files (images/videos)
        const data = new FormData();
        data.append('PassengerName', formData.passengerName);
        data.append('VehicleNumber', formData.vehicleNumber);
        data.append('RouteNumber', formData.routeNumber);
        data.append('ViolationType', formData.violationType);
        data.append('OtherDescription', formData.otherDescription);
        data.append('CurrentLocation', formData.currentLocation);

        // Loop through the files and append them to the FormData object
        for (let i = 0; i < files.length; i++) {
            data.append('EvidenceFiles', files[i]);
        }

        try {
            // Send a POST request to the .NET Backend API
            // IMPORTANT: If testing on Mobile, replace 'localhost' with your PC's IP Address (e.g., 10.203.178.6)
            // Example: 'https://10.203.178.6:7112/api/Report'
            const response = await axios.post('https://localhost:7112/api/Report', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Check if the server responded with success (200 OK)
            if (response.status === 200) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Violation report submitted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#0d6efd'
                });
                
                // Optional: You can reset the form here if needed
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to submit the report. Please check your connection.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
        }
    };

    // ==========================================
    // 5. UI RENDERING (The HTML View)
    // ==========================================
    return (
        <div className="row justify-content-center">
            {/* Responsive Columns: Full width on mobile, centered on larger screens */}
            <div className="col-12 col-md-8 col-lg-5">
                
                {/* Main Card Container */}
                <div className="card shadow-lg border-0 rounded-4">
                    
                    {/* Card Header */}
                    <div className="card-header bg-primary text-white text-center py-4 rounded-top-4">
                        <h3 className="mb-0 fw-bold">🚀 Report Violation</h3>
                        <small>Road Development Authority</small>
                    </div>

                    {/* Card Body containing the Form */}
                    <div className="card-body p-4 p-md-5">
                        <form onSubmit={handleSubmit}>
                            
                            {/* --- Passenger Details Section --- */}
                            <h6 className="text-muted text-uppercase mb-3" style={{fontSize: '0.8rem', letterSpacing: '1px'}}>Passenger Details</h6>
                            
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="pName" name="passengerName" placeholder="Name" value={formData.passengerName} onChange={handleChange} required />
                                <label htmlFor="pName">Passenger Name</label>
                            </div>

                            {/* --- Vehicle Details Section --- */}
                            <h6 className="text-muted text-uppercase mb-3 mt-4" style={{fontSize: '0.8rem', letterSpacing: '1px'}}>Vehicle Details</h6>

                            <div className="row g-2">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="vNum" name="vehicleNumber" placeholder="Vehicle No" value={formData.vehicleNumber} onChange={handleChange} required />
                                        <label htmlFor="vNum">Vehicle Number</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="rNum" name="routeNumber" placeholder="Route No" value={formData.routeNumber} onChange={handleChange} required />
                                        <label htmlFor="rNum">Route Number</label>
                                    </div>
                                </div>
                            </div>

                            {/* --- Incident Details Section --- */}
                            <h6 className="text-muted text-uppercase mb-3 mt-4" style={{fontSize: '0.8rem', letterSpacing: '1px'}}>Incident Details</h6>

                            <div className="form-floating mb-3">
                                <select className="form-select" id="vType" name="violationType" value={formData.violationType} onChange={handleChange} required>
                                    <option value="">Select Type</option>
                                    <option value="Speeding">Speeding (අධික වේගය)</option>
                                    <option value="Reckless Driving">Reckless Driving (අපරීක්ෂාකාරී ධාවනය)</option>
                                    <option value="Overloading">Overloading (වැඩිපුර මගීන්)</option>
                                    <option value="Ticket Issue">Ticket Not Issued (ටිකට් නොදීම)</option>
                                    <option value="Other">Other (වෙනත්)</option>
                                </select>
                                <label htmlFor="vType">Violation Type</label>
                            </div>

                            {/* --- Current Location Section (with GPS Button) --- */}
                            <div className="mb-3">
                                <label className="form-label">Current Location</label>
                                <div className="input-group">
                                    {/* Location Input Field */}
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="currentLocation" 
                                        placeholder="Click button to get location ->" 
                                        value={formData.currentLocation} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                    
                                    {/* GPS Button */}
                                    <button 
                                        className="btn btn-outline-primary" 
                                        type="button" 
                                        onClick={getLocation} 
                                        disabled={loadingLocation} // Disable button while loading
                                    >
                                        {/* Show spinner if loading, otherwise show text */}
                                        {loadingLocation ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Finding...
                                            </>
                                        ) : (
                                            <>📍 Get GPS</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* --- Evidence Upload Section --- */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Evidence (Photos/Video)</label>
                                <input type="file" className="form-control form-control-lg" multiple onChange={handleFileChange} />
                                <div className="form-text">Supported formats: JPG, PNG, MP4</div>
                            </div>

                            {/* --- Submit Button --- */}
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary btn-lg rounded-pill fw-bold shadow-sm">
                                    Submit Report
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
                {/* End of Card */}

            </div>
        </div>
    );
}