# CarbonNudge - Email Carbon Checker

CarbonNudge is a web application designed to help users estimate the carbon footprint of their email communications. By analyzing email content, recipient count, and attachment size, CarbonNudge provides actionable insights to reduce digital carbon emissions.

## Features

- **Carbon Footprint Calculation**: Estimate the carbon emissions of your email based on word count, recipient count, and attachment size.
- **Dark Mode**: Toggle between light and dark themes for better user experience.
- **Google Authentication**: Sign in with Google to fetch draft emails directly from Gmail.
- **Past Footprints**: View and manage a history of your past carbon footprint calculations.

## How It Works

1. **Input Email Details**:
   - Paste your email content into the text area.
   - Choose between auto-detecting recipients or manually entering the recipient count.
   - Specify the size of attachments in MB.

2. **Calculate Carbon**:
   - Click the "🌿 Calculate Carbon" button to estimate the carbon footprint.
   - View the results along with tips to reduce emissions.

3. **Fetch Gmail Drafts**:
   - Sign in with Google and fetch the latest draft email to analyze its carbon footprint.

4. **Dark Mode**:
   - Use the "🌙 Toggle Dark Mode" button to switch themes.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Open the `index.html` file in your browser to start using the application.

## File Structure

- `index.html`: The main HTML file for the application.
- `style.css`: Contains the styles for the application, including light and dark mode themes.
- `script.js`: Contains the JavaScript logic for carbon calculation, Google authentication, and Gmail integration.

## Technologies Used

- HTML, CSS, JavaScript
- Google API for Gmail integration

## Environment Setup

1. Replace the `CLIENT_ID` in `script.js` with your Google API client ID.
2. Ensure you have enabled the Gmail API in your Google Cloud Console.

## License

This project is licensed under the MIT License. Feel free to use and modify it as per your needs.

## Acknowledgments

- Inspired by the need to reduce digital carbon emissions.
- Uses Google APIs for seamless Gmail integration.
