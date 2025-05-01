function toggleRecipientMode(isAuto) {
    document.getElementById('autoRecipients').style.display = isAuto ? 'block' : 'none';
    document.getElementById('manualRecipients').style.display = isAuto ? 'none' : 'block';
}

function calculateCarbon() {
    const emailText = document.getElementById('emailBody').value.trim();
    const attachmentSize = parseFloat(document.getElementById('attachments').value) || 0;

    const wordCount = emailText.split(/\s+/).filter(w => w.length > 0).length;

    let recipientCount = 0;
    if (document.querySelector('input[name="recMode"]:checked').value === 'auto') {
        const recipientsText = document.getElementById('recipients').value.trim();
        const recipients = recipientsText.split(/[,;]+/).map(e => e.trim()).filter(e => e.length > 0);
        recipientCount = recipients.length;
    } else {
        recipientCount = parseInt(document.getElementById('recipientCount').value) || 0;
    }

    const wordCarbon = wordCount * 0.00002;       
    const recipientCarbon = recipientCount * 0.5;   
    const attachmentCarbon = attachmentSize * 2;    

    const totalCarbon = wordCarbon + recipientCarbon + attachmentCarbon;

    document.getElementById('result').innerHTML = `
        Estimated Carbon Footprint: <strong>${totalCarbon.toFixed(2)}g CO₂e</strong><br><br>
        <em>${generateTip(totalCarbon)}</em>
    `;

    handleFootprintResult(recipientCount, attachmentSize, totalCarbon.toFixed(2));
}

function generateTip(carbon) {
    if (carbon < 1) return "Green score: Excellent! 🌿 Keep it up.";
    if (carbon < 5) return "Looks decent — if possible please trim a bit.";
    if (carbon < 10) return "Try reducing recipients or attachments.";
    return "🚨 High carbon! Use links, compress files, or split your mail.";
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.container')?.classList.toggle('dark-mode');

    document.querySelectorAll('textarea, input, button, #result').forEach(el => {
        el.classList.toggle('dark-mode');
    });

    localStorage.setItem('carbonnudge-darkmode', document.body.classList.contains('dark-mode') ? 'on' : 'off');
}

window.onload = function () {
    if (localStorage.getItem('carbonnudge-darkmode') === 'on') {
        toggleDarkMode();
    }
    loadPastFootprints();
}

function loadPastFootprints() {
    const footprints = JSON.parse(localStorage.getItem('carbonnudge-footprints')) || [];
    const list = document.getElementById('pastFootprints');
    list.innerHTML = '';

    footprints.forEach(footprint => {
        const li = document.createElement('li');
        li.textContent = `Recipients: ${footprint.recipients} | Attachment: ${footprint.attachmentSize}MB | Carbon Footprint: ${footprint.footprint}g`;
        list.appendChild(li);
    });
}

function saveFootprintToLocalStorage(footprint) {
    let footprints = JSON.parse(localStorage.getItem('carbonnudge-footprints')) || [];
    if (footprints.length >= 5) footprints.pop();
    footprints.unshift(footprint);
    localStorage.setItem('carbonnudge-footprints', JSON.stringify(footprints));
}

function handleFootprintResult(recipientsCount, attachmentSize, footprint) {
    saveFootprintToLocalStorage({
        recipients: recipientsCount,
        attachmentSize: attachmentSize,
        footprint: footprint
    });
    loadPastFootprints();
}

// --------- Google Auth & Gmail Fetch ---------
const CLIENT_ID = '652971808273-0mq90kmsfec50b4apt1ir4lj97c72irp.apps.googleusercontent.com'; // 👈 Replace this
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
            gapi.client.setToken(tokenResponse);
            onLoginSuccess();
        },
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('loginSection').style.display = 'block';
    }
}

function handleAuthClick() {
    tokenClient.requestAccessToken();
}

function handleSignoutClick() {
    gapi.client.setToken('');
    document.getElementById('gmailFetchSection').style.display = 'none';
    document.getElementById('mainApp').style.display = 'none';
    document.querySelector('[onclick="handleAuthClick()"]').style.display = 'inline-block';
    document.querySelector('[onclick="handleSignoutClick()"]').style.display = 'none';
}

// 🎯 Called when user logs in successfully
function onLoginSuccess() {
    document.getElementById('gmailFetchSection').style.display = 'block';
    document.getElementById('mainApp').style.display = 'block';
    document.querySelector('[onclick="handleAuthClick()"]').style.display = 'none';
    document.querySelector('[onclick="handleSignoutClick()"]').style.display = 'inline-block';
    loadPastFootprints();
}

async function fetchLatestGmail() {
    try {
        const res = await gapi.client.gmail.users.messages.list({
            userId: 'me',
            maxResults: 1,
            labelIds: ['DRAFT'],
        });

        const messageId = res.result.messages?.[0]?.id;
        if (!messageId) return alert('No draft emails found.');

        const msg = await gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full'
        });

        const headers = msg.result.payload.headers;
        const toHeader = headers.find(h => h.name === 'To')?.value || '';
        const body = getEmailBody(msg.result.payload);

        document.getElementById('recipients').value = toHeader;
        document.getElementById('emailBody').value = body;

        calculateCarbon();
    } catch (e) {
        console.error('Gmail fetch failed:', e);
        alert('Failed to fetch Gmail draft. Check permissions.');
    }
}

function getEmailBody(payload) {
    if (!payload.parts) return atob(payload.body.data || '');

    for (const part of payload.parts) {
        if (part.mimeType === 'text/plain') {
            return atob(part.body.data || '');
        }
    }
    return '';
}
