function toggleRecipientMode(isAuto) {
    document.getElementById('autoRecipients').style.display = isAuto ? 'block' : 'none';
    document.getElementById('manualRecipients').style.display = isAuto ? 'none' : 'block';
}

function calculateCarbon() {
    const emailText = document.getElementById('emailBody').value.trim();
    const recipientsText = document.getElementById('recipients').value.trim();
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
    

    // Basic Estimations
    const wordCarbon = wordCount * 0.00002;         // 0.02g per 1k words
    const recipientCarbon = recipientCount * 0.5;   // 0.5g per recipient
    const attachmentCarbon = attachmentSize * 2;    // 2g per MB approx.

    const totalCarbon = wordCarbon + recipientCarbon + attachmentCarbon;

    document.getElementById('result').innerHTML = `
        Estimated Carbon Footprint: <strong>${totalCarbon.toFixed(2)}g CO₂e</strong><br><br>
        <em>${generateTip(totalCarbon)}</em>
    `;
}

function generateTip(carbon) {
    if (carbon < 1) return "Green score: Excellent! 🌿 Keep it up.";
    if (carbon < 5) return "Looks decent — if possible please trim a bit.";
    if (carbon < 10) return "Try reducing recipients or attachments.";
    return "🚨 High carbon! Use links, compress files, or split your mail.";
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');

    document.querySelectorAll('textarea, input, button, #result').forEach(el => {
        el.classList.toggle('dark-mode');
    });

    // Save dark mode preference
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('carbonnudge-darkmode', 'on');
    } else {
        localStorage.setItem('carbonnudge-darkmode', 'off');
    }
}

// On Load — Check Dark Mode Preference
window.onload = function() {
    if (localStorage.getItem('carbonnudge-darkmode') === 'on') {
        toggleDarkMode();
    }
}

