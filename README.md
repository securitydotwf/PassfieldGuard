# PassfieldGuard
A Google Chrome browser extension that blocks all password fields unless the URL is whitelisted.

## Introduction
How many passwords do you need to fill in on a weekly basis on your corporate laptop? Generally, end-users are required to enter only a few passwords each week. By manually whitelisting these URLs, you can ensure that no passwords are leaked through phishing attempts. Most companies use Microsoft SSO, where there is minimal need to enter passwords frequently.

PassfieldGuard locks all password fields on webpages unless the URL is specifically whitelisted. This extension is ideal for larger organizations where browser settings are enforced.

## Features
- Blocks all password fields unless the URL is added to a whitelist.
- Open-source and free to use.
- Not yet listed in the Chrome Web Store.

## Installation (Developer Mode)
1. Clone the repository to your local machine.
2. If required, change URLs to whitelist in `background.js` and `config.json`, or manually add whitelist URLs in the `DATA/whitelist.txt` file.
3. Change the support email address, which will be used for end-users to request URL whitelisting.
4. Open the `chrome://extensions/` page in your Chrome browser.
5. Enable "Developer mode" in the top right corner.
6. Click on "Load unpacked" and select the `extension/` directory from the cloned repository.
7. The extension should now be installed and active in your browser.

## Usage
Once the extension is loaded and active, all password fields will be blocked and will show a red border. There is also a button available that will open your default email client to send a request to your IT support team.

## Overview
PassfieldGuard is designed to enhance security in large organizations by preventing unauthorized access to password fields. By using a whitelist approach, it minimizes the risk of phishing attacks and ensures that only trusted URLs can request password input.

For more information, visit our GitHub repository.

## Contributing
We welcome contributions from the community. If you have suggestions for improvements or have found a bug, please open an issue or submit a pull request.
