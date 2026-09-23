(function () {
  if (document.getElementById('bs-chatbot-container')) return;

  const chatbotHTML = `
    <div id="bs-chatbot-btn" title="Chat with us">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <div id="bs-chatbot-window">
      <div id="bs-chatbot-header">
        <div class="bs-chat-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>BookStore Assistant</span>
        </div>
        <button id="bs-chatbot-close" aria-label="Close chat">✕</button>
      </div>
      <div id="bs-chatbot-messages">
        <div class="bs-msg bs-bot">
          <div class="bs-bubble">👋 Hi! I'm your BookStore assistant. I can help you find books, answer questions about genres, orders, or anything else. What can I help you with?</div>
        </div>
      </div>
      <div id="bs-chatbot-input-area">
        <input type="text" id="bs-chatbot-input" placeholder="Ask me anything..." autocomplete="off" />
        <button id="bs-chatbot-send" aria-label="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.id = 'bs-chatbot-container';
  container.innerHTML = chatbotHTML;
  document.body.appendChild(container);

  const btn = document.getElementById('bs-chatbot-btn');
  const win = document.getElementById('bs-chatbot-window');
  const closeBtn = document.getElementById('bs-chatbot-close');
  const messagesEl = document.getElementById('bs-chatbot-messages');
  const input = document.getElementById('bs-chatbot-input');
  const sendBtn = document.getElementById('bs-chatbot-send');

  let isOpen = false;
  let isLoading = false;
  let conversationHistory = [];

  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    win.classList.toggle('bs-open', isOpen);
    btn.classList.toggle('bs-active', isOpen);
    if (isOpen) setTimeout(() => input.focus(), 300);
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    win.classList.remove('bs-open');
    btn.classList.remove('bs-active');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  sendBtn.addEventListener('click', sendMessage);

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `bs-msg bs-${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'bs-bubble';
    bubble.textContent = text;
    div.appendChild(bubble);
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function addTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'bs-msg bs-bot bs-typing-wrapper';
    div.id = 'bs-typing';
    div.innerHTML = `<div class="bs-bubble bs-typing"><span></span><span></span><span></span></div>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTypingIndicator() {
    const t = document.getElementById('bs-typing');
    if (t) t.remove();
  }

  function getLocalBotResponse(userText) {
    const normalized = userText.trim().toLowerCase();
    if (/\b(hi|hello|hey|greetings)\b/.test(normalized)) {
      return 'Hello! I am your BookStore assistant. Ask me about books, genres, or orders.';
    }
    if (/\b(recommend|suggest|best book|looking for)\b/.test(normalized)) {
      return 'I can recommend books across genres like Comedy, Horror, Thriller, Adventure, Action, and Fantasy. What type of story do you want?';
    }
    if (/\b(genre|comedy|horror|thriller|action|adventure|fantasy)\b/.test(normalized)) {
      return 'We have lots of books in those genres. Try a question like “Recommend a thriller” or “What are some good fantasy books?”';
    }
    if (/\b(order|shipping|payment|return|refund|support)\b/.test(normalized)) {
      return 'For order, shipping, or return questions, I can help with general bookstore guidance. Please provide a few details so I can assist you better.';
    }
    return 'I am here to help with bookstore questions. Try asking for book recommendations, genres, or support information.';
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    input.value = '';
    addMessage(text, 'user');
    conversationHistory.push({ role: 'user', content: text });

    isLoading = true;
    sendBtn.disabled = true;
    input.disabled = true;
    addTypingIndicator();

    try {
      const apiKey = localStorage.getItem('anthropic_api_key') || '';
      if (!apiKey) {
        const reply = getLocalBotResponse(text);
        removeTypingIndicator();
        addMessage(reply, 'bot');
        conversationHistory.push({ role: 'assistant', content: reply });
        isLoading = false;
        sendBtn.disabled = false;
        input.disabled = false;
        input.focus();
        return;
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a friendly and knowledgeable assistant for BookStore, an online bookstore. 
You help customers find books, answer questions about genres (Comedy, Horror, Thriller, Action, Adventure, Fantasy), 
discuss book recommendations, explain store policies, help with orders, and answer general book-related questions.
Keep answers concise and helpful. Use a warm, enthusiastic tone. 
If asked about specific inventory or prices, mention that users can browse the website or contact support.`,
          messages: conversationHistory
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API Error');
      }
      
      const reply = data.content && data.content[0] ? data.content[0].text : 'Sorry, I could not get a response. Please try again.';

      removeTypingIndicator();
      addMessage(reply, 'bot');
      conversationHistory.push({ role: 'assistant', content: reply });

    } catch (err) {
      removeTypingIndicator();
      const errorMsg = err.message.includes('401') || err.message.includes('API Error') 
        ? 'API key not configured. Please add your Anthropic API key to proceed.' 
        : 'Sorry, something went wrong. Please check your connection and try again.';
      addMessage(errorMsg, 'bot');
    }

    isLoading = false;
    sendBtn.disabled = false;
    input.disabled = false;
    input.focus();
  }
})();
