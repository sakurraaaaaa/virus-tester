const dropZone = document.getElementById('drop-zone');
const statusText = document.getElementById('status-text');

dropZone.onclick = () => document.getElementById('file-input').click();

dropZone.ondragover = (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#ff0000";
};

dropZone.ondrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    startScan(file.name);
};

function startScan(fileName) {
    dropZone.classList.add('hidden');
    document.getElementById('results-area').classList.remove('hidden');
    
    // Simulating the scan logic
    setTimeout(() => {
        statusText.innerText = `HASHING: ${fileName}...`;
    }, 1000);

    setTimeout(() => {
        statusText.innerHTML = "<span style='color: #00ff00;'>VERDICT: CLEAN. NO MALWARE DETECTED.</span>";
    }, 3000);
}
