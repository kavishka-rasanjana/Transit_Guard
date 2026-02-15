import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaBus, FaMapMarkerAlt, FaCamera, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa';

const TransitGuard = () => {
    // ==========================================
    // 1. STATE MANAGEMENT
    // ==========================================
    
    // State to hold form input values
    const [formData, setFormData] = useState({
        busNumber: '',
        route: '',
        province: '',
        district: '',
        violationType: '',
        description: '',
        currentLocation: '',
        photo: null
    });

    // State to store all location data (Provinces & Districts) fetched from the Backend
    const [locationData, setLocationData] = useState([]); 
    
    // State to store only the districts available for the selected province
    const [availableDistricts, setAvailableDistricts] = useState([]); 

    // UI Loading states
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // ==========================================
    // 2. FETCH DATA ON COMPONENT LOAD (USEEFFECT)
    // ==========================================
    // This runs once when the page loads to get the list of Provinces/Districts from the API.
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                // Call the new Backend API Endpoint
                const response = await axios.get('http://localhost:5191/api/Location');
                setLocationData(response.data); // Store the response data
            } catch (error) {
                console.error("Failed to fetch locations", error);
                Swal.fire('Connection Error', 'Failed to load provinces list. Is the backend running?', 'error');
            }
        };
        fetchLocations();
    }, []);

    // ==========================================
    // 3. HANDLE INPUT CHANGES
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Update the specific field in the state
        setFormData(prevState => ({ ...prevState, [name]: value }));

        // Special Logic: If the user changes the 'Province'
        if (name === 'province') {
            // 1. Find the object in 'locationData' that matches the selected province
            const selectedProvinceData = locationData.find(p => p.province === value);
            
            // 2. Update the 'availableDistricts' state with the districts of that province
            setAvailableDistricts(selectedProvinceData ? selectedProvinceData.districts : []);
            
            // 3. Clear the previously selected district value to avoid mismatch
            setFormData(prev => ({ ...prev, province: value, district: '' }));
        }
    };

    // Handle File Selection (Evidence Photo)
    const handleFileChange = (e) => {
        setFormData(prevState => ({ ...prevState, photo: e.target.files[0] }));
    };

    // ==========================================
    // 4. GPS LOCATION FUNCTION
    // ==========================================
    const getLocation = () => {
        if (!navigator.geolocation) {
            Swal.fire('Error', 'Geolocation is not supported by your browser', 'error');
            return;
        }

        setLoadingLocation(true); // Show loading spinner

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Reverse Geocoding: Convert Coordinates -> Readable Address using OpenStreetMap
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                setFormData(prev => ({ ...prev, currentLocation: response.data.display_name }));
            } catch (error) {
                // Fallback: Use raw coordinates if address fetching fails
                setFormData(prev => ({ ...prev, currentLocation: `Lat: ${latitude}, Lon: ${longitude}` }));
            } finally {
                setLoadingLocation(false); // Hide loading spinner
            }
        }, (error) => {
            setLoadingLocation(false);
            Swal.fire('GPS Error', 'Please enable location services or check your connection.', 'error');
        }, { enableHighAccuracy: true });
    };

    // ==========================================
    // 5. FORM SUBMISSION FUNCTION
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default page reload
        
        // Validation: Ensure a photo is uploaded
        if (!formData.photo) {
            Swal.fire('Evidence Required', 'Please upload a photo as evidence.', 'warning');
            return;
        }

        setSubmitting(true); // Disable button while sending

        // Create FormData object to send mixed content (Text + File)
        const data = new FormData();
        
        // Map Frontend State to Backend DTO Property Names
        data.append('PassengerName', 'Anonymous User'); // Default value as auth is not implemented yet
        data.append('VehicleNumber', formData.busNumber);      
        data.append('RouteNumber', formData.route);           
        data.append('ViolationType', formData.violationType); 
        data.append('OtherDescription', formData.description); 
        data.append('CurrentLocation', formData.currentLocation);
        data.append('EvidenceFiles', formData.photo); // Key must match Backend: List<IFormFile> EvidenceFiles

        try {
            // Send POST request to Backend API (using HTTP port 5191)
            await axios.post('http://localhost:5191/api/report', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Success Alert
            Swal.fire({
                title: 'Success!',
                text: 'Report submitted successfully!',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            });

            // Reset Form and State after success
            setFormData({ 
                busNumber: '', route: '', province: '', district: '', 
                violationType: '', description: '', currentLocation: '', photo: null 
            });
            document.getElementById("file-upload").value = ""; 
            setAvailableDistricts([]); // Clear district dropdown

        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire('Submission Failed', 'Could not connect to the server. Please check if the backend is running.', 'error');
        } finally {
            setSubmitting(false); // Re-enable button
        }
    };

    // ==========================================
    // 6. JSX UI RENDERING
    // ==========================================
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            
            {/* Page Header */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
                <div className="mx-auto h-16 w-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl shadow-lg">
                    <FaBus />
                </div>
                <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
                    Transit Guard
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Report public transport violations instantly
                </p>
            </div>

            {/* Main Form Container */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border-t-4 border-blue-600">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Bus Info Section */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Bus Number</label>
                                <input type="text" name="busNumber" required placeholder="NP-1234"
                                    value={formData.busNumber} onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Route No</label>
                                <input type="text" name="route" required placeholder="138"
                                    value={formData.route} onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                        </div>

                        {/* Dynamic Location Dropdowns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Province Dropdown */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Province</label>
                                <select name="province" required value={formData.province} onChange={handleChange}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option value="">Select Province</option>
                                    {/* Map through locationData to create options */}
                                    {locationData.map((loc, index) => (
                                        <option key={index} value={loc.province}>{loc.province}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* District Dropdown (Dependent on Province) */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700">District</label>
                                <select name="district" required value={formData.district} onChange={handleChange} disabled={!formData.province}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100">
                                    <option value="">Select District</option>
                                    {/* Map through availableDistricts (filtered list) */}
                                    {availableDistricts.map((dist, index) => (
                                        <option key={index} value={dist}>{dist}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Violation Type Dropdown with Icon */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Violation Type</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaExclamationTriangle className="text-gray-400"/>
                                </div>
                                <select name="violationType" required value={formData.violationType} onChange={handleChange}
                                    className="mt-1 block w-full pl-10 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option value="">Select Violation</option>
                                    <option value="Over Speeding">Over Speeding</option>
                                    <option value="Reckless Driving">Reckless Driving</option>
                                    <option value="Overloading">Overloading</option>
                                </select>
                            </div>
                        </div>

                        {/* Description Text Area */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Description</label>
                            <textarea name="description" rows="3" required placeholder="Describe what happened..."
                                value={formData.description} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                        </div>

                        {/* GPS Location Section */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Incident Location</label>
                            <div className="flex gap-2">
                                <input type="text" name="currentLocation" readOnly 
                                    value={formData.currentLocation} 
                                    placeholder="Click GPS button"
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed" />
                                
                                <button type="button" onClick={getLocation} disabled={loadingLocation}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm">
                                    {/* Show Spinner if loading, else show Map Icon */}
                                    {loadingLocation ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FaMapMarkerAlt />}
                                </button>
                            </div>
                        </div>

                        {/* Photo Upload Area */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Evidence Photo</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-blue-50 transition-colors cursor-pointer group">
                                <div className="space-y-1 text-center">
                                    <FaCamera className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="photo" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                    {/* Show Selected Filename if exists */}
                                    {formData.photo && <p className="text-sm text-green-600 font-bold mt-2 bg-green-100 py-1 px-2 rounded inline-block">Selected: {formData.photo.name}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button type="submit" disabled={submitting}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105">
                                {submitting ? 
                                    'Sending...' : 
                                    <><FaPaperPlane className="mr-2" /> Submit Report</>
                                }
                            </button>
                        </div>

                    </form>
                </div>
                {/* Footer */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    &copy; 2026 RDA Traffic Management System.
                </p>
            </div>
        </div>
    );
};

export default TransitGuard;