import React, { useState } from 'react';

// Main App component
const App = () => {
    // State variables for input text, prediction result, loading status, and error messages
    const [textInput, setTextInput] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Group member details
    const groupMembers = [
        { name: "Natnael Gizaw", id: "ATE/6967/13" },
        { name: "Tamene Behailu", id: "ATE/3052/13" },
        { name: "Tamrat Hordofa", id: "ATE/6788/13" },
        { name: "Sirak Abera", id: "ATE/7251/13" },
        { name: "Yosef Demis", id: "ATE/6444/13" },
    ];

    // Function to handle text input changes
    const handleTextInputChange = (e) => {
        setTextInput(e.target.value);
        // Clear previous prediction and error when text changes
        setPrediction(null);
        setError(null);
    };

    // Function to handle prediction submission
    const handleSubmit = async () => {
        // Clear previous error before a new submission
        setError(null);
        // Do not proceed if input is empty
        if (!textInput.trim()) {
            setError("Please enter some Amharic text to classify.");
            return;
        }
        setIsLoading(true); // Set loading state to true
        try {
            // Make a POST request to the FastAPI backend
            // IMPORTANT: This URL MUST explicitly point to your FastAPI server
            const response = await fetch('https://natishanau-amharic-fake-news-backend.hf.space/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: textInput }), // Send the text input as JSON
            });

            // Check if the response was successful
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // Parse the JSON response
            setPrediction(data); // Set the prediction result
        } catch (err) {
            console.error("Prediction error:", err);
            setError(`Failed to get prediction: ${err.message}`); // Set error message
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        // Main container: centers content horizontally and vertically
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 flex justify-center items-center p-4 py-8 font-inter">
            {/* Wrapper for both the detector and group members cards.
                On medium screens and up, they will be in a row (flex-row).
                On smaller screens, they will stack (flex-col).
                items-start aligns content to the top when in a row. */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 w-full max-w-4xl lg:max-w-5xl">

                {/* Main Detector Card */}
                <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full md:w-3/5 lg:w-2/3 border border-gray-700 relative overflow-hidden flex-shrink-0">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-white opacity-5 pointer-events-none" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M9 0H6a3 3 0 0 0 3 3v3H0V3a3 3 0 0 1 3-3h3zM3 9a3 3 0 0 0 3-3v3H0V6a3 3 0 0 1 3 3z'/%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>

                    <div className="relative z-10"> {/* Content wrapper for z-index */}
                        <h1 className="text-5xl font-extrabold text-center text-blue-400 mb-6 drop-shadow-lg leading-tight">
                            Amharic Fake News Detector
                        </h1>
                        <p className="text-lg text-gray-400 text-center mb-8">
                            Unmasking misinformation in Amharic text.
                        </p>

                        <div className="mb-6">
                            <label htmlFor="news-text" className="block text-lg font-medium text-gray-300 mb-2">
                                Enter Amharic News Text:
                            </label>
                            <textarea
                                id="news-text"
                                className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-50 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 ease-in-out resize-y min-h-[150px] shadow-inner"
                                placeholder="የዜና ጽሑፍ እዚህ ያስገቡ..." // Placeholder in Amharic
                                value={textInput}
                                onChange={handleTextInputChange}
                                rows="8"
                            ></textarea>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xl shadow-md"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Detecting...
                                </>
                            ) : (
                                'Detect Fake News'
                            )}
                        </button>

                        {error && (
                            <div className="mt-6 p-4 bg-red-800 bg-opacity-40 border border-red-700 text-red-300 rounded-lg text-center shadow-lg">
                                <p className="font-semibold text-xl">Error:</p>
                                <p className="text-base mt-2">{error}</p>
                            </div>
                        )}

                        {prediction && !error && (
                            <div className="mt-6 p-6 bg-gray-700 rounded-lg shadow-xl border border-gray-600">
                                <h2 className="text-2xl font-semibold text-blue-300 mb-4 text-center border-b border-gray-600 pb-3">Prediction Result</h2>
                                <div className="text-center">
                                    <p className="text-lg text-gray-300 mb-3">
                                        Input Text: <span className="font-light italic text-gray-400 block mt-2 p-2 bg-gray-600 rounded-md text-sm break-words max-h-40 overflow-auto">{prediction.original_text}</span>
                                    </p>
                                    <p className="text-4xl font-extrabold mt-4 flex items-center justify-center flex-wrap">
                                        <span className="text-gray-200">This news is likely:</span>
                                        <span className={`ml-3 p-2 px-4 rounded-full shadow-lg ${prediction.prediction === 'Fake News' ? 'bg-red-600 text-white animate-pulse' : 'bg-green-600 text-white'}`}>
                                            {prediction.prediction}
                                        </span>
                                    </p>
                                    <p className="text-xl text-gray-400 mt-4">
                                        Confidence: <span className="font-bold text-gray-200">{Math.round(prediction.confidence * 10000) / 100}%</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-gray-500 mt-8 text-center leading-relaxed">
                            <strong className="text-red-400">Important Note:</strong> This prototype uses a general Amharic BERT model. For accurate Fake News Detection, the model must be fine-tuned on a dedicated Amharic fake news dataset. The classification 'Real News' vs. 'Fake News' is for demonstration and would depend on your model's specific training labels (e.g., 0 for Real, 1 for Fake).
                        </p>
                    </div>
                </div>

                {/* Group Members Section */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full md:w-2/5 lg:w-1/3 border border-gray-700 relative overflow-hidden flex-shrink-0 mt-8 md:mt-0">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 bg-white opacity-5 pointer-events-none" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M9 0H6a3 3 0 0 0 3 3v3H0V3a3 3 0 0 1 3-3h3zM3 9a3 3 0 0 0 3-3v3H0V6a3 3 0 0 1 3 3z'/%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                    <div className="relative z-10 text-center">
                        {/* Logo Placeholder */}
                        <div className="mb-6">
                            <img
                                src={`${process.env.PUBLIC_URL}/logo.png`} // Changed back to logo.png
                                alt="University Logo"
                                className="mx-auto h-24 w-24 rounded-full border-2 border-blue-400 shadow-lg object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/60A5FA/FFFFFF?text=Logo'; }} // Fallback if logo not found
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-blue-300 mb-4">Addis Ababa Institute of Technology</h2>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">School of Information Technology and Engineering</h3>
                        <p className="text-lg text-gray-400 mb-4">Department of Software Engineering</p>
                        <p className="text-2xl font-extrabold text-blue-400 mb-6 border-b border-gray-600 pb-3">NLP Assignment</p>

                        <h2 className="text-3xl font-bold text-blue-300 mb-6">Group Members</h2>
                        <ul className="space-y-3 text-lg">
                            {groupMembers.map((member, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-md shadow-inner border border-gray-600">
                                    <span className="text-gray-200 font-medium">{member.name}</span>
                                    <span className="text-gray-400 font-mono">{member.id}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
