
  // =================================================
  // AI PORTFOLIO ASSISTANT
  // =================================================

  // const AI_BACKEND_URL = "http://localhost:5001/api/chat";
  const AI_BACKEND_URL = "https://mjapps.work.gd/ai/api/chat";

  const aiChatTrigger = document.getElementById("aiChatTrigger");
  const aiChatWindow = document.getElementById("aiChatWindow");
  const aiChatClose = document.getElementById("aiChatClose");
  const aiChatMessages = document.getElementById("aiChatMessages");
  const aiChatForm = document.getElementById("aiChatForm");
  const aiChatInput = document.getElementById("aiChatInput");
  const aiChatSend = document.querySelector(".ai-chat-send");
  const aiChatSuggestions = document.querySelectorAll(".ai-chat-suggestion");


  // =================================================
  // OPEN CHAT
  // =================================================

  function openAIChat() {
    aiChatWindow.classList.add("is-open");

    aiChatWindow.setAttribute("aria-hidden", "false");
    aiChatTrigger.setAttribute("aria-expanded", "true");

    setTimeout(() => {
      aiChatInput.focus();
    }, 100);
  }


  // =================================================
  // CLOSE CHAT
  // =================================================

  function closeAIChat() {
    aiChatWindow.classList.remove("is-open");

    aiChatWindow.setAttribute("aria-hidden", "true");
    aiChatTrigger.setAttribute("aria-expanded", "false");

    aiChatTrigger.focus();
  }


  // =================================================
  // TOGGLE CHAT
  // =================================================

  aiChatTrigger.addEventListener("click", () => {
    const isOpen = aiChatWindow.classList.contains("is-open");

    if (isOpen) {
      closeAIChat();
    } else {
      openAIChat();
    }
  });


  // =================================================
  // CLOSE BUTTON
  // =================================================

  aiChatClose.addEventListener("click", () => {
    closeAIChat();
  });


  // =================================================
  // ADD MESSAGE TO CHAT
  // =================================================

  function addMessage(message, sender) {
    const messageWrapper = document.createElement("div");

    messageWrapper.classList.add(
      "ai-chat-message",
      sender === "user"
        ? "ai-chat-message-user"
        : "ai-chat-message-ai"
    );

    if (sender === "ai") {
      messageWrapper.innerHTML = `
        <div class="ai-chat-message-label">Mehul's AI</div>
        <div class="ai-chat-message-content"></div>
      `;

      messageWrapper.querySelector(
        ".ai-chat-message-content"
      ).textContent = message;
    } else {
      messageWrapper.innerHTML = `
        <div class="ai-chat-message-content"></div>
      `;

      messageWrapper.querySelector(
        ".ai-chat-message-content"
      ).textContent = message;
    }

    aiChatMessages.appendChild(messageWrapper);

    scrollChatToBottom();
  }


  // =================================================
  // LOADING MESSAGE
  // =================================================

  function showLoadingMessage() {
    const loadingMessage = document.createElement("div");

    loadingMessage.classList.add(
      "ai-chat-message",
      "ai-chat-message-ai",
      "ai-chat-loading"
    );

    loadingMessage.id = "aiChatLoading";

    loadingMessage.innerHTML = `
      <div class="ai-chat-message-label">Mehul's AI</div>
      <div class="ai-chat-message-content">
        <span>Thinking</span>
        <span class="ai-chat-loading-dots">...</span>
      </div>
    `;

    aiChatMessages.appendChild(loadingMessage);

    scrollChatToBottom();
  }


  // =================================================
  // REMOVE LOADING MESSAGE
  // =================================================

  function removeLoadingMessage() {
    const loadingMessage = document.getElementById("aiChatLoading");

    if (loadingMessage) {
      loadingMessage.remove();
    }
  }


  // =================================================
  // SCROLL CHAT TO BOTTOM
  // =================================================

  function scrollChatToBottom() {
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }


  // =================================================
  // SEND MESSAGE TO BACKEND
  // =================================================

  async function sendMessage(message) {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    // Add user's message to UI
    addMessage(trimmedMessage, "user");

    // Clear input
    aiChatInput.value = "";

    // Disable input while processing
    aiChatInput.disabled = true;
    aiChatSend.disabled = true;

    // Show loading state
    showLoadingMessage();

    try {
      const response = await fetch(AI_BACKEND_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message: trimmedMessage
        })
      });

      const data = await response.json();

      removeLoadingMessage();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to process your request"
        );
      }

      // Add AI response
      addMessage(data.reply, "ai");

    } catch (error) {
      console.error("AI Chat Error:", error);

      removeLoadingMessage();

      addMessage(
        "Sorry, I couldn't connect to the AI assistant right now. Please try again.",
        "ai"
      );
    } finally {
      // Re-enable input
      aiChatInput.disabled = false;
      aiChatSend.disabled = false;

      aiChatInput.focus();
    }
  }


  // =================================================
  // CHAT FORM SUBMIT
  // =================================================

  aiChatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = aiChatInput.value;

    sendMessage(message);
  });


  // =================================================
  // SUGGESTION BUTTONS
  // =================================================

  aiChatSuggestions.forEach((button) => {
    button.addEventListener("click", () => {
      const question = button.dataset.question;

      if (!question) {
        return;
      }

      sendMessage(question);
    });
  });


  // =================================================
  // ENTER KEY
  // =================================================

  aiChatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      aiChatForm.requestSubmit();
    }
  });


  // =================================================
  // ESCAPE KEY
  // =================================================

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (aiChatWindow.classList.contains("is-open")) {
        closeAIChat();
      }
    }
  });
