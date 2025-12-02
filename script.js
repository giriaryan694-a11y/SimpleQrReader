document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const openCameraBtn = document.getElementById('open-camera');
    const fileInput = document.getElementById('file-input');
    const videoFeed = document.getElementById('video-feed');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const resultUrl = document.getElementById('result-url');
    const copyBtn = document.getElementById('copy-btn');
    const saveBtn = document.getElementById('save-btn');

    let scanning = false;
    let stream = null;

    // --- Theme Management ---
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function loadTheme() {
        const theme = getCookie('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleBtn.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-theme');
            themeToggleBtn.textContent = '🌙';
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
        setCookie('theme', isDark ? 'dark' : 'light', 365);
    });

    // --- Camera & Scanning Logic ---
    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Prefer back camera
            });
            videoFeed.srcObject = stream;
            videoFeed.style.display = 'block';
            videoFeed.play();
            scanning = true;
            requestAnimationFrame(scanFrame);
            openCameraBtn.textContent = "Stop Camera";
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please ensure permissions are granted.");
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        videoFeed.srcObject = null;
        videoFeed.style.display = 'none';
        scanning = false;
        openCameraBtn.textContent = "Open Camera";
    }

    function scanFrame() {
        if (!scanning || videoFeed.readyState !== videoFeed.HAVE_ENOUGH_DATA) {
            return;
        }

        canvas.width = videoFeed.videoWidth;
        canvas.height = videoFeed.videoHeight;
        ctx.drawImage(videoFeed, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            // Found a QR code!
            stopCamera();
            handleScanResult(code.data);
        } else {
            // Continue scanning
            requestAnimationFrame(scanFrame);
        }
    }

    openCameraBtn.addEventListener('click', () => {
        if (scanning) {
            stopCamera();
        } else {
            startCamera();
        }
    });

    // --- File Input Logic ---
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code) {
                    handleScanResult(code.data);
                } else {
                    alert("No QR code found in the selected image.");
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // --- Result Handling ---
    function handleScanResult(content) {
        resultContainer.style.display = 'block';
        resultText.textContent = content;

        // Check if it's a URL
        if (content.startsWith('http://') || content.startsWith('https://') || content.startsWith('www.')) {
            resultText.style.display = 'none'; // Hide the <pre> tag
            resultUrl.href = content.startsWith('www.') ? 'http://' + content : content;
            resultUrl.textContent = content;
            resultUrl.style.display = 'block';
        } else {
            resultText.style.display = 'block'; // Show the <pre> tag
            resultUrl.style.display = 'none'; // Hide the <a> tag
        }
    }

    // URL click confirmation
    resultUrl.addEventListener('click', (e) => {
        e.preventDefault(); // Stop the link from opening immediately
        const userConfirmed = confirm("Are you sure you want to browse this url?\n\n" + resultUrl.href);
        if (userConfirmed) {
            window.open(resultUrl.href, '_blank'); // Open in a new tab
        }
        // If no, do nothing
    });

    // Get current content (works for both text and URL)
    function getCurrentContent() {
        return resultUrl.style.display === 'block' ? resultUrl.textContent : resultText.textContent;
    }

    // Copy button
    copyBtn.addEventListener('click', () => {
        const content = getCurrentContent();
        navigator.clipboard.writeText(content).then(() => {
            alert("Content copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy:", err);
            alert("Failed to copy content.");
        });
    });

    // Save as .txt button
    saveBtn.addEventListener('click', () => {
        const content = getCurrentContent();
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'qrcode_content.txt';
        
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    });

    // --- Initial Load ---
    loadTheme();
});
          
