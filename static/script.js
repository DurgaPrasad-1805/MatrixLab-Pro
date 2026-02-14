// ============================================
// MATRIXLAB PRO - FULLY CORRECTED VERSION
// ============================================

// ===== Global State =====
let currentOperation = null;
let currentCategory = null;
let chartInstance = null;
let historyCount = 0;
let sessionCalculations = 0;

// ===== DOM Elements =====
const categorySelect = document.getElementById('category');
const operationSelect = document.getElementById('operation');
const calculateBtn = document.getElementById('calculate-btn');
const resetBtn = document.getElementById('reset-btn');
const stepByStepToggle = document.getElementById('step-by-step-toggle');
const historyList = document.getElementById('history-list');
const resultSection = document.getElementById('result-section');
const operationInfo = document.getElementById('operation-info');
const categoryBadge = document.getElementById('category-badge');

// ===== Operation Definitions =====
const operationsByCategory = {
    basic: [
        { value: "add", text: "Matrix Addition", info: "Add two matrices of the same dimensions element by element" },
        { value: "subtract", text: "Matrix Subtraction", info: "Subtract Matrix B from Matrix A element by element" },
        { value: "multiply", text: "Matrix Multiplication", info: "Multiply Matrix A by Matrix B (columns of A must equal rows of B)" },
        { value: "transpose", text: "Matrix Transpose", info: "Flip the matrix over its diagonal (swap rows and columns)" }
    ],
    scalar: [
        { value: "scalar_multiply", text: "Scalar Multiplication", info: "Multiply every element of the matrix by a scalar value" },
        { value: "equality", text: "Matrix Equality", info: "Check if two matrices are exactly equal" },
        { value: "identity", text: "Identity Matrix", info: "Generate an n×n identity matrix with 1s on diagonal, 0s elsewhere" },
        { value: "zero", text: "Zero Matrix", info: "Generate an m×n matrix with all elements as zero" }
    ],
    algebra: [
        { value: "determinant", text: "Determinant", info: "Calculate the determinant of a square matrix" },
        { value: "inverse", text: "Inverse Matrix", info: "Find the inverse of a 2×2 matrix (if it exists)" },
        { value: "rank", text: "Rank", info: "Determine the rank (number of linearly independent rows)" },
        { value: "trace", text: "Trace", info: "Sum of all diagonal elements of a square matrix" },
        { value: "adjoint", text: "Adjoint Matrix", info: "Calculate the adjoint (adjugate) of a 2×2 matrix" }
    ],
    decompositions: [
        { value: "lu", text: "LU Decomposition", info: "Decompose into Lower and Upper triangular matrices" },
        { value: "cholesky", text: "Cholesky Decomposition", info: "For symmetric positive definite matrices only" },
        { value: "eigen", text: "Eigenvalues", info: "Find eigenvalues of a 2×2 matrix" }
    ],
    data: [
        { value: "covariance", text: "Covariance", info: "Measure of how two variables change together" },
        { value: "correlation", text: "Correlation", info: "Normalized measure of linear relationship" }
    ],
    utilities: [
        { value: "is_square", text: "Is Square", info: "Check if matrix has equal rows and columns" },
        { value: "dimensions", text: "Dimensions", info: "Get the size of the matrix (rows × columns)" },
        { value: "is_identity", text: "Is Identity", info: "Check if matrix is an identity matrix" },
        { value: "is_zero", text: "Is Zero", info: "Check if all elements are zero" },
        { value: "is_symmetric", text: "Is Symmetric", info: "Check if matrix equals its transpose" }
    ]
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('%c MatrixLab Pro', 'color: #0284c7; font-size: 24px; font-weight: bold;');
    console.log('%c Professional Matrix Operations Suite', 'color: #64748b; font-size: 14px;');
    console.log('%c Keyboard Shortcuts: Ctrl+Enter = Calculate | Ctrl+R = Reset', 'color: #94a3b8; font-size: 12px;');
    
    initializeMatrices();
    setupEventListeners();
    showToast('Welcome to MatrixLab Pro!', 'success');
});

function initializeMatrices() {
    generateMatrix('A');
}

