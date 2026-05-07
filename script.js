const API_KEY = '70121a438d0834aa2cde0f22d4d5181a1f5e88852c8caf2f0c598400fc9f98c8'; // <--- PASTE YOUR KEY HERE

async function startScan(file) {
    statusText.innerText = "CALCULATING FINGERPRINT...";
    
    // 1. Generate SHA-256 Hash (The "Fingerprint")
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    statusText.innerText = "CONSULTING NEURAL NETWORK...";

    // 2. Check VirusTotal for this Hash
    try {
        const response = await fetch(`https://www.virustotal.com/api/v3/files/${fileHash}`, {
            headers: { 'x-apikey': API_KEY }
        });

        if (response.status === 404) {
            statusText.innerHTML = "<span style='color: #ffaa00;'>FILE UNKNOWN. (Needs manual upload)</span>";
        } else {
            const data = await response.json();
            const stats = data.data.attributes.last_analysis_stats;
            
            if (stats.malicious > 0) {
                statusText.innerHTML = `<span style='color: #ff0000;'>DANGER: ${stats.malicious} THREATS DETECTED!</span>`;
            } else {
                statusText.innerHTML = "<span style='color: #00ff00;'>VERDICT: 100% CLEAN.</span>";
            }
        }
    } catch (err) {
        statusText.innerText = "ERROR: API LIMIT REACHED OR OFFLINE.";
    }
}
