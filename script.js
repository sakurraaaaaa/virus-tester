const API_KEY = '70121a438d0834aa2cde0f22d4d5181a1f5e88852c8caf2f0c598400fc9f98c8';

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const laser = document.querySelector('.laser');
const statusText = document.getElementById('status-text');
const resultsArea = document.getElementById('results-area');

// Click to upload
dropZone.onclick = () => fileInput.click();

// Handle file selection
fileInput.onchange = (e) => handleFile(e.target.files[0]);

// Handle drag and drop
dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#ffffff";
};

dropZone.ondragleave = () => {
    dropZone.style.borderColor = "#ff003c";
};

dropZone.ondrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
};

async function handleFile(file) {
    if (!file) return;

    // SWITCH SCREEN IMMEDIATELY
    dropZone.style.display = 'none';
    resultsArea.classList.remove('hidden');
    laser.style.display = 'block';
    statusText.innerText = "INITIALIZING NEURAL OVERRIDE...";

    try {
        // 1. Hash the file
        statusText.innerText = `HASHING: ${file.name}`;
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const fileHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

        // 2. Fetch from VirusTotal (Using a proxy to stop CORS blocks)
        statusText.innerText = "UPLOADING FINGERPRINT TO DATABASE...";
        
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://www.virustotal.com/api/v3/files/' + fileHash)}`, {
            headers: { 'x-apikey': API_KEY }
        });

        const data = await response.json();
        // AllOrigins wraps the result in a 'contents' string
        const vtData = JSON.parse(data.contents);

        if (vtData.error) {
            statusText.innerHTML = "RESULT: <span style='color: #ffaa00;'>FILE NOT FOUND IN DATABASE (CLEAN OR NEW)</span>";
        } else {
            const mal = vtData.data.attributes.last_analysis_stats.malicious;
            statusText.innerHTML = mal > 0 ? 
                `RESULT: <span style='color: #ff0000;'>${mal} ENGINES FLAGGED AS MALWARE!</span>` : 
                "RESULT: <span style='color: #00ff00;'>NEURAL SCAN COMPLETE: FILE IS CLEAN.</span>";
        }
    } catch (err) {
        console.error(err);
        statusText.innerText = "ERROR: SYSTEM OVERLOAD. CHECK CONSOLE (F12).";
    }
    
    laser.style.display = 'none';
}