// ===== Event Listeners =====
function setupEventListeners() {
    categorySelect.addEventListener('change', handleCategoryChange);
    operationSelect.addEventListener('change', handleOperationChange);
    calculateBtn.addEventListener('click', calculateOperation);
    resetBtn.addEventListener('click', resetApp);
    
    // Tab switching
    document.querySelectorAll('.view-tab').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Result view switching
    document.querySelectorAll('.result-view-tab').forEach(btn => {
        btn.addEventListener('click', function() {
            switchResultView(this.dataset.view);
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function handleCategoryChange(e) {
    const category = e.target.value;
    currentCategory = category;
    
    operationSelect.innerHTML = '<option value="">Select an operation...</option>';
    
    if (!category) {
        categoryBadge.textContent = 'Select Category';
        operationInfo.innerHTML = '<i class="fas fa-info-circle"></i><span>Select a category and operation to view details and begin calculation</span>';
        return;
    }
    
    const categoryNames = {
        basic: 'Basic',
        scalar: 'Scalar',
        algebra: 'Algebra',
        decompositions: 'Decomp',
        data: 'Data',
        utilities: 'Utils'
    };
    categoryBadge.textContent = categoryNames[category] || category;
    
    operationsByCategory[category].forEach(op => {
        const option = document.createElement('option');
        option.value = op.value;
        option.textContent = op.text;
        operationSelect.appendChild(option);
    });
}

function handleOperationChange(e) {
    const operation = e.target.value;
    currentOperation = operation;
    
    if (!operation) {
        operationInfo.innerHTML = '<i class="fas fa-info-circle"></i><span>Select an operation to begin</span>';
        return;
    }
    
    const opData = findOperationData(operation);
    if (opData) {
        operationInfo.innerHTML = `<i class="fas fa-lightbulb"></i><span>${opData.info}</span>`;
    }
    
    updateMatrixVisibility(operation);
    updateExtraInputs(operation);
}

function findOperationData(operation) {
    for (const category in operationsByCategory) {
        const found = operationsByCategory[category].find(op => op.value === operation);
        if (found) return found;
    }
    return null;
}

// ===== Matrix Visibility =====
function updateMatrixVisibility(operation) {
    const matrixACard = document.getElementById('matrix-a-card');
    const matrixBCard = document.getElementById('matrix-b-card');
    
    // Operations that DON'T need Matrix A (identity and zero)
    const noMatrixA = ['identity', 'zero'];
    
    // Operations that require Matrix B
    const requiresMatrixB = [
        'add', 'subtract', 'multiply', 'equality', 'covariance', 'correlation'
    ];
    
    // Hide or show Matrix A
    if (noMatrixA.includes(operation)) {
        matrixACard.style.display = 'none';
    } else {
        matrixACard.style.display = 'block';
        if (!document.getElementById('matrix-A').querySelector('table')) {
            generateMatrix('A');
        }
    }
    
    // Hide or show Matrix B
    if (requiresMatrixB.includes(operation)) {
        matrixBCard.style.display = 'block';
        if (!document.getElementById('matrix-B').querySelector('table')) {
            generateMatrix('B');
        }
        setTimeout(() => matrixBCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    } else {
        matrixBCard.style.display = 'none';
    }
}

// ===== Extra Inputs =====
function updateExtraInputs(operation) {
    const extraSection = document.getElementById('extra-input-section');
    const scalarInput = document.getElementById('scalar-input');
    const identityInput = document.getElementById('identity-input');
    const zeroInput = document.getElementById('zero-input');
    
    extraSection.style.display = 'none';
    scalarInput.style.display = 'none';
    identityInput.style.display = 'none';
    zeroInput.style.display = 'none';
    
    if (operation === 'scalar_multiply') {
        extraSection.style.display = 'block';
        scalarInput.style.display = 'block';
    } else if (operation === 'identity') {
        extraSection.style.display = 'block';
        identityInput.style.display = 'block';
    } else if (operation === 'zero') {
        extraSection.style.display = 'block';
        zeroInput.style.display = 'block';
    }
}

// ===== Matrix Generation =====
function generateMatrix(matrixName) {
    const rowsInput = document.getElementById(`rows-${matrixName}`);
    const colsInput = document.getElementById(`cols-${matrixName}`);
    const matrixContainer = document.getElementById(`matrix-${matrixName}`);
    const dimensionDisplay = document.getElementById(`matrix-${matrixName}-dims`);
    
    const rows = parseInt(rowsInput.value) || 2;
    const cols = parseInt(colsInput.value) || 2;
    
    if (rows <= 0 || cols <= 0) {
        showToast('Dimensions must be positive numbers', 'error');
        return;
    }
    
    if (rows > 10 || cols > 10) {
        showToast('Maximum matrix size is 10×10', 'warning');
        return;
    }
    
    dimensionDisplay.textContent = `${rows} × ${cols}`;
    
    matrixContainer.innerHTML = '';
    
    const table = document.createElement('table');
    
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.step = '0.01';
            input.placeholder = '0';
            input.value = (i === j) ? '1' : '0';
            
            td.appendChild(input);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    
    matrixContainer.appendChild(table);
    
    const firstInput = table.querySelector('input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

window.generateMatrix = generateMatrix;

// ===== Matrix Operations =====
function getMatrixValues(matrixName) {
    const container = document.getElementById(`matrix-${matrixName}`);
    const table = container.querySelector('table');
    
    if (!table) {
        return null;
    }
    
    const rows = table.querySelectorAll('tr');
    const matrix = [];
    let hasEmpty = false;
    
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('input').forEach(input => {
            const value = input.value.trim();
            if (value === '') {
                hasEmpty = true;
                rowData.push(0);
            } else {
                rowData.push(parseFloat(value));
            }
        });
        matrix.push(rowData);
    });
    
    if (hasEmpty) {
        showToast('Empty cells were filled with 0', 'info');
    }
    
    return matrix;
}

function randomFillMatrix(matrixName) {
    const container = document.getElementById(`matrix-${matrixName}`);
    const inputs = container.querySelectorAll('input');
    
    if (inputs.length === 0) {
        showToast('Please generate the matrix grid first', 'warning');
        return;
    }
    
    inputs.forEach((input, index) => {
        setTimeout(() => {
            const randomValue = Math.floor(Math.random() * 20) - 10;
            input.value = randomValue;
        }, index * 15);
    });
    
    showToast(`Matrix ${matrixName} filled with random values`, 'success');
}

window.randomFillMatrix = randomFillMatrix;

function clearMatrix(matrixName) {
    const container = document.getElementById(`matrix-${matrixName}`);
    const inputs = container.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.value = '0';
    });
    
    showToast(`Matrix ${matrixName} cleared`, 'info');
}

window.clearMatrix = clearMatrix;

function swapMatrices() {
    const matrixA = getMatrixValues('A');
    const matrixB = getMatrixValues('B');
    
    if (!matrixA || !matrixB) {
        showToast('Both matrices must be generated to swap', 'warning');
        return;
    }
    
    document.getElementById('rows-A').value = matrixB.length;
    document.getElementById('cols-A').value = matrixB[0].length;
    document.getElementById('rows-B').value = matrixA.length;
    document.getElementById('cols-B').value = matrixA[0].length;
    
    generateMatrix('A');
    generateMatrix('B');
    
    setTimeout(() => {
        fillMatrixWithValues('A', matrixB);
        fillMatrixWithValues('B', matrixA);
        showToast('Matrices swapped successfully', 'success');
    }, 100);
}

window.swapMatrices = swapMatrices;

function fillMatrixWithValues(matrixName, values) {
    const container = document.getElementById(`matrix-${matrixName}`);
    const inputs = container.querySelectorAll('input');
    
    let index = 0;
    values.forEach(row => {
        row.forEach(value => {
            if (inputs[index]) {
                inputs[index].value = value;
            }
            index++;
        });
    });
}

function clearAllMatrices() {
    clearMatrix('A');
    if (document.getElementById('matrix-b-card').style.display !== 'none') {
        clearMatrix('B');
    }
    showToast('All matrices cleared', 'info');
}

window.clearAllMatrices = clearAllMatrices;

// ===== Calculate Operation =====
async function calculateOperation() {
    const operation = operationSelect.value;
    
    if (!operation) {
        showToast('Please select an operation first', 'warning');
        return;
    }
    
    showLoading(true);
    calculateBtn.querySelector('.loading-spinner').style.display = 'inline-block';
    calculateBtn.querySelector('span').textContent = 'Calculating...';
    calculateBtn.disabled = true;
    
    try {
        const payload = { operation: operation };
        
        // Operations that don't need any matrix
        const noMatrixOps = ['identity', 'zero'];
        
        // Operations that need Matrix A
        if (!noMatrixOps.includes(operation)) {
            const matrixA = getMatrixValues('A');
            if (!matrixA) {
                throw new Error('Please generate Matrix A first');
            }
            payload.matrixA = matrixA;
        }
        
        // Operations that need Matrix B
        const requiresMatrixB = [
            'add', 'subtract', 'multiply', 'equality', 'covariance', 'correlation'
        ];
        
        if (requiresMatrixB.includes(operation)) {
            const matrixB = getMatrixValues('B');
            if (!matrixB) {
                throw new Error('Please generate Matrix B first');
            }
            payload.matrixB = matrixB;
        }
        
        // Handle extra inputs
        if (operation === 'scalar_multiply') {
            const scalarValue = document.getElementById('scalar-value').value;
            if (!scalarValue) {
                throw new Error('Please enter a scalar value');
            }
            payload.scalar = parseFloat(scalarValue);
        }
        
        if (operation === 'identity') {
            const size = document.getElementById('identity-size').value;
            if (!size || size <= 0) {
                throw new Error('Please enter a valid size');
            }
            payload.size = parseInt(size);
        }
        
        if (operation === 'zero') {
            const rows = document.getElementById('zero-rows').value;
            const cols = document.getElementById('zero-cols').value;
            if (!rows || !cols || rows <= 0 || cols <= 0) {
                throw new Error('Please enter valid dimensions');
            }
            payload.rows = parseInt(rows);
            payload.cols = parseInt(cols);
        }
        
        payload.stepByStep = stepByStepToggle.checked;
        
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        showLoading(false);
        resetCalculateButton();
        
        displayResult(data);
        
        sessionCalculations++;
        document.getElementById('session-counter').textContent = `${sessionCalculations} Calculated`;
        
    } catch (error) {
        showLoading(false);
        resetCalculateButton();
        showToast(error.message || 'Calculation error occurred', 'error');
        console.error('Error:', error);
    }
}

function resetCalculateButton() {
    calculateBtn.querySelector('.loading-spinner').style.display = 'none';
    calculateBtn.querySelector('span').textContent = 'Calculate Result';
    calculateBtn.disabled = false;
}

// ===== Display Result =====
function displayResult(data) {

    // Clear previous heatmap if exists
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }    

    const resultOutput = document.getElementById('result-output');
    const stepsOutput = document.getElementById('steps-output');
    const stepsTab = document.getElementById('steps-tab');
    
    resultSection.style.display = 'block';
    setTimeout(() => resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    
    if (data.status === 'error') {
        resultOutput.innerHTML = `
            <div class="empty-result-state">
                <i class="fas fa-exclamation-triangle" style="color: var(--error);"></i>
                <p style="color: var(--error); font-weight: 600;">${data.message}</p>
            </div>
        `;
        return;
    }
    
    if (data.result) {
        let html = `<h3 style="text-align: center; color: var(--steel-600); margin-bottom: 1.5rem; font-size: 1.25rem;">${data.operation}</h3>`;
        
        // Handle different result types
        if (typeof data.result === 'object' && data.result.L && data.result.U) {
            // LU Decomposition
            html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">';
            html += `<div><h4 style="color: var(--steel-600); text-align: center; margin-bottom: 1rem; font-weight: 700;">Lower Matrix (L)</h4>${renderMatrix(data.result.L)}</div>`;
            html += `<div><h4 style="color: var(--steel-600); text-align: center; margin-bottom: 1rem; font-weight: 700;">Upper Matrix (U)</h4>${renderMatrix(data.result.U)}</div>`;
            html += '</div>';
        } else if (typeof data.result === 'object' && data.result.L && !data.result.U) {
            // Cholesky Decomposition
            html += `<div><h4 style="color: var(--steel-600); text-align: center; margin-bottom: 1rem; font-weight: 700;">Lower Triangular Matrix (L)</h4>${renderMatrix(data.result.L)}</div>`;
        } else if (Array.isArray(data.result)) {
            if (data.result.length === 1 && data.result[0].length === 1) {
                // Single numeric value
                html += `<div class="scalar-result">${formatNumber(data.result[0][0])}</div>`;
            } else if (data.result.length === 1 && typeof data.result[0] === 'string') {
                // String result (Yes/No, dimensions, etc.)
                html += `<div class="scalar-result" style="font-size: 2rem;">${data.result[0]}</div>`;
            } else if (data.result.length === 2 && data.result[0].length === 1 && data.result[1].length === 1) {
                // Two eigenvalues
                html += `<div class="scalar-result" style="font-size: 1.5rem;">λ₁ = ${formatNumber(data.result[0][0])}<br>λ₂ = ${formatNumber(data.result[1][0])}</div>`;
            } else {
                // Matrix result
                html += renderMatrix(data.result);
            }
        } else if (typeof data.result === 'number') {
            // Direct numeric result (for covariance/correlation)
            html += `<div class="scalar-result">${formatNumber(data.result)}</div>`;
        }
        
        resultOutput.innerHTML = html;
        
        // Only create heatmap for matrix results
        if (Array.isArray(data.result) && data.result.length > 1 && Array.isArray(data.result[0]) && data.result[0].length > 1) {
            createHeatmap(data.result);
        }
    }
    
    // Display step-by-step if available
    if (data.steps && stepByStepToggle.checked) {
        stepsTab.style.display = 'flex';
        let stepsHtml = '<h3 style="color: var(--steel-600); margin-bottom: 1.5rem; font-size: 1.25rem;">Step-by-Step Solution</h3>';
        
        data.steps.forEach((step, index) => {
            stepsHtml += `
                <div class="step-item" style="animation-delay: ${index * 0.1}s;">
                    <h5>Step ${index + 1}: ${step.title}</h5>
                    <p>${step.description}</p>
                </div>
            `;
        });
        
        stepsOutput.innerHTML = stepsHtml;
    } else {
        stepsTab.style.display = 'none';
        stepsOutput.innerHTML = '';
    }
    
    if (data.status === 'success' && data.operation) {
        addToHistory(data.operation);
    }
    
    showToast('Calculation completed successfully!', 'success');
}

// ===== Render Matrix =====
function renderMatrix(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0) return '';
    
    let html = '<div style="overflow-x: auto;"><table style="margin: 1rem auto; border-collapse: separate; border-spacing: 10px;">';
    
    matrix.forEach((row, i) => {
        html += '<tr>';
        if (Array.isArray(row)) {
            row.forEach((value, j) => {
                html += `
                    <td style="
                        padding: 1rem 1.5rem;
                        background: white;
                        border: 2px solid var(--border-light);
                        border-radius: var(--radius-sm);
                        text-align: center;
                        font-weight: 700;
                        font-size: 1.125rem;
                        font-family: 'IBM Plex Mono', monospace;
                        color: var(--text-primary);
                        min-width: 80px;
                        box-shadow: var(--shadow-xs);
                        animation: scaleIn 0.4s ease;
                        animation-delay: ${(i * row.length + j) * 0.03}s;
                        animation-fill-mode: backwards;
                    ">
                        ${formatNumber(value)}
                    </td>
                `;
            });
        }
        html += '</tr>';
    });
    
    html += '</table></div>';
    return html;
}

function formatNumber(num) {
    // Handle null, undefined, NaN
    if (num == null || num !== num) return '0';
    
    // Handle strings
    if (typeof num === 'string') return num;
    
    // Handle numbers
    if (typeof num === 'number') {
        if (Number.isInteger(num)) return num.toString();
        const rounded = parseFloat(num.toFixed(6));
        return rounded.toString();
    }
    
    return String(num);
}

// ===== Heatmap Visualization =====
function createHeatmap(result) {
    if (!Array.isArray(result) || typeof result[0] === 'string') return;
    
    const canvas = document.getElementById('matrix-heatmap');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    const data = [];
    const labels = [];
    
    result.forEach((row, i) => {
        if (Array.isArray(row)) {
            row.forEach((value, j) => {
                if (typeof value === 'number') {
                    data.push({ x: j, y: i, v: value });
                }
                if (i === 0) labels.push(`Col ${j + 1}`);
            });
        }
    });
    
    if (data.length === 0) return;
    
    chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Matrix Values',
                data: data.map(d => ({ x: d.x, y: d.y })),
                backgroundColor: data.map(d => getHeatColor(d.v)),
                pointRadius: 25,
                pointHoverRadius: 30
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { 
                    type: 'linear',
                    position: 'bottom',
                    title: { display: true, text: 'Column Index' }
                },
                y: { 
                    type: 'linear',
                    reverse: true,
                    title: { display: true, text: 'Row Index' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `Value: ${formatNumber(data[context.dataIndex].v)}`
                    }
                }
            }
        }
    });
}

