// Debounce function to limit the frequency of function calls
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const currentDomain = window.location.hostname;
console.log("Current domain:", currentDomain);

// Send a message to the background script to check if the domain is whitelisted
chrome.runtime.sendMessage({ action: "isWhitelisted", domain: currentDomain }, (response) => {
  if (response && response.isWhitelisted === false) {
    console.log(`${currentDomain} is not whitelisted. Blocking password fields.`);

    try {
      blockPasswordFields(document);

      // Also check for password fields in dynamically loaded content (e.g., login forms)
      const loginFormSelector = 'form, .login, .auth, .sign-in'; // Adjust as needed for your use case
      const loginForms = document.querySelectorAll(loginFormSelector);

      loginForms.forEach((form) => {
        const observer = new MutationObserver(debounce(() => {
          blockPasswordFields(form);
        }, 300));

        observer.observe(form, {
          childList: true,
          subtree: true,
        });
      });

      // Handle password fields inside iframes (if any)
      document.querySelectorAll("iframe").forEach((iframe) => {
        try {
          const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
          if (iframeDocument) {
            const iframeObserver = new MutationObserver(debounce(() => {
              blockPasswordFields(iframeDocument);
            }, 300));

            iframeObserver.observe(iframeDocument.body, {
              childList: true,
              subtree: true,
            });
          }
        } catch (error) {
          console.error("Error accessing iframe content:", error);
        }
      });
    } catch (error) {
      console.error("Error blocking password fields:", error);
    }
  } else {
    console.log(`${currentDomain} is whitelisted. Password fields should not be blocked.`);
  }
});

function blockPasswordFields(doc) {
  const passwordFields = doc.querySelectorAll('input[type="password"]');
  passwordFields.forEach((field) => {
    // If the field is inside a critical form, don't block it
    if (field.closest('form') && field.closest('form').querySelector('.login, .auth, .sign-in')) {
      return;
    }

    // Check if the button already exists
    if (!field.nextSibling || !field.nextSibling.classList || !field.nextSibling.classList.contains('request-unlock-button')) {
      field.style.border = "2px solid red";
      field.style.boxShadow = "0 0 5px 2px rgba(255, 0, 0, 0.7)";
      blockFieldInteractions(field);
      field.setAttribute("autocomplete", "new-password"); // Prevent autofill
      field.setAttribute("tabindex", "-1"); // Prevent focus
      field.style.pointerEvents = "none"; // Disable clicking

      const requestButton = createRequestButton();
      field.parentNode.insertBefore(requestButton, field.nextSibling);
    }
  });
}

function blockFieldInteractions(field) {
  // Prevent typing, pasting, dragging, etc.
  field.addEventListener("keydown", (event) => event.preventDefault());
  field.addEventListener("keypress", (event) => event.preventDefault());
  field.addEventListener("input", (event) => event.preventDefault());
  field.addEventListener("paste", (event) => event.preventDefault());
  field.addEventListener("dragover", (event) => event.preventDefault());
  field.addEventListener("drop", (event) => event.preventDefault());
  field.addEventListener("contextmenu", (event) => event.preventDefault());
}

function createRequestButton() {
  const requestButton = document.createElement("button");
  requestButton.classList.add('request-unlock-button');
  requestButton.style.padding = "5px";
  requestButton.style.backgroundColor = "#FF0000";
  requestButton.style.color = "white";
  requestButton.style.border = "none";
  requestButton.style.borderRadius = "5px";
  requestButton.style.cursor = "pointer";
  requestButton.style.fontSize = "12px";
  requestButton.style.marginLeft = "10px";
  requestButton.style.height = "100%";
  requestButton.style.verticalAlign = "middle";

  requestButton.textContent = "Request Unlock";  // Ensure button text is set

  chrome.runtime.sendMessage({ action: "getSupportEmail" }, (response) => {
    const supportEmail = response && response.supportEmail ? response.supportEmail : "support@example.com";
    const requestButtonTitle = response && response.requestButtonTitle ? response.requestButtonTitle : "Request to unlock";
    const emailSubject = response && response.emailSubject ? response.emailSubject : "Request to unlock password field";
    const emailBody = response && response.emailBody ? response.emailBody : `Dear Admin,\n\nI would like to request unlocking the password field on the website: ${window.location.href}.\n\nThank you!`;
    const hoverText = response && response.hoverText ? response.hoverText : "Click to request unlocking this password field. Your request will be reviewed by the IT security team.";

    requestButton.title = hoverText;
    requestButton.textContent = requestButtonTitle;

    const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody + "\n\n" + window.location.href)}`;

    requestButton.addEventListener("click", () => {
      window.location.href = mailtoLink;
    });
  });

  return requestButton;
}
