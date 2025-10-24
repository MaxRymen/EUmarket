// EU Cross-Border Helper - Utility Functions

// Get intake data from localStorage
function getIntakeData() {
    const savedData = localStorage.getItem('intakeData');
    return savedData ? JSON.parse(savedData) : {};
}

// Check if specific conditions are met based on intake data
function checkIntakeConditions() {
    const intakeData = getIntakeData();
    
    return {
        isFrSupermarketBuyer: intakeData.buyerType === 'fr-supermarkets',
        hasNoFrEntity: intakeData.hasFrEntity === 'no',
        isOrganic: intakeData.productName && intakeData.productName.toLowerCase().includes('organic'),
        uses3pl: intakeData.uses3pl === 'yes',
        hasProtectPaymentObjective: intakeData.objectives && intakeData.objectives.includes('protect-payment'),
        hasMinimizeFrRegistrationsObjective: intakeData.objectives && intakeData.objectives.includes('minimize-fr-registrations'),
        hasEnsureComplianceObjective: intakeData.objectives && intakeData.objectives.includes('ensure-compliance'),
        hasDefineLiabilityObjective: intakeData.objectives && intakeData.objectives.includes('define-liability')
    };
}

// Show/hide tailored hints based on intake conditions
function updateTailoredHints() {
    const conditions = checkIntakeConditions();
    
    // Update VAT Check hints
    updateVatCheckHints(conditions);
    
    // Update Contracts hints
    updateContractsHints(conditions);
    
    // Update Food Safety hints
    updateFoodSafetyHints(conditions);
    
    // Update Labeling hints
    updateLabelingHints(conditions);
    
    // Update Transport hints
    updateTransportHints(conditions);
}

function updateVatCheckHints(conditions) {
    const guidanceList = document.querySelector('#vat-check .guidance-list');
    if (!guidanceList) return;
    
    const hints = guidanceList.querySelectorAll('li');
    
    // Show/hide hints based on conditions
    hints.forEach(hint => {
        const text = hint.textContent.toLowerCase();
        
        if (text.includes('french supermarkets') && !conditions.isFrSupermarketBuyer) {
            hint.style.display = 'none';
        } else if (text.includes('no fr entity') && conditions.hasNoFrEntity) {
            hint.style.display = 'block';
        } else if (text.includes('protect payment') && conditions.hasProtectPaymentObjective) {
            hint.style.display = 'block';
        } else if (text.includes('minimize fr registrations') && conditions.hasMinimizeFrRegistrationsObjective) {
            hint.style.display = 'block';
        } else {
            hint.style.display = 'block';
        }
    });
}

function updateContractsHints(conditions) {
    const guidanceList = document.querySelector('#contracts .guidance-list');
    if (!guidanceList) return;
    
    const hints = guidanceList.querySelectorAll('li');
    
    hints.forEach(hint => {
        const text = hint.textContent.toLowerCase();
        
        if (text.includes('protect payment') && !conditions.hasProtectPaymentObjective) {
            hint.style.display = 'none';
        } else if (text.includes('carrefour france') && !conditions.isFrSupermarketBuyer) {
            hint.style.display = 'none';
        } else if (text.includes('organic') && !conditions.isOrganic) {
            hint.style.display = 'none';
        } else if (text.includes('liability') && !conditions.hasDefineLiabilityObjective) {
            hint.style.display = 'none';
        } else {
            hint.style.display = 'block';
        }
    });
}

function updateFoodSafetyHints(conditions) {
    const guidanceList = document.querySelector('#food-safety .guidance-list');
    if (!guidanceList) return;
    
    const hints = guidanceList.querySelectorAll('li');
    
    hints.forEach(hint => {
        const text = hint.textContent.toLowerCase();
        
        if (text.includes('organic') && !conditions.isOrganic) {
            hint.style.display = 'none';
        } else if (text.includes('carrefour') && !conditions.isFrSupermarketBuyer) {
            hint.style.display = 'none';
        } else if (text.includes('compliance') && !conditions.hasEnsureComplianceObjective) {
            hint.style.display = 'none';
        } else {
            hint.style.display = 'block';
        }
    });
}

function updateLabelingHints(conditions) {
    const guidanceList = document.querySelector('#labeling .guidance-list');
    if (!guidanceList) return;
    
    const hints = guidanceList.querySelectorAll('li');
    
    hints.forEach(hint => {
        const text = hint.textContent.toLowerCase();
        
        if (text.includes('organic') && !conditions.isOrganic) {
            hint.style.display = 'none';
        } else if (text.includes('carrefour') && !conditions.isFrSupermarketBuyer) {
            hint.style.display = 'none';
        } else {
            hint.style.display = 'block';
        }
    });
}

function updateTransportHints(conditions) {
    const guidanceList = document.querySelector('#transport .guidance-list');
    if (!guidanceList) return;
    
    const hints = guidanceList.querySelectorAll('li');
    
    hints.forEach(hint => {
        const text = hint.textContent.toLowerCase();
        
        if (text.includes('3pl') && !conditions.uses3pl) {
            hint.style.display = 'none';
        } else if (text.includes('organic') && !conditions.isOrganic) {
            hint.style.display = 'none';
        } else if (text.includes('carrefour') && !conditions.isFrSupermarketBuyer) {
            hint.style.display = 'none';
        } else {
            hint.style.display = 'block';
        }
    });
}

// Calculate step completion percentage
function calculateStepCompletion(stepId) {
    const stepContent = document.getElementById(stepId);
    if (!stepContent) return 0;
    
    let totalFields = 0;
    let completedFields = 0;
    
    // Count form fields in the step
    const inputs = stepContent.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type !== 'hidden' && !input.readOnly) {
            totalFields++;
            if (input.value && input.value.trim() !== '') {
                completedFields++;
            }
        }
    });
    
    // Count checkboxes
    const checkboxes = stepContent.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        totalFields++;
        if (checkbox.checked) {
            completedFields++;
        }
    });
    
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
}

// Calculate overall progress
function calculateOverallProgress() {
    const steps = ['intake', 'vat-check', 'contracts', 'food-safety', 'labeling', 'transport'];
    let totalProgress = 0;
    
    steps.forEach(stepId => {
        totalProgress += calculateStepCompletion(stepId);
    });
    
    return Math.round(totalProgress / steps.length);
}

// Update progress bar
function updateProgressBar() {
    const overallProgress = calculateOverallProgress();
    const progressFill = document.querySelector('.status-progress-fill');
    const progressText = document.querySelector('.status-progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${overallProgress}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${overallProgress}% Complete`;
    }
}