function getHeatColor(value) {
    if (typeof value !== 'number' || value !== value) return 'rgba(200, 200, 200, 0.5)';
    
    const intensity = Math.min(Math.abs(value) / 10, 1);
    if (value >= 0) {
        return `rgba(2, 132, 199, ${0.3 + intensity * 0.7})`;
    } else {
        return `rgba(239, 68, 68, ${0.3 + intensity * 0.7})`;
    }
}

// ===== History Management =====
function addToHistory(operationName) {
    const emptyHistory = historyList.querySelector('.history-empty-state');
    if (emptyHistory) {
        emptyHistory.remove();
    }
    
    historyCount++;
    const time = new Date().toLocaleTimeString();
    
    const li = document.createElement('li');
    li.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span><strong>${operationName}</strong> at ${time}</span>
    `;
    
    historyList.insertBefore(li, historyList.firstChild);
    
    if (historyList.children.length > 15) {
        historyList.removeChild(historyList.lastChild);
    }
}

function clearHistory() {
    historyList.innerHTML = `
        <li class="history-empty-state">
            <i class="fas fa-clock"></i>
            <span>No calculations performed yet</span>
        </li>
    `;
    historyCount = 0;
    showToast('History cleared', 'info');
}

window.clearHistory = clearHistory;

// ===== Tab Switching =====
function switchTab(tab) {
    document.querySelectorAll('.tab-panel').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.view-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${tab}-input`).classList.add('active');
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
}

