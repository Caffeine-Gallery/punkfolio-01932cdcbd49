import { backend } from "declarations/backend";
import { Principal } from "@dfinity/principal";

let userPrincipal;

async function initialize() {
    try {
        // Get token info
        const [holders, distribution] = await Promise.all([
            backend.getHolders(),
            backend.getDistribution()
        ]);
        
        renderHoldersList(holders);
        renderDistributionChart(distribution);
        await updateTokenBalance();
        
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById('loading').innerHTML = 'Error loading data';
    }
}

async function updateTokenBalance() {
    try {
        const balance = await backend.icrc1_balance_of({ 
            owner: Principal.fromText(userPrincipal), 
            subaccount: [] 
        });
        document.getElementById('tokenBalance').textContent = `Balance: ${formatTokenAmount(balance)} PUNK`;
    } catch (error) {
        console.error("Error fetching balance:", error);
        document.getElementById('tokenBalance').textContent = 'Balance: Error';
    }
}

function formatTokenAmount(amount) {
    return (amount / (10 ** 8)).toFixed(8);
}

async function handleTransfer(event) {
    event.preventDefault();
    const recipientAddress = document.getElementById('recipientAddress').value;
    const amount = document.getElementById('transferAmount').value;

    try {
        const recipient = Principal.fromText(recipientAddress);
        const transferArgs = {
            from_subaccount: [],
            to: {
                owner: recipient,
                subaccount: []
            },
            amount: BigInt(amount * (10 ** 8)),
            fee: [],
            memo: [],
            created_at_time: []
        };

        const result = await backend.icrc1_transfer(transferArgs);
        if ('ok' in result) {
            alert('Transfer successful!');
            await updateTokenBalance();
        } else {
            alert(`Transfer failed: ${result.err}`);
        }
    } catch (error) {
        console.error("Transfer error:", error);
        alert('Transfer failed. Please check the console for details.');
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

document.getElementById('transferForm').addEventListener('submit', handleTransfer);
initialize();
