let whitelistUrl = "https://default.com/whitelist.txt";  // Default URL if not configured
let supportEmail = "support@example.com";  // Default email if not configured
let requestButtonTitle = "Request to unlock";  // Default title if not configured
let emailSubject = "Request to unlock password field";  // Default subject if not configured
let emailBodyTemplate = "Dear Admin,\n\nI would like to request unlocking the password field on the website: ${url}.\n\nThank you!";  // Default body template
let whitelist = [];

// A flag to indicate if the configuration has finished loading
let configLoaded = false;

// Fetch configuration from config.json
async function loadConfig() {
  try {
    const response = await fetch('Data/config.json');  // Corrected the path to config.json
    const config = await response.json();

    // Use values from config if available
    whitelistUrl = config.whitelistUrl || whitelistUrl;
    supportEmail = config.supportEmail || supportEmail;
    requestButtonTitle = config.requestButtonTitle || requestButtonTitle;
    emailSubject = config.emailSubject || emailSubject;
    emailBodyTemplate = config.emailBody || emailBodyTemplate;

    console.log("Using whitelist URL:", whitelistUrl);
    console.log("Using support email:", supportEmail);
    console.log("Using request button title:", requestButtonTitle);
    console.log("Using email subject:", emailSubject);
    console.log("Using email body:", emailBodyTemplate);

    configLoaded = true;  // Mark config as loaded
    loadWhitelist();  // Load the whitelist after fetching config
  } catch (error) {
    console.error("Error loading config:", error);
  }
}

// Load the whitelist
async function loadWhitelist() {
  try {
    if (!configLoaded) {
      console.log("Config not loaded yet.");
      return; // Don't proceed with loading the whitelist if config is not loaded
    }
    
    console.log("Loading whitelist from:", whitelistUrl);
    const response = await fetch(whitelistUrl);
    const text = await response.text();
    console.log("Whitelist content:", text);
    whitelist = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
    console.log("Parsed whitelist:", whitelist);
  } catch (error) {
    console.error("Error loading whitelist:", error);
  }
}

// Listen for messages from content scripts to check if a domain is whitelisted or get support email
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "isWhitelisted") {
    const isWhitelisted = whitelist.includes(message.domain);
    console.log(`Checking if ${message.domain} is whitelisted:`, isWhitelisted);
    sendResponse({ isWhitelisted });
  } else if (message.action === "getSupportEmail") {
    // Use the message domain URL to populate the email body
    const emailBody = emailBodyTemplate.replace('${url}', message.url || window.location.href);
    
    if (configLoaded) {
      sendResponse({
        supportEmail,
        requestButtonTitle,
        emailSubject,
        emailBody
      });
    } else {
      sendResponse({
        supportEmail: "support@example.com",  // Fallback if config is not loaded
        requestButtonTitle,
        emailSubject,
        emailBody
      });
    }
  }
});

// Load the config on startup
loadConfig();
