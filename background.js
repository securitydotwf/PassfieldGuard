let whitelistUrl2 = "https://default.com/whitelist.txt";  // Default URL if not configured
let supportEmail = "support@example.com";  // Default email if not configured
let requestButtonTitle = "Request to unlock";  // Default title if not configured
let emailSubject = "Request to unlock password field";  // Default subject if not configured
let emailBody = "Dear Admin,\n\nI would like to request unlocking the password field on the website: ${window.location.href}.\n\nThank you!";  // Default body if not configured
let whitelist = [];
let lastModified = null;  // Variable to store the last modified date

// A flag to indicate if the configuration has finished loading
let configLoaded = false;

// Fetch configuration from config.json
async function loadConfig() {
  try {
    const response = await fetch(chrome.runtime.getURL('DATA/config.json'));  // Corrected the path to config.json
    const config = await response.json();

    // Use values from config if available
    let whitelistUrl = config.whitelistUrl || whitelistUrl2;
    supportEmail = config.supportEmail || supportEmail;
    requestButtonTitle = config.requestButtonTitle || requestButtonTitle;
    emailSubject = config.emailSubject || emailSubject;
    emailBody = config.emailBody || emailBody;

    console.log("Using whitelist URL:", whitelistUrl);
    console.log("Using support email:", supportEmail);
    console.log("Using request button title:", requestButtonTitle);
    console.log("Using email subject:", emailSubject);
    console.log("Using email body:", emailBody);

    configLoaded = true;  // Mark config as loaded
    await checkWhitelistUpdate(whitelistUrl);  // Check for whitelist update after fetching config

    // Start periodic update check
    setInterval(() => checkWhitelistUpdate(whitelistUrl), 60000);  // Check for updates every 1 minute
  } catch (error) {
    console.error("Error loading config:", error);
    await checkWhitelistUpdate(whitelistUrl2);  // Fallback to default URL if config loading fails

    // Start periodic update check with fallback URL
    setInterval(() => checkWhitelistUpdate(whitelistUrl2), 60000);  // Check for updates every 1 minute
  }
}

// Check if the whitelist file has been updated
async function checkWhitelistUpdate(whitelistUrl) {
  try {
    if (!configLoaded) {
      console.log("Config not loaded yet.");
      return; // Don't proceed with checking the whitelist if config is not loaded
    }

    const response = await fetch(whitelistUrl, { method: 'HEAD' });
    const newLastModified = response.headers.get('Last-Modified');

    if (newLastModified && new Date(newLastModified) > new Date(lastModified)) {
      console.log("Whitelist file has been updated. Fetching new content.");
      lastModified = newLastModified;
      await loadWhitelist(whitelistUrl);
    } else {
      console.log("Whitelist file has not been updated.");
    }
  } catch (error) {
    console.error("Error checking whitelist update:", error);
  }
}

// Load the whitelist
async function loadWhitelist(whitelistUrl) {
  try {
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
    console.log("Received domain check request for:", message.domain);
    console.log("Current whitelist:", whitelist);  // Log the current whitelist for debugging
    const isWhitelisted = whitelist.includes(message.domain);
    console.log(`Checking if ${message.domain} is whitelisted:`, isWhitelisted);
    sendResponse({ isWhitelisted });
  } else if (message.action === "getSupportEmail") {
    if (configLoaded) {
      sendResponse({ supportEmail, requestButtonTitle, emailSubject, emailBody });
    } else {
      sendResponse({ supportEmail: "support@example.com", requestButtonTitle, emailSubject, emailBody });  // Fallback if config is not loaded
    }
  }
});

// Load the config on startup
loadConfig();