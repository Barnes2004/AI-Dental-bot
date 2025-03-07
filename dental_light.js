        // DOM Elements
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        const loadingAnimation = document.getElementById('loadingAnimation');
        const analyzeButton = document.getElementById('analyzeButton');
        const confidenceFill = document.getElementById('confidenceFill');
        const confidencePercent = document.getElementById('confidencePercent');
        const conditionDesc = document.getElementById('conditionDesc');
        const treatmentsContainer = document.getElementById('treatmentsContainer');
        const chatButton = document.getElementById('chatButton');
        const chatContainer = document.getElementById('chatContainer');
        const chatClose = document.getElementById('chatClose');
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        const chatMessages = document.getElementById('chatMessages');
        
        // Dummy data for demonstration
        const dummyConditions = [
            {
                name: "Dental Caries (Cavity)",
                description: "Decay detected on the occlusal surface of tooth #19 (lower left first molar). Moderate depth, approaching dentin.",
                confidence: 92,
                treatments: [
                    {
                        name: "Composite Filling",
                        description: "Remove decayed material and fill with tooth-colored composite resin.",
                        outcome: "Preserves tooth structure with excellent aesthetics",
                        recommended: true
                    },
                    {
                        name: "Amalgam Filling",
                        description: "Traditional metal filling with longer durability for posterior teeth.",
                        outcome: "Durable solution for moderate to large cavities",
                        recommended: false
                    }
                ]
            },
            {
                name: "Periapical Abscess",
                description: "Infection at the root of tooth #30 (lower right first molar). Visible radiolucency at apex suggesting bacterial infection.",
                confidence: 88,
                treatments: [
                    {
                        name: "Root Canal Therapy",
                        description: "Remove infected pulp, clean canals, and seal with gutta-percha.",
                        outcome: "Saves natural tooth and eliminates infection",
                        recommended: true
                    },
                    {
                        name: "Extraction + Implant",
                        description: "Remove tooth and replace with dental implant.",
                        outcome: "Permanent replacement with natural function",
                        recommended: false
                    },
                    {
                        name: "Antibiotic Therapy",
                        description: "Prescribed as adjunct treatment to address acute infection.",
                        outcome: "Temporary relief, must be followed by definitive treatment",
                        recommended: false
                    }
                ]
            }
        ];
        
        // Event Listeners
        fileInput.addEventListener('change', handleFileSelect);
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleFileDrop);
        analyzeButton.addEventListener('click', analyzeImage);
        chatButton.addEventListener('click', toggleChat);
        chatClose.addEventListener('click', toggleChat);
        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Functions
        function handleFileSelect(e) {
            const file = e.target.files[0];
            if (file && file.type.match('image.*')) {
                displayPreview(file);
            }
        }
        
        function handleDragOver(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.style.borderColor = var('--primary');
            uploadArea.style.backgroundColor = 'rgba(0, 102, 204, 0.05)';
        }
        
        function handleFileDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.style.borderColor = '';
            uploadArea.style.backgroundColor = '';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.match('image.*')) {
                fileInput.files = e.dataTransfer.files;
                displayPreview(file);
            }
        }
        
        function displayPreview(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                imagePreview.style.display = 'block';
                analyzeButton.disabled = false;
            };
            reader.readAsDataURL(file);
        }
        
        function analyzeImage() {
            // Show loading animation
            loadingAnimation.style.display = 'flex';
            
            // Simulate API call delay
            setTimeout(() => {
                // Hide loading animation
                loadingAnimation.style.display = 'none';
                
                // Display random result from dummy data
                const randomIndex = Math.floor(Math.random() * dummyConditions.length);
                displayResults(dummyConditions[randomIndex]);
            }, 2000);
        }
        
        function displayResults(condition) {
            // Update condition description
            conditionDesc.textContent = condition.description;
            
            // Update confidence bar
            confidenceFill.style.width = `${condition.confidence}%`;
            confidencePercent.textContent = `${condition.confidence}%`;
            
            // Clear previous treatments
            treatmentsContainer.innerHTML = '';
            
            // Add treatments
            condition.treatments.forEach(treatment => {
                const treatmentElement = document.createElement('div');
                treatmentElement.className = 'treatment-item';
                
                const nameElement = document.createElement('div');
                nameElement.className = 'treatment-name';
                nameElement.textContent = treatment.name;
                
                if (treatment.recommended) {
                    const badge = document.createElement('span');
                    badge.className = 'treatment-badge';
                    badge.textContent = 'Recommended';
                    nameElement.appendChild(badge);
                }
                
                const descElement = document.createElement('div');
                descElement.className = 'treatment-desc';
                descElement.textContent = treatment.description;
                
                const outcomeElement = document.createElement('div');
                outcomeElement.className = 'treatment-outcome';
                
                const icon = document.createElement('i');
                icon.className = 'fas fa-check-circle';
                outcomeElement.appendChild(icon);
                
                const outcomeText = document.createTextNode(treatment.outcome);
                outcomeElement.appendChild(outcomeText);
                
                treatmentElement.appendChild(nameElement);
                treatmentElement.appendChild(descElement);
                treatmentElement.appendChild(outcomeElement);
                
                treatmentsContainer.appendChild(treatmentElement);
            });
        }
        
        function toggleChat() {
            if (chatContainer.style.display === 'flex') {
                chatContainer.style.display = 'none';
            } else {
                chatContainer.style.display = 'flex';
            }
        }
        
        function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;
            
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                const responses = [
                    "Based on the X-ray analysis, I recommend scheduling a follow-up appointment to discuss treatment options in more detail.",
                    "The AI analysis suggests a composite filling would be the most suitable treatment for this cavity. Would you like more information about this procedure?",
                    "I've checked our system and found that this patient has a history of sensitivity to certain dental materials. Would you like me to suggest alternatives?",
                    "The scan shows signs of potential early-stage periodontitis. I recommend additional diagnostic tests to confirm.",
                    "According to our evidence-based protocols, the treatment plan with the highest success rate for this condition would be root canal therapy followed by a crown."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage(randomResponse, 'ai');
            }, 1000);
        }
        
        function addMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}-message`;
            messageDiv.textContent = text;
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'message-time';
            
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            
            timeSpan.textContent = `${formattedHours}:${formattedMinutes} ${ampm}`;
            messageDiv.appendChild(timeSpan);
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Add event listeners for nav items and patient cards
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelector('.nav-item.active').classList.remove('active');
                this.classList.add('active');
            });
        });
        
        document.querySelectorAll('.patient-card').forEach(card => {
            card.addEventListener('click', function() {
                document.querySelector('.patient-card.active').classList.remove('active');
                this.classList.add('active');
            });
        });
        
        // AI chatbot responses for dental queries
        const dentalResponses = {
            keywords: {
                "pain": [
                    "Based on your description of pain, it could be related to several conditions. Could you specify which tooth is causing discomfort?",
                    "Pain can indicate various issues from sensitivity to infection. Would you like me to analyze this patient's previous records for similar symptoms?"
                ],
                "xray": [
                    "The uploaded X-ray shows potential signs of enamel erosion on teeth #18-20. Would you like me to recommend preventive treatments?",
                    "I've analyzed the X-ray and detected a possible periapical radiolucency around tooth #30. Consider additional diagnostic imaging for confirmation."
                ],
                "treatment": [
                    "Based on the patient's history and current condition, a minimally invasive approach would be optimal. Would you like to see evidence-based success rates?",
                    "I've compared several treatment options using our clinical database. For this case, the composite restoration shows the highest long-term success rate."
                ],
                "insurance": [
                    "Based on this patient's insurance plan, the proposed treatment should have approximately 80% coverage. Would you like me to generate a cost estimate?",
                    "I've checked the insurance database. This procedure is covered, but a pre-authorization might be required. Would you like me to prepare the documentation?"
                ]
            },
            
            getResponse: function(message) {
                // Default responses if no keywords match
                const defaultResponses = [
                    "I've analyzed the patient data and can provide evidence-based treatment recommendations. What specific aspect would you like to discuss?",
                    "Based on similar cases in our database, there are several approaches to consider. Would you like me to rank them by success rate?",
                    "I can help interpret these results in context with the patient's medical history. Would you like me to highlight any relevant interactions or contraindications?"
                ];
                
                // Check for keyword matches
                for (const keyword in this.keywords) {
                    if (message.toLowerCase().includes(keyword)) {
                        const responses = this.keywords[keyword];
                        return responses[Math.floor(Math.random() * responses.length)];
                    }
                }
                
                // If no keywords match, return a default response
                return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
            }
        };
        
        // Override the sendMessage function to use the dental responses
        function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;
            
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Get AI response based on dental context
            setTimeout(() => {
                const aiResponse = dentalResponses.getResponse(message);
                addMessage(aiResponse, 'ai');
            }, 1000);
        }