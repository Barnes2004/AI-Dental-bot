// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const feedbackBtns = document.querySelectorAll('.feedback-btn');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const feedbackForm = document.getElementById('feedback-form');
    const uploadBtns = document.querySelectorAll('.upload-btn');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    const newAnalysisBtn = document.querySelector('.new-analysis-btn');
    
    // Apply animation classes to elements
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    document.querySelectorAll('.treatment-card').forEach((card, index) => {
        card.classList.add('slide-in-up');
        card.style.animationDelay = `${index * 0.1 + 0.2}s`;
    });
    
    // Function to add a message to the chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'} fade-in`;
        
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const timeString = `${formattedHours}:${formattedMinutes} ${ampm}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom of chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to handle user input
    function handleUserInput() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            
            // Simulate AI response after a short delay
            setTimeout(() => {
                simulateAIResponse(message);
            }, 1000);
        }
    }
    
    // Simulated AI responses based on user input
    function simulateAIResponse(userMessage) {
        let aiResponse;
        
        // Convert user message to lowercase for easier matching
        const lowerCaseMessage = userMessage.toLowerCase();
        
        // Check for patterns in the user message
        if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
            aiResponse = "Hello! I'm your Dental AI Assistant. I can help diagnose conditions and suggest treatments based on patient data. How can I assist you today?";
        } else if (lowerCaseMessage.includes("x-ray") || lowerCaseMessage.includes("scan")) {
            aiResponse = "I've analyzed the uploaded X-ray and detected potential issues: <br><br>1. Moderate caries on tooth #18 (occlusal surface)<br>2. Early-stage periodontal disease in lower anterior region<br>3. Potential need for root canal on tooth #30<br><br>Would you like me to suggest treatment options for any of these conditions?";
        } else if (lowerCaseMessage.includes("treatment") || lowerCaseMessage.includes("suggestions")) {
            aiResponse = "Based on the patient's condition, here are my recommended treatments:<br><br>1. <strong>Composite Restoration</strong> for tooth #18 - Expected outcome: Resolve caries with 95% success rate<br>2. <strong>Scaling and Root Planing</strong> for periodontal disease - Expected outcome: Reduction in pocket depth within 4-6 weeks<br>3. <strong>Root Canal Therapy</strong> for tooth #30 - Expected outcome: Pain relief and preservation of natural tooth<br><br>Would you like more details on any of these treatments?";
        } else if (lowerCaseMessage.includes("patient") || lowerCaseMessage.includes("history")) {
            aiResponse = "Patient History Analysis:<br><br>- 45-year-old male<br>- Hypertension (controlled with medication)<br>- Previous allergic reaction to penicillin<br>- Last dental visit: 18 months ago<br>- Consistent reports of sensitivity to cold on lower right quadrant<br><br>Based on this history, I recommend avoiding epinephrine in anesthetics and considering alternative antibiotics if needed.";
        } else if (lowerCaseMessage.includes("integrate") || lowerCaseMessage.includes("records")) {
            aiResponse = "I've successfully connected to the clinic's record system. I can now access:<br><br>- Previous treatment records<br>- Insurance information<br>- Scheduled appointments<br>- Medication history<br><br>This integration allows me to provide more personalized treatment suggestions based on comprehensive patient data.";
        } else {
            aiResponse = "I've analyzed this information and will incorporate it into my assessment. Would you like me to analyze any specific aspect of the patient's dental condition or suggest evidence-based treatments based on the available data?";
        }
        
        addMessage(aiResponse);
    }
    
    // Event listeners
    sendBtn.addEventListener('click', handleUserInput);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
    
    // Voice input functionality
    let isRecording = false;
    let recognition;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
        };
        
        recognition.onend = function() {
            micBtn.classList.remove('recording');
            isRecording = false;
        };
    }
    
    micBtn.addEventListener('click', function() {
        if (!recognition) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }
        
        if (!isRecording) {
            recognition.start();
            micBtn.classList.add('recording');
            isRecording = true;
        } else {
            recognition.stop();
            micBtn.classList.remove('recording');
            isRecording = false;
        }
    });
    
    // Feedback functionality
    feedbackBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            feedbackModal.classList.add('show');
        });
    });
    
    closeModalBtn.addEventListener('click', function() {
        feedbackModal.classList.remove('show');
    });
    
    cancelBtn.addEventListener('click', function() {
        feedbackModal.classList.remove('show');
    });
    
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate feedback processing
        const formData = new FormData(feedbackForm);
        const feedbackType = formData.get('feedback-type');
        const feedbackText = formData.get('feedback-text');
        
        console.log('Feedback submitted:', {
            type: feedbackType,
            text: feedbackText
        });
        
        // Reset form and close modal
        feedbackForm.reset();
        feedbackModal.classList.remove('show');
        
        // Thank user for feedback
        addMessage("Thank you for your feedback! It helps me improve my recommendations for future cases.");
    });
    
    // File upload functionality
    uploadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*, application/pdf';
            
            fileInput.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Simulate file upload and processing
                    addMessage(`Uploading and analyzing ${file.name}...`);
                    
                    setTimeout(() => {
                        addMessage(`I've analyzed ${file.name} and detected the following:<br><br>1. Clear evidence of dental caries on teeth #14, #15<br>2. Early signs of enamel erosion on anterior teeth<br>3. Previous root canal treatment on tooth #19 appears stable<br><br>Would you like treatment suggestions based on these findings?`);
                    }, 2000);
                }
            };
            
            fileInput.click();
        });
    });
    
    // Quick action buttons
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            switch(action) {
                case 'analyze':
                    addMessage('Please upload an X-ray or patient records for me to analyze.', true);
                    setTimeout(() => {
                        addMessage('I can analyze digital X-rays, CBCT scans, intraoral photos, and patient medical records. Simply upload the files and I\'ll provide a comprehensive assessment.');
                    }, 1000);
                    break;
                    
                case 'suggest':
                    addMessage('I need treatment suggestions for a patient with severe periodontal disease.', true);
                    setTimeout(() => {
                        addMessage('For severe periodontal disease, I recommend:<br><br>1. <strong>Full-Mouth Debridement</strong> - Remove all plaque and calculus<br>2. <strong>Scaling and Root Planing</strong> - Deep cleaning below the gumline<br>3. <strong>Localized Antibiotic Therapy</strong> - Arestin® in pockets >5mm<br>4. <strong>Follow-up Maintenance</strong> - 3-month recall schedule<br><br>Studies show this comprehensive approach has a 70-85% success rate in stabilizing the condition.');
                    }, 1000);
                    break;
                    
                case 'integrate':
                    addMessage('Can you connect to our clinic management system?', true);
                    setTimeout(() => {
                        addMessage('I can integrate with most popular dental practice management systems including Dentrix, Eaglesoft, Open Dental, and Curve Dental. This allows me to access patient records, treatment history, and insurance information. Would you like me to walk you through the integration process?');
                    }, 1000);
                    break;
            }
        });
    });
    
    // New analysis button
    if (newAnalysisBtn) {
        newAnalysisBtn.addEventListener('click', function() {
            // Clear chat history
            while (chatMessages.firstChild) {
                chatMessages.removeChild(chatMessages.firstChild);
            }
            
            // Add welcome message
            addMessage("Welcome to a new dental analysis session. You can upload patient records or X-rays for me to analyze, or ask me for treatment suggestions for specific conditions.");
        });
    }
    
    // Learning and improvement system
    const learningSystem = {
        feedbackData: [],
        
        addFeedback: function(diagnosisId, wasCorrect, dentistSuggestion) {
            this.feedbackData.push({
                diagnosisId,
                wasCorrect,
                dentistSuggestion,
                timestamp: new Date()
            });
            
            // In a real system, this would be sent to a server
            this.updateModel();
            
            return this.feedbackData.length;
        },
        
        updateModel: function() {
            // Simulate model updating
            console.log('Learning from new feedback data...');
            // In a real system, this would trigger model retraining or parameter adjustment
        },
        
        getAccuracyMetrics: function() {
            if (this.feedbackData.length === 0) return { accuracy: 0, sampleSize: 0 };
            
            const correctDiagnoses = this.feedbackData.filter(item => item.wasCorrect).length;
            return {
                accuracy: (correctDiagnoses / this.feedbackData.length) * 100,
                sampleSize: this.feedbackData.length
            };
        }
    };
    
    // Expose learning system to global scope for debugging
    window.dentalAILearning = learningSystem;
    
    // Initialize the chat with a welcome message
    addMessage("Welcome to DentalAI Assistant. I can help analyze patient data, suggest treatments, and integrate with your clinic systems. How can I assist you today?");
});
