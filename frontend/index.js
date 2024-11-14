import { backend } from "declarations/backend";

async function initialize() {
    try {
        const holders = await backend.getHolders();
        const distribution = await backend.getDistribution();
        
        renderHoldersList(holders);
        renderDistributionChart(distribution);
        
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('loading').innerHTML = 'Error loading data';
    }
}

function renderHoldersList(holders) {
    const holdersList = document.getElementById('holdersList');
    
    holders.forEach(holder => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
            <span class="holder-address">${holder.address}</span>
            <span class="holder-count">${holder.count} NFTs</span>
        `;
        holdersList.appendChild(item);
    });
}

function renderDistributionChart(distribution) {
    const ctx = document.getElementById('distributionChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: distribution.map(d => `${d.range} NFTs`),
            datasets: [{
                data: distribution.map(d => d.count),
                backgroundColor: [
                    '#ff71ce',
                    '#01cdfe',
                    '#05ffa1',
                    '#b967ff'
                ],
                borderColor: '#1a1a1a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            family: "'Press Start 2P', cursive",
                            size: 10
                        }
                    }
                }
            }
        }
    });
}

initialize();
