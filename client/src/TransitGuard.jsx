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
        priority: 0, // Stores the Priority Score (1=High, 2=Med, 3=Low)
        description: '',
        currentLocation: '',
        photo: null
    });

    // State to store data fetched from Backend
    const [locationData, setLocationData] = useState([]); 
    const [availableDistricts, setAvailableDistricts] = useState([]); 
    const [violationList, setViolationList] = useState([]); 

    // UI Loading states
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // ==========================================
    // 2. FETCH DATA ON COMPONENT LOAD
    // ==========================================
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check your Backend Port! (Assuming 5191 here)
                const BASE_URL = 'http://localhost:5191'; 

                // 1. Fetch Provinces & Districts
                const locResponse = await axios.get(`${BASE_URL}/api/Location`);
                setLocationData(locResponse.data);

                // 2. Fetch Violation Types & Scores from Backend
                const vioResponse = await axios.get(`${BASE_URL}/api/ViolationType`);
                setViolationList(vioResponse.data);

            } catch (error) {
                console.error("Failed to fetch data", error);
                Swal.fire('Connection Error', 'Failed to load initial data. Is the backend running?', 'error');
            }
        };
        fetchData();
    }, []);

    // ==========================================
    // 3. HANDLE INPUT CHANGES & LOGIC
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Update state
        setFormData(prevState => ({ ...prevState, [name]: value }));

        // --- Logic: Handle Province Change ---
        if (name === 'province') {
            const selectedProvinceData = locationData.find(p => p.province === value);
            setAvailableDistricts(selectedProvinceData ? selectedProvinceData.districts : []);
            // Reset district when province changes
            setFormData(prev => ({ ...prev, province: value, district: '' }));
        }

        // --- Logic: Handle Violation Change (Set Priority) ---
        if (name === 'violationType') {
            const selectedViolation = violationList.find(v => v.name === value);
            
            if (selectedViolation) {
                // Automatically set the priority score based on the selection
                setFormData(prev => ({ 
                    ...prev, 
                    violationType: value,
                    priority: selectedViolation.priorityScore 
                }));
                console.log(`Selected: ${value}, Priority: ${selectedViolation.priorityScore}`);
            }
        }
    };

    // Handle File Selection
    const handleFileChange = (e) => {
        setFormData(prevState => ({ ...prevState, photo: e.target.files[0] }));
    };

    // ==========================================
    // 4. GPS LOCATION FUNCTION
    // ==========================================
    const getLocation = () => {
        if (!navigator.geolocation) {
            Swal.fire('Error', 'Geolocation is not supported', 'error');
            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                setFormData(prev => ({ ...prev, currentLocation: response.data.display_name }));
            } catch (error) {
                setFormData(prev => ({ ...prev, currentLocation: `Lat: ${latitude}, Lon: ${longitude}` }));
            } finally {
                setLoadingLocation(false);
            }
        }, (error) => {
            setLoadingLocation(false);
            Swal.fire('GPS Error', 'Please enable location services.', 'error');
        }, { enableHighAccuracy: true });
    };

    // ==========================================
    // 5. FORM SUBMISSION FUNCTION
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        if (!formData.photo) {
            Swal.fire('Evidence Required', 'Please upload a photo as evidence.', 'warning');
            return;
        }

        setSubmitting(true);

        const data = new FormData();
        
        // Match these Keys EXACTLY with 'ReportDto.cs' in Backend
        data.append('PassengerName', 'Anonymous User'); 
        data.append('VehicleNumber', formData.busNumber);      
        data.append('RouteNumber', formData.route);           
        data.append('OtherDescription', formData.description); 
        data.append('CurrentLocation', formData.currentLocation);
        
        data.append('Province', formData.province);
        data.append('District', formData.district);
        data.append('ViolationType', formData.violationType); 
        data.append('Priority', formData.priority); 

        data.append('EvidenceFiles', formData.photo); 

        try {
            // Check your Backend Port!
            await axios.post('http://localhost:5191/api/report', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            Swal.fire({
                title: 'Success!',
                text: 'Report submitted successfully!',
                icon: 'success',
                confirmButtonColor: '#2563EB'
            });

            // Reset Form
            setFormData({ 
                busNumber: '', route: '', province: '', district: '', 
                violationType: '', priority: 0, description: '', currentLocation: '', photo: null 
            });
            document.getElementById("file-upload").value = ""; 
            setAvailableDistricts([]); 

        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire('Submission Failed', 'Could not connect to the server.', 'error');
        } finally {
            setSubmitting(false); 
        }
    };

    // ==========================================
    // 6. JSX UI RENDERING
    // ==========================================
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            
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

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border-t-4 border-blue-600">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Bus Info */}
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

                        {/* Location Dropdowns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Province</label>
                                <select name="province" required value={formData.province} onChange={handleChange}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option value="">Select Province</option>
                                    {locationData.map((loc, index) => (
                                        <option key={index} value={loc.province}>{loc.province}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">District</label>
                                <select name="district" required value={formData.district} onChange={handleChange} disabled={!formData.province}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100">
                                    <option value="">Select District</option>
                                    {availableDistricts.map((dist, index) => (
                                        <option key={index} value={dist}>{dist}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Violation Type Dropdown (Dynamic from DB) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Violation Type</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaExclamationTriangle className="text-gray-400"/>
                                </div>
                                <select name="violationType" required value={formData.violationType} onChange={handleChange}
                                    className="mt-1 block w-full pl-10 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option value="">Select Violation</option>
                                    {/* Map through fetched violationList */}
                                    {violationList.map((violation, index) => (
                                        <option key={index} value={violation.name}>{violation.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Description</label>
                            <textarea name="description" rows="3" required placeholder="Describe what happened..."
                                value={formData.description} onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                        </div>

                        {/* GPS Location */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Incident Location</label>
                            <div className="flex gap-2">
                                <input type="text" name="currentLocation" readOnly 
                                    value={formData.currentLocation} 
                                    placeholder="Click GPS button"
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed" />
                                
                                <button type="button" onClick={getLocation} disabled={loadingLocation}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm">
                                    {loadingLocation ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : <FaMapMarkerAlt />}
                                </button>
                            </div>
                        </div>

                        {/* Photo Upload */}
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
                <p className="text-center text-gray-500 text-xs mt-6">
                    &copy; 2026 RDA Traffic Management System.
                </p>
            </div>
        </div>
    );
};

export default TransitGuard;