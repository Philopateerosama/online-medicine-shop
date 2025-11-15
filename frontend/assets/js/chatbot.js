document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const chatWidget = document.getElementById('chatWidget');
  const chatToggle = document.getElementById('chatToggle');
  const closeChat = document.getElementById('closeChat');
  const chatMessages = document.getElementById('chatMessages');
  const chatQuestions = document.getElementById('chatQuestions');
  
  // Chatbot Q&A data
  const qaData = [
    {
      question: "How can I track my order?",
      answer: "You can track your order by going to the 'My Orders' page and clicking the 'Track' button next to your active order."
    },
    {
      question: "What are the delivery fees?",
      answer: "Delivery is free for orders over 500 EGP. For orders under 500 EGP, a flat fee of 50 EGP applies."
    },
    {
      question: "Do you accept credit cards?",
      answer: "Yes, we accept Visa, Mastercard, and Cash on Delivery."
    },
    {
      question: "How do I return a product?",
      answer: "You can return products within 14 days if the package is sealed. Please contact support for assistance."
    },
    {
      question: "I forgot my password.",
      answer: "Please go to the Login page and click on 'Forgot Password' to receive a reset link via email."
    },
    {
      question: "Connect with a Doctor",
      answer: "Sorry, there are no doctors available at the moment. Please try again later."
    }
  ];

  // Toggle chat widget visibility
  function toggleChat() {
    chatWidget.classList.toggle('visible');
    if (chatWidget.classList.contains('visible')) {
      // Load questions when chat is opened
      loadQuestions();
    }
  }

  // Load question buttons
  function loadQuestions() {
    chatQuestions.innerHTML = ''; // Clear existing questions
    
    qaData.forEach(item => {
      const button = document.createElement('button');
      button.className = 'question-btn';
      button.textContent = item.question;
      button.addEventListener('click', () => handleQuestionClick(item));
      chatQuestions.appendChild(button);
    });
  }

  // Handle question click
  function handleQuestionClick(item) {
    // Add user question to chat
    addMessage(item.question, 'user');
    
    // Add bot response after a short delay
    setTimeout(() => {
      addMessage(item.answer, 'bot');
      // Scroll to bottom of chat
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
  }

  // Add a message to the chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom of chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Event Listeners
  chatToggle.addEventListener('click', toggleChat);
  closeChat.addEventListener('click', toggleChat);

  // Close chat when clicking outside
  document.addEventListener('click', (e) => {
    if (!chatWidget.contains(e.target) && e.target !== chatToggle) {
      chatWidget.classList.remove('visible');
    }
  });

  // Add initial welcome message if chat is empty
  if (chatMessages.children.length <= 1) { // 1 for the initial welcome message
    addMessage("Hello! I'm here to help. Please select a question:", 'bot');
  }
});
