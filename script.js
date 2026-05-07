const API_KEY = '70121a438d0834aa2cde0f22d4d5181a1f5e88852c8caf2f0c598400fc9f98c8';

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const laser = document.querySelector('.laser');
const statusText = document.getElementById('status-text');
const resultsArea = document.getElementById('results-area');

dropZone.onclick = () => fileInput.click();
fileInput.onchange = (e) => handleFile(e.target.files[0]);
dropZone.ondragover = (e) => e.preventDefault();
dropZone.ondrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
};

async function handleFile(file) {
    if (!file) return;

    // UI Flip
    dropZone.style.display = 'none';
    resultsArea.classList.remove('hidden');
    if(laser) laser.style.display = 'block';
    statusText.innerText = "ACCESSING NEURAL NETWORK...";

    try {
        // 1. Generate Hash
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const fileHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        statusText.innerText = `SCANNING HASH: ${fileHash.substring(0,10)}...`;

        // 2. Direct API Call
        const response = await fetch(`https://www.virustotal.com/api/v3/files/${fileHash}`, {
            method: 'GET',
            headers: {
                'x-apikey': API_KEY,
                'Accept': 'application/json'
            }
        });

        if (response.status === 404) {
            statusText.innerHTML = "RESULT: <span style='color: #00ff00;'>CLEAN (First Time Seen)</span>";
        } else if (!response.ok) {
            throw new Error('API Error');
        } else {
            const vtData = await response.json();
            const mal = vtData.data.attributes.last_analysis_stats.malicious;
            statusText.innerHTML = mal > 0 ? 
                `RESULT: <span style='color: #ff0000;'>${mal} THREATS DETECTED!</span>` : 
                "RESULT: <span style='color: #00ff00;'>FILE IS SECURE.</span>";
        }
    } catch (err) {
        console.error(err);
        statusText.innerHTML = "ERROR: <span style='color: #ff0000;'>CORS BLOCK OR API LIMIT.</span>";
    }
    if(laser) laser.style.display = 'none';
}
