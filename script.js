const API_KEY = '70121a438d0834aa2cde0f22d4d5181a1f5e88852c8caf2f0c598400fc9f98c8';

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const laser = document.querySelector('.laser');
const statusText = document.getElementById('status-text');
const resultsArea = document.getElementById('results-area');

dropZone.onclick = () => fileInput.click();

fileInput.onchange = (e) => handleFile(e.target.files[0]);

dropZone.ondrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
};

dropZone.ondragover = (e) => e.preventDefault();

async function handleFile(file) {
    if (!file) return;
    
    // UI Transitions
    laser.style.display = 'block';
    resultsArea.classList.remove('hidden');
    statusText.innerText = `READING BYTES: ${file.name}`;

    // 1. Hash the file
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const fileHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    // 2. Fetch from VirusTotal
    statusText.innerText = "QUERYING GLOBAL THREAT DATABASE...";
    
    try {
        const response = await fetch(`https://cors-anywhere.herokuapp.com/https://www.virustotal.com/api/v3/files/${fileHash}`, {
            headers: { 'x-apikey': API_KEY }
        });

        if (response.status === 404) {
            statusText.innerHTML = "RESULT: <span style='color: #ffaa00;'>NEW FILE / NO THREATS KNOWN</span>";
        } else {
            const data = await response.json();
            const mal = data.data.attributes.last_analysis_stats.malicious;
            statusText.innerHTML = mal > 0 ? 
                `RESULT: <span style='color: #ff0000;'>${mal} ENGINES FLAGGED AS MALWARE!</span>` : 
                "RESULT: <span style='color: #00ff00;'>FILE IS CLEAN. SAFE TO EXECUTE.</span>";
        }
    } catch (err) {
        statusText.innerText = "ERROR: CONNECTION BLOCKED OR LIMIT REACHED.";
    }
    
    laser.style.display = 'none';
}
