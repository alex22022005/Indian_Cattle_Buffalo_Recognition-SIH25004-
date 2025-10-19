// Global objects to hold chart instances and fetched data
let charts = {
    breedUploads: null,
    animalTypes: null,
    activityOverTime: null,
    regional: null,
    weeklyActivity: null
};
let globalBotData = [];
let globalWebsiteData = [];

// Main event listener that runs when the page is loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- HELPER FUNCTIONS ---

    function updateLastRefreshedTime() {
        document.getElementById('update-time').textContent = new Date().toLocaleString();
    }

    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    function destroyCharts() {
        Object.keys(charts).forEach(key => {
            if (charts[key]) {
                charts[key].destroy();
                charts[key] = null;
            }
        });
    }

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch data from ${url}:`, error);
            return null;
        }
    }

    // --- MAIN DASHBOARD INITIALIZATION ---

    async function initializeDashboard() {
        // Show loading states for metric cards
        document.querySelectorAll('.metric-card p').forEach(el => {
            if (el.textContent === '0' || el.textContent === 'N/A' || el.innerHTML.includes('Failed to load')) {
                el.innerHTML = '<span class="loading"><i class="fas fa-spinner"></i> Loading...</span>';
            }
        });

        destroyCharts(); // Clear old charts before drawing new ones

        const botApiUrl = 'http://localhost:3000/api/getBotData';
        const websiteApiUrl = 'http://localhost:3000/api/getWebsiteData';

        try {
            const [botData, websiteData] = await Promise.all([
                fetchData(botApiUrl),
                fetchData(websiteApiUrl)
            ]);

            // Remove any previous error messages
            const existingError = document.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            if (botData && websiteData) {
                globalBotData = botData;
                globalWebsiteData = websiteData;

                updateLastRefreshedTime();
                processAndDisplayMetrics(botData, websiteData);
                charts.breedUploads = createBreedUploadsChart(websiteData);
                charts.animalTypes = createAnimalTypesChart(websiteData);
                charts.activityOverTime = createActivityOverTimeChart(botData, websiteData);
                charts.regional = createRegionalChart(websiteData);
                charts.weeklyActivity = createWeeklyActivityChart(botData, websiteData);
            } else {
                throw new Error("Failed to load data from one or more APIs");
            }
        } catch (error) {
            console.error("Error initializing dashboard:", error);
            // Display connection error message
            const mainElement = document.querySelector('main');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'background:var(--danger); color:white; padding:10px; border-radius:5px; margin-bottom:20px; text-align:center;';
            errorDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Could not connect to the server. Please ensure your backend is running on port 3000.';
            mainElement.prepend(errorDiv);
        }
    }

    // --- DATA PROCESSING & METRIC CARDS ---

    function processAndDisplayMetrics(botData, websiteData) {
        animateValue(document.getElementById('total-users'), 0, botData.length, 1500);
        const totalUploads = websiteData.reduce((acc, user) => acc + (user.uploads ? user.uploads.length : 0), 0);
        animateValue(document.getElementById('total-uploads'), 0, totalUploads, 1500);
        const totalQueries = botData.reduce((acc, user) => acc + user.interactions.reduce((iAcc, i) => iAcc + (i.queries ? i.queries.length : 0), 0), 0);
        animateValue(document.getElementById('total-queries'), 0, totalQueries, 1500);

        const allUploads = websiteData.flatMap(d => d.uploads || []);
        if (allUploads.length > 0) {
            const breedCounts = allUploads.reduce((acc, upload) => {
                if (upload.breedName) acc[upload.breedName] = (acc[upload.breedName] || 0) + 1;
                return acc;
            }, {});
            const mostIdentified = Object.entries(breedCounts).sort((a, b) => b[1] - a[1])[0];
            if (mostIdentified) {
                document.getElementById('most-identified-breed').textContent = mostIdentified[0];
                document.getElementById('breed-count').textContent = mostIdentified[1];
            }
        } else {
            document.getElementById('most-identified-breed').textContent = 'N/A';
            document.getElementById('breed-count').textContent = '0';
        }
    }

    // --- CHART CREATION FUNCTIONS ---

    function createBreedUploadsChart(websiteData) {
        const ctx = document.getElementById('breedUploadsChart').getContext('2d');
        const allUploads = websiteData.flatMap(d => d.uploads || []);
        const breedCounts = allUploads.reduce((acc, upload) => {
            if (upload.breedName) acc[upload.breedName] = (acc[upload.breedName] || 0) + 1;
            return acc;
        }, {});
        const sortedBreeds = Object.entries(breedCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedBreeds.map(b => b[0]),
                datasets: [{
                    label: '# of Uploads',
                    data: sortedBreeds.map(b => b[1]),
                    backgroundColor: 'rgba(44, 110, 73, 0.8)',
                    borderColor: 'rgba(44, 110, 73, 1)',
                    borderWidth: 1,
                    borderRadius: 5,
                    hoverBackgroundColor: 'rgba(44, 110, 73, 1)',
                    hoverBorderWidth: 2 // Added for pop effect
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });
    }

    function createAnimalTypesChart(websiteData) {
        const ctx = document.getElementById('animalTypesChart').getContext('2d');
        const allUploads = websiteData.flatMap(d => d.uploads || []);
        const typeCounts = allUploads.reduce((acc, upload) => {
            let type = (upload.type || upload.animalType || 'unknown').toLowerCase();
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(typeCounts).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
                datasets: [{
                    data: Object.values(typeCounts),
                    backgroundColor: ['#2c6e49', '#4c956c', '#ffc9b9', '#d68c45', '#b5838d'],
                    borderWidth: 1,
                    hoverOffset: 15 // Increased for pop effect
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '65%' }
        });
    }

    function createActivityOverTimeChart(botData, websiteData) {
        const ctx = document.getElementById('activityOverTimeChart').getContext('2d');
        const allInteractions = botData.flatMap(u => u.interactions || []);
        const allUploads = websiteData.flatMap(d => d.uploads || []);
        const dailyData = {};
        const processTimestamp = (item) => {
            if (!item || !item.timestamp) return null;
            const date = new Date(item.timestamp);
            if (isNaN(date.getTime())) return null;
            return date.toISOString().substring(0, 10);
        };
        allInteractions.forEach(item => {
            const day = processTimestamp(item);
            if (day) {
                if (!dailyData[day]) dailyData[day] = { interactions: 0, uploads: 0 };
                dailyData[day].interactions += (item.queries ? item.queries.length : 1);
            }
        });
        allUploads.forEach(item => {
            const day = processTimestamp(item);
            if (day) {
                if (!dailyData[day]) dailyData[day] = { interactions: 0, uploads: 0 };
                dailyData[day].uploads++;
            }
        });
        const sortedDays = Object.keys(dailyData).sort();
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedDays.map(d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                datasets: [
                    { label: 'Bot Interactions', data: sortedDays.map(d => dailyData[d].interactions), borderColor: '#2c6e49', tension: 0.3, fill: true, pointRadius: 5, pointHoverRadius: 8 }, // Added hover radius
                    { label: 'Website Uploads', data: sortedDays.map(d => dailyData[d].uploads), borderColor: '#ffc9b9', tension: 0.3, fill: true, pointRadius: 5, pointHoverRadius: 8 }  // Added hover radius
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    function createRegionalChart(websiteData) {
        const ctx = document.getElementById('regionalChart').getContext('2d');
        const allUploads = websiteData.flatMap(d => d.uploads || []);
        const regionCounts = allUploads.reduce((acc, upload) => {
            let region = upload.location || 'Unknown';
            acc[region] = (acc[region] || 0) + 1;
            return acc;
        }, {});
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(regionCounts),
                datasets: [{
                    data: Object.values(regionCounts),
                    backgroundColor: ['#003f5c', '#374c80', '#7a5195', '#bc5090', '#ef5675', '#ff764a', '#ffa600', '#58508d'],
                    borderWidth: 1,
                    hoverOffset: 15 // Increased for pop effect
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
        });
    }

    function createWeeklyActivityChart(botData, websiteData) {
        const ctx = document.getElementById('weeklyActivityChart').getContext('2d');
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();
        const uploadData = Array(7).fill(0);
        const queryData = Array(7).fill(0);
        websiteData.forEach(user => {
            user.uploads?.forEach(upload => {
                const uploadDate = new Date(upload.timestamp).toISOString().split('T')[0];
                const dayIndex = last7Days.indexOf(uploadDate);
                if (dayIndex !== -1) uploadData[dayIndex]++;
            });
        });
        botData.forEach(user => {
            user.interactions?.forEach(interaction => {
                const queryDate = new Date(interaction.timestamp).toISOString().split('T')[0];
                const dayIndex = last7Days.indexOf(queryDate);
                if (dayIndex !== -1) queryData[dayIndex] += interaction.queries?.length || 1;
            });
        });
        const dayLabels = last7Days.map(day => new Date(day).toLocaleDateString('en-US', { weekday: 'short' }));
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dayLabels,
                datasets: [
                    { label: 'Uploads', data: uploadData, backgroundColor: '#4c956c', borderRadius: 5, hoverBorderWidth: 2 }, // Added for pop effect
                    { label: 'Queries', data: queryData, backgroundColor: '#d68c45', borderRadius: 5, hoverBorderWidth: 2 } // Added for pop effect
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    // --- EXPORT FUNCTIONALITY ---

    function exportReport(websiteData) {
        if (!websiteData || websiteData.length === 0) {
            alert("No data available to export.");
            return;
        }

        const flattenedUploads = websiteData.flatMap(user =>
            (user.uploads || []).map(upload => ({
                browserId: user.browserId,
                uploadTimestamp: upload.timestamp,
                breedName: upload.breedName,
                confidence: upload.confidence,
                animalType: upload.type || upload.animalType,
                location: upload.location || 'N/A'
            }))
        );

        if (flattenedUploads.length === 0) {
            alert("No website upload data found to export.");
            return;
        }

        const headers = Object.keys(flattenedUploads[0]);
        const csvRows = [headers.join(',')];

        for (const row of flattenedUploads) {
            const values = headers.map(header => {
                let value = row[header] === null || row[header] === undefined ? '' : row[header];
                let stringValue = String(value);
                if (stringValue.includes(',')) {
                    stringValue = `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            });
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        const filename = `website_uploads_report_${new Date().toISOString().split('T')[0]}.csv`;
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- EVENT LISTENERS ---
    
    document.getElementById('refresh-btn').addEventListener('click', initializeDashboard);
    document.getElementById('export-btn').addEventListener('click', () => {
        exportReport(globalWebsiteData);
    });

    // Initial load and auto-refresh
    initializeDashboard();
    setInterval(initializeDashboard, 300000); // Refresh every 5 minutes
});