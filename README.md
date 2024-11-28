# PassfieldGuard

A Google Chrome browser extension that blocks all password fields unless the URL is whitelisted. This will prevent your end-users from filling in passwords when unknowingly visiting a phishing web page or when receiving an HTML page as an attachment in their email.

## Introduction

How many passwords do you need to fill in on a weekly basis on your corporate laptop? Generally, end-users are required to enter only a few passwords each week. By manually whitelisting these URLs, you can ensure that no passwords are leaked through phishing attempts. Most companies use Microsoft SSO, where there is minimal need to enter passwords frequently.

PassfieldGuard locks all password fields on webpages unless the URL is specifically whitelisted. This extension is ideal for larger organizations where browser settings are enforced.

## Features

- Blocks all password fields unless the URL is added to a whitelist.
- Open-source and free to use.

## Current limitations

- Not yet listed in the Chrome Web Store.
- Manual changes in the code are required to be made before the extension can be used properly.

## Installation (Developer Mode, for use on single machine)

1. Clone the repository to your local machine.
2. If required, change whitelisturl in `DATA/config.json`, or manually add whitelist URLs in the `DATA/whitelist.txt` file.
3. Change the support email address in `DATA/config.json', which will be used for end-users to request URL whitelisting.
4. If wanted, change the other values in `DATA/config.json'
5. Open the `chrome://extensions/` page in your Chrome browser.
6. Enable "Developer mode" in the top right corner.
7. Click on "Load unpacked" and select the `extension/` directory from the cloned repository.
8. The extension should now be installed and active in your browser.

## Enterprise Installation (Distribution via .crx file)

If you want to distribute PassfieldGuard within your enterprise or organization without publishing it on the Chrome Web Store, follow the steps below to create a `.crx` file and deploy it internally.

### 1. Modify the Extension for Enterprise Use

Before packaging the extension for distribution, you may need to modify certain settings for your enterprise deployment:
- **Whitelist URLs**: You can predefine the URLs that should be allowed to fill in passwords by modifying the `DATA/whitelist.txt` file or point to a public whitelist in `DATA/config.json` with the appropriate URLs.
- **Support Email**: Update the `DATA/config.json` file to include a support email address for end-users to request URL whitelisting.
- Other options defined in DATA/config.json can also be modified.

### 2. Create a .crx File

Once your extension is customized and ready for internal use:
1. **Prepare the Extension Files**: Ensure all necessary files (`manifest.json`, `background.js`, `config.json`, etc.) are in place in the extension's folder.
2. **Pack the Extension**:
   - Open **Google Chrome**.
   - Go to the **Extensions** page (`chrome://extensions/`).
   - Enable **Developer Mode** in the top-right corner.
   - Click on **Pack extension** and select the extension's root directory.
   - Chrome will generate a `.crx` file and a `.pem` key file (store the `.pem` file securely if you need to update the extension later).

3. **Distribute the .crx File**:
   - Host the `.crx` file on an internal server, file share, or cloud storage that your users can access.
   - Provide users with a link to download the `.crx` file and install it manually, or deploy the `.crx` using **Group Policy** (if using Windows) or **Google Admin Console** (for Chrome OS).

### 3. Install the .crx File Manually

For individual users or small-scale deployment:
1. Download the `.crx` file.
2. Open **chrome://extensions/** in the Chrome browser.
3. Drag the `.crx` file into the extensions page to install it manually.

### 4. Deploy the Extension Using Group Policy (For Enterprise-Wide Deployment)

For larger organizations, use **Group Policy** (for Windows) to install the extension across multiple machines. Here's how:

1. **Prepare the .crx File**: Ensure the `.crx` file is hosted on a network share or a location accessible to all users.
2. **Configure Group Policy**:
   - Download and install **Chrome ADMX templates**.
   - Set up a Group Policy Object (GPO) for Chrome to automatically install the extension by specifying the `.crx` file location in the **ExtensionInstallForcelist** policy.
   
   Example configuration in GPO:

ExtensionInstallForcelist = https://yourserver.com/path/to/extension.crx

3. **Apply the GPO**: Link the GPO to the relevant organizational units (OUs) in your Active Directory environment, and the extension will be automatically installed on all target machines.

## Usage

Once the extension is loaded and active, all password fields will be blocked and will show a red border. There is also a button available that will open your default email client to send a request to your IT support team.

## Default whitelist.txt

The default `whitelist.txt` is located in `DATA/whitelist.txt`. It contains `login.microsoftonline.com` and `example.com` by default.

## Overview

PassfieldGuard is designed to enhance security in large organizations by preventing unauthorized access to password fields. By using a whitelist approach, it minimizes the risk of phishing attacks and ensures that only trusted URLs can request password input.

For more information, visit our GitHub repository.

## Contributing

We welcome contributions from the community. If you have suggestions for improvements or have found a bug, please open an issue or submit a pull request.