function switchResultView(view) {
    document.querySelectorAll('.result-view').forEach(v => {
        v.classList.remove('active-result-view');
        v.style.display = 'none';
    });
    
    document.querySelectorAll('.result-view-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const viewMap = {
        'matrix': 'result-output',
        'heatmap': 'heatmap-view',
        'steps': 'steps-output'
    };
    
    const targetView = document.getElementById(viewMap[view]);
    if (targetView) {
        targetView.style.display = 'block';
        targetView.classList.add('active-result-view');
    }
    
    document.querySelector(`[data-view="${view}"]`).classList.add('active');
}

// ===== Examples =====
function loadExample(type) {
    const examples = {
        '2x2': { rows: 2, cols: 2, values: [[1, 2], [3, 4]] },
        '3x3': { rows: 3, cols: 3, values: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
        'identity': { rows: 2, cols: 2, values: [[1, 0], [0, 1]] },
        'symmetric': { rows: 3, cols: 3, values: [[1, 2, 3], [2, 4, 5], [3, 5, 6]] }
    };
    
    const example = examples[type];
    if (!example) return;
    
    document.getElementById('rows-A').value = example.rows;
    document.getElementById('cols-A').value = example.cols;
    generateMatrix('A');
    
    setTimeout(() => {
        fillMatrixWithValues('A', example.values);
        showToast(`Loaded ${type} example`, 'success');
        switchTab('manual');
    }, 100);
}

window.loadExample = loadExample;

// ===== Reset Application =====
function resetApp() {
    categorySelect.value = '';
    operationSelect.innerHTML = '<option value="">Select an operation...</option>';
    
    document.getElementById('rows-A').value = 2;
    document.getElementById('cols-A').value = 2;
    document.getElementById('rows-B').value = 2;
    document.getElementById('cols-B').value = 2;
    
    generateMatrix('A');
    
    document.getElementById('scalar-value').value = '';
    document.getElementById('identity-size').value = 3;
    document.getElementById('zero-rows').value = 3;
    document.getElementById('zero-cols').value = 3;
    
    document.getElementById('matrix-a-card').style.display = 'block';
    document.getElementById('matrix-b-card').style.display = 'none';
    document.getElementById('extra-input-section').style.display = 'none';
    resultSection.style.display = 'none';
    
    stepByStepToggle.checked = false;
    
    categoryBadge.textContent = 'Select Category';
    operationInfo.innerHTML = '<i class="fas fa-info-circle"></i><span>Select a category and operation to view details and begin calculation</span>';

    // Reset session counters and history
    sessionCalculations = 0;
    document.getElementById('session-counter').textContent = '0 Calculated';
    clearHistory();
    
    showToast('Application reset successfully', 'info');
}

// ===== Loading Overlay =====
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = show ? 'flex' : 'none';
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('.toast-icon');
    
    toast.classList.remove('show', 'success', 'error', 'warning', 'info');
    
    toastMessage.textContent = message;
    toast.classList.add(type);
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toastIcon.className = `toast-icon fas ${icons[type]}`;
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===== Keyboard Shortcuts =====
function handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        calculateBtn.click();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetBtn.click();
    }
}





