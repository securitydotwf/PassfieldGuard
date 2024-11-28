let whitelistUrl = "https://default.com/whitelist.txt";  // Default URL if not configured
let whitelist = [];

// A flag to indicate if the configuration has finished loading
let configLoaded = false;

// Fetch configuration from config.json
async function loadConfig() {
  try {
    const response = await fetch('Data/config.json');
    const config = await response.json();

    whitelistUrl = config.whitelistUrl || whitelistUrl;
    configLoaded = true;

    // Load whitelist after fetching the config
    loadWhitelist();
  } catch (error) {
    console.error("Error loading config:", error);
  }
}

// Load the whitelist from both the remote URL and the local file
async function loadWhitelist() {
  try {
    const whitelistFromUrl = fetchWhitelistFromUrl();
    const whitelistFromFile = fetchWhitelistFromFile();

    // Wait for both fetch operations to complete
    const [urlWhitelist, fileWhitelist] = await Promise.all([whitelistFromUrl, whitelistFromFile]);

    // Merge both lists, URL list takes priority in case of duplicates
    whitelist = [...new Set([...urlWhitelist, ...fileWhitelist])];
    console.log("Merged whitelist:", whitelist);
  } catch (error) {
    console.error("Error loading whitelist:", error);
  }
}

// Fetch whitelist from the URL defined in config.json
async function fetchWhitelistFromUrl() {
  try {
    const response = await fetch(whitelistUrl);
    const text = await response.text();
    return text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  } catch (error) {
    console.error("Error fetching whitelist from URL:", error);
    return [];  // Return an empty array if there is an error
  }
}

// Fetch the whitelist from the local data/whitelist.txt file
async function fetchWhitelistFromFile() {
  try {
    const response = await fetch('data/whitelist.txt');
    const text = await response.text();
    return text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  } catch (error) {
    console.error("Error fetching local whitelist file:", error);
    return [];  // Return an empty array if there is an error
  }
}

// Listen for messages from content scripts to check if a domain is whitelisted
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "isWhitelisted") {
    const isWhitelisted = whitelist.includes(message.domain);
    console.log(`Checking if ${message.domain} is whitelisted:`, isWhitelisted);
    sendResponse({ isWhitelisted });
  } else if (message.action === "getSupportEmail") {
    sendResponse({ supportEmail, requestButtonTitle, emailSubject, emailBody });
  }
});

// Load the config on startup
loadConfig();
