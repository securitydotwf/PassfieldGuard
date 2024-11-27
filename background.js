let whitelistUrl = "https://defaulturl.com/whitelist.txt";  // Default URL if not configured
let supportEmail = "support@example.com";  // Default email if not configured
let whitelist = [];

// A flag to indicate if the configuration has finished loading
let configLoaded = false;

// Fetch configuration from the server
async function loadConfig() {
  try {
    const response = await fetch("https://locationofjsonconfig.com/config.json");
    const config = await response.json();

    // Use values from config if available
    whitelistUrl = config.whitelistUrl || whitelistUrl;
    supportEmail = config.supportEmail || supportEmail;

    console.log("Using whitelist URL:", whitelistUrl);
    console.log("Using support email:", supportEmail);

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
    if (configLoaded) {
      sendResponse({ supportEmail });
    } else {
      sendResponse({ supportEmail: "support@example.com" });  // Fallback if config is not loaded
    }
  }
});

// Load the config on startup
loadConfig();
