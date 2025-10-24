// EU Cross-Border Helper - Interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links and step content areas
    const navLinks = document.querySelectorAll('.nav-link');
    const stepContents = document.querySelectorAll('.step-content');
    
    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target step from data attribute
            const targetStep = this.getAttribute('data-step');
            
            // Remove active class from all links
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all step contents
            stepContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show the target step content
            const targetContent = document.getElementById(targetStep);
            if (targetContent) {
                targetContent.style.display = 'block';
                
                // Add a subtle animation effect
                targetContent.style.opacity = '0';
                targetContent.style.transform = 'translateY(10px)';
                
                // Trigger animation after a brief delay
                setTimeout(() => {
                    targetContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    targetContent.style.opacity = '1';
                    targetContent.style.transform = 'translateY(0)';
                }, 50);
                
                // Update status tracker
                updateStatusTracker(targetStep);
            }
        });
    });
    
    // Add hover effects for better user experience
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            // Add a subtle scale effect on hover
            this.style.transform = 'translateX(2px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', function() {
            // Reset transform
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            const activeIndex = Array.from(navLinks).findIndex(link => 
                link.classList.contains('active')
            );
            
            let newIndex;
            if (e.key === 'ArrowDown') {
                newIndex = (activeIndex + 1) % navLinks.length;
            } else {
                newIndex = (activeIndex - 1 + navLinks.length) % navLinks.length;
            }
            
            navLinks[newIndex].click();
        }
    });
    
    // Initialize the first step as active
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
        updateStatusTracker('intake');
    }
    
    // Initialize intake persistence and context bar
    initializeIntakePersistence();
    updateContextBar();
    
    // Initialize tailored hints and progress tracking
    updateTailoredHints();
    updateProgressBar();
    
    // Initialize Get Advice panel
    initializeAdvicePanel();
    
    // Initialize contract workflow tracking
    initializeContractWorkflow();
    
    // Status Tracker Update Function
    function updateStatusTracker(currentStep) {
        const statusSteps = document.querySelectorAll('.status-step');
        const progressFill = document.querySelector('.status-progress-fill');
        const progressText = document.querySelector('.status-progress-text');
        
        // Reset all status steps
        statusSteps.forEach(step => {
            const statusElement = step.querySelector('.status-step-status');
            statusElement.textContent = 'Pending';
            statusElement.className = 'status-step-status pending';
        });
        
        // Update current step to in-progress
        const currentStatusStep = document.querySelector(`[data-step="${currentStep}"]`);
        if (currentStatusStep) {
            const statusElement = currentStatusStep.querySelector('.status-step-status');
            statusElement.textContent = 'In Progress';
            statusElement.className = 'status-step-status in-progress';
        }
        
        // Calculate progress (simplified - you can make this more sophisticated)
        const stepIndex = Array.from(navLinks).findIndex(link => 
            link.getAttribute('data-step') === currentStep
        );
        const progress = Math.round((stepIndex / (navLinks.length - 1)) * 100);
        
        // Update progress bar
        if (progressFill && progressText) {
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}% Complete`;
        }
    }
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .nav-link {
        transition: all 0.2s ease;
    }
`;
document.head.appendChild(style);

// Intake Persistence Functions
function initializeIntakePersistence() {
    // Save intake form data to localStorage
    const intakeForm = document.querySelector('.intake-form');
    if (intakeForm) {
        // Load existing data on page load
        loadIntakeData();
        
        // Save data when form changes
        intakeForm.addEventListener('input', function(e) {
            saveIntakeData();
        });
        
        intakeForm.addEventListener('change', function(e) {
            saveIntakeData();
        });
    }
}

function saveIntakeData() {
    const intakeData = {};
    
    // Company Setup
    intakeData.countryEstablishment = document.getElementById('country-establishment')?.value || 'BE';
    intakeData.hasFrEntity = document.getElementById('has-fr-entity')?.value || 'no';
    intakeData.organicCode = document.getElementById('organic-code')?.value || 'BE-BIO-001';
    intakeData.uses3pl = document.getElementById('uses-3pl')?.value || 'yes';
    intakeData.vatNumber = document.getElementById('vat-number')?.value || 'BE0123456789';
    intakeData.companyName = document.getElementById('company-name')?.value || 'BioTom Belgium BV';
    
    // Customer Information
    intakeData.buyerType = document.getElementById('buyer-type')?.value || 'fr-supermarkets';
    intakeData.customerName = document.getElementById('customer-name')?.value || 'Carrefour France';
    intakeData.customerVat = document.getElementById('customer-vat')?.value || 'FR12345678901';
    intakeData.businessModel = document.getElementById('business-model')?.value || 'fixed';
    
    // Product Information
    intakeData.productName = document.getElementById('product-name')?.value || 'Organic tomatoes';
    intakeData.productVariety = document.getElementById('product-variety')?.value || 'Cherry tomatoes';
    intakeData.quantity = document.getElementById('quantity')?.value || '1000 kg';
    intakeData.deliveryDate = document.getElementById('delivery-date')?.value || '2024-02-15';
    intakeData.packagingNotes = document.getElementById('packaging-notes')?.value || '500g clamshells, biodegradable packaging, EU organic certification labels';
    
    // Objectives and Contract Essentials
    intakeData.objectives = [];
    intakeData.contractEssentials = [];
    
    document.querySelectorAll('.checkbox-input').forEach(checkbox => {
        if (checkbox.checked) {
            const subsection = checkbox.closest('.subsection');
            if (subsection) {
                const title = subsection.querySelector('.subsection-title');
                if (title) {
                    if (title.textContent.includes('Priorities')) {
                        intakeData.objectives.push(checkbox.value);
                    } else if (title.textContent.includes('Essentials')) {
                        intakeData.contractEssentials.push(checkbox.value);
                    }
                }
            }
        }
    });
    
    localStorage.setItem('intakeData', JSON.stringify(intakeData));
    updateContextBar();
    updateTailoredHints();
    updateProgressBar();
}

function loadIntakeData() {
    const savedData = localStorage.getItem('intakeData');
    if (savedData) {
        const intakeData = JSON.parse(savedData);
        
        // Populate form fields
        Object.keys(intakeData).forEach(key => {
            const element = document.getElementById(key);
            if (element && element.type !== 'checkbox') {
                element.value = intakeData[key];
            }
        });
        
        // Handle checkboxes
        if (intakeData.objectives) {
            intakeData.objectives.forEach(objective => {
                const checkbox = document.querySelector(`input[value="${objective}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        if (intakeData.contractEssentials) {
            intakeData.contractEssentials.forEach(essential => {
                const checkbox = document.querySelector(`input[value="${essential}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    }
}

function updateContextBar() {
    const intakeData = JSON.parse(localStorage.getItem('intakeData') || '{}');
    
    // Update context pills with dynamic data
    const exporterPill = document.querySelector('[data-context="exporter"]');
    const entityPill = document.querySelector('[data-context="entity"]');
    const productPill = document.querySelector('[data-context="product"]');
    const logisticsPill = document.querySelector('[data-context="logistics"]');
    const buyerPill = document.querySelector('[data-context="buyer"]');
    const objectivesPill = document.querySelector('[data-context="objectives"]');
    
    if (exporterPill) {
        const country = intakeData.countryEstablishment || 'BE';
        exporterPill.textContent = `${country} exporter`;
    }
    
    if (entityPill) {
        const hasEntity = intakeData.hasFrEntity || 'no';
        entityPill.textContent = hasEntity === 'yes' ? 'Has FR entity' : 'No FR entity';
    }
    
    if (productPill) {
        const product = intakeData.productName || 'Organic tomatoes';
        productPill.textContent = product;
    }
    
    if (logisticsPill) {
        const uses3pl = intakeData.uses3pl || 'yes';
        logisticsPill.textContent = uses3pl === 'yes' ? '3PL' : 'Direct';
    }
    
    if (buyerPill) {
        const customer = intakeData.customerName || 'Carrefour France';
        buyerPill.textContent = `Buyer: ${customer}`;
    }
    
    if (objectivesPill) {
        const objectives = intakeData.objectives || ['protect-payment', 'minimize-fr-registrations'];
        const objectiveTexts = {
            'protect-payment': 'Protect payment',
            'minimize-fr-registrations': 'Minimize FR registration'
        };
        const displayObjectives = objectives.slice(0, 2).map(obj => objectiveTexts[obj] || obj).join(', ');
        objectivesPill.textContent = `Objectives: ${displayObjectives}`;
    }
}

// Get Advice Panel Functions
function initializeAdvicePanel() {
    // Add event listeners to Get Advice buttons
    const getAdviceButtons = document.querySelectorAll('.get-advice-btn');
    getAdviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = getCurrentStep();
            openAdvicePanel(currentStep);
        });
    });
    
    // Add event listener to close button
    const closeButton = document.getElementById('close-advice-panel');
    if (closeButton) {
        closeButton.addEventListener('click', closeAdvicePanel);
    }
    
    // Add event listener to overlay (click outside to close)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('advice-panel-overlay')) {
            closeAdvicePanel();
        }
    });
}

function getCurrentStep() {
    const activeLink = document.querySelector('.nav-link.active');
    return activeLink ? activeLink.getAttribute('data-step') : 'intake';
}

function openAdvicePanel(stepId) {
    const panel = document.getElementById('advice-panel');
    const overlay = document.querySelector('.advice-panel-overlay') || createOverlay();
    
    // Generate tailored advice message
    const adviceMessage = generateTailoredAdvice(stepId);
    document.getElementById('advice-message').innerHTML = adviceMessage;
    
    // Copy sources from current step
    copySourcesToPanel(stepId);
    
    // Show panel and overlay
    panel.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeAdvicePanel() {
    const panel = document.getElementById('advice-panel');
    const overlay = document.querySelector('.advice-panel-overlay');
    
    panel.classList.remove('open');
    if (overlay) {
        overlay.classList.remove('show');
    }
    document.body.style.overflow = '';
}

function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'advice-panel-overlay';
    document.body.appendChild(overlay);
    return overlay;
}

function generateTailoredAdvice(stepId) {
    const intakeData = getIntakeData();
    const conditions = checkIntakeConditions();
    
    let advice = '';
    
    switch (stepId) {
        case 'vat-check':
            advice = generateVatAdvice(intakeData, conditions);
            break;
        case 'contracts':
            advice = generateContractsAdvice(intakeData, conditions);
            break;
        case 'food-safety':
            advice = generateFoodSafetyAdvice(intakeData, conditions);
            break;
        case 'labeling':
            advice = generateLabelingAdvice(intakeData, conditions);
            break;
        case 'transport':
            advice = generateTransportAdvice(intakeData, conditions);
            break;
        default:
            advice = '<p>Welcome to the EU Cross-Border Helper! Complete the intake form to get personalized guidance for each step.</p>';
    }
    
    return advice;
}

function generateVatAdvice(intakeData, conditions) {
    let advice = '<p><strong>VAT Validation Advice:</strong></p><ul>';
    
    if (conditions.isFrSupermarketBuyer) {
        advice += '<li>Large retailers like Carrefour typically have valid VAT registrations, but always verify to protect your payment.</li>';
    }
    
    if (conditions.hasNoFrEntity) {
        advice += '<li>Since you have no French entity, valid customer VAT is crucial to avoid reverse charge complications.</li>';
    }
    
    if (conditions.hasProtectPaymentObjective) {
        advice += '<li>VAT validation is your first line of defense in payment protection - never skip this step.</li>';
    }
    
    advice += '<li>Use the official VIES system for real-time VAT validation across the EU.</li>';
    advice += '</ul>';
    
    return advice;
}

function generateContractsAdvice(intakeData, conditions) {
    let advice = '<p><strong>Contract Advice:</strong></p><ul>';
    
    if (conditions.hasProtectPaymentObjective) {
        advice += '<li>Focus on secure payment terms - consider advance payments or bank guarantees for new customers.</li>';
    }
    
    if (conditions.hasDefineLiabilityObjective) {
        advice += '<li>Set clear liability caps, especially important for organic products where quality issues can be costly.</li>';
    }
    
    if (conditions.isFrSupermarketBuyer) {
        advice += '<li>Large retailers often have standard terms - negotiate key points like payment terms and liability limits.</li>';
    }
    
    advice += '<li>Include bilingual clauses (French/English) to ensure clarity for both parties.</li>';
    advice += '</ul>';
    
    return advice;
}

function generateFoodSafetyAdvice(intakeData, conditions) {
    let advice = '<p><strong>Food Safety Advice:</strong></p><ul>';
    
    if (conditions.isOrganic) {
        advice += '<li>Your EU-BIO certification (BE-BIO-001) must be current and properly displayed on all products.</li>';
    }
    
    if (conditions.isFrSupermarketBuyer) {
        advice += '<li>Large retailers have strict certification requirements - ensure all documents are up to date.</li>';
    }
    
    if (conditions.hasEnsureComplianceObjective) {
        advice += '<li>Food safety compliance is non-negotiable - maintain detailed traceability records.</li>';
    }
    
    advice += '<li>Regularly check certification expiry dates and plan renewals well in advance.</li>';
    advice += '</ul>';
    
    return advice;
}

function generateLabelingAdvice(intakeData, conditions) {
    let advice = '<p><strong>Labeling Advice:</strong></p><ul>';
    
    if (conditions.isOrganic) {
        advice += '<li>EU organic logo and your operator code (BE-BIO-001) must be prominently displayed.</li>';
    }
    
    if (conditions.isFrSupermarketBuyer) {
        advice += '<li>French labels are required for the French market - ensure all mandatory information is in French.</li>';
    }
    
    advice += '<li>Include batch numbers and origin information for full traceability compliance.</li>';
    advice += '<li>Test label readability on your 500g clamshell packaging before production.</li>';
    advice += '</ul>';
    
    return advice;
}

function generateTransportAdvice(intakeData, conditions) {
    let advice = '<p><strong>Transport Advice:</strong></p><ul>';
    
    if (conditions.uses3pl) {
        advice += '<li>Coordinate closely with your 3PL provider to ensure proper documentation and timing.</li>';
    }
    
    if (conditions.isOrganic) {
        advice += '<li>Consider temperature-controlled transport for organic tomatoes to maintain quality.</li>';
    }
    
    if (conditions.isFrSupermarketBuyer) {
        advice += '<li>Large retailers expect detailed delivery documentation - ensure all paperwork is complete.</li>';
    }
    
    advice += '<li>Plan transport timing carefully to meet your delivery date of 2024-02-15.</li>';
    advice += '</ul>';
    
    return advice;
}

function copySourcesToPanel(stepId) {
    const sourcesList = document.getElementById('advice-sources-list');
    const currentStepSources = document.querySelector(`#${stepId} .sources-list`);
    
    if (currentStepSources && sourcesList) {
        sourcesList.innerHTML = '';
        const sourceLinks = currentStepSources.querySelectorAll('.source-link');
        
        sourceLinks.forEach(link => {
            const newLink = document.createElement('a');
            newLink.href = link.href;
            newLink.textContent = link.textContent;
            newLink.className = 'advice-source-link';
            sourcesList.appendChild(newLink);
        });
    }
}

// Contract Workflow Functions
function initializeContractWorkflow() {
    // Load saved workflow state
    loadWorkflowState();
    
    // Add event listeners to start step buttons
    const startStepButtons = document.querySelectorAll('.start-step-btn');
    startStepButtons.forEach(button => {
        button.addEventListener('click', function() {
            const stepNumber = this.getAttribute('data-step');
            startWorkflowStep(stepNumber);
        });
    });
}

function startWorkflowStep(stepNumber) {
    const stepElement = document.querySelector(`[data-step="${stepNumber}"]`);
    if (!stepElement) return;
    
    const statusBadge = stepElement.querySelector('.status-badge');
    const startButton = stepElement.querySelector('.start-step-btn');
    
    // Update status to in-progress
    statusBadge.textContent = 'In Progress';
    statusBadge.className = 'status-badge in-progress';
    stepElement.classList.add('in-progress');
    
    // Disable the start button
    startButton.disabled = true;
    startButton.textContent = 'In Progress...';
    
    // Save state
    saveWorkflowState();
    
    // Simulate step completion after a delay (in real app, this would be triggered by actual completion)
    setTimeout(() => {
        completeWorkflowStep(stepNumber);
    }, 3000);
}

function completeWorkflowStep(stepNumber) {
    const stepElement = document.querySelector(`[data-step="${stepNumber}"]`);
    if (!stepElement) return;
    
    const statusBadge = stepElement.querySelector('.status-badge');
    const startButton = stepElement.querySelector('.start-step-btn');
    
    // Update status to completed
    statusBadge.textContent = 'Completed';
    statusBadge.className = 'status-badge completed';
    stepElement.classList.remove('in-progress');
    stepElement.classList.add('completed');
    
    // Update button
    startButton.textContent = 'Completed';
    startButton.style.background = '#10b981';
    startButton.style.borderColor = '#10b981';
    
    // Enable next step if it exists
    const nextStepNumber = parseInt(stepNumber) + 1;
    const nextStepElement = document.querySelector(`[data-step="${nextStepNumber}"]`);
    if (nextStepElement) {
        const nextButton = nextStepElement.querySelector('.start-step-btn');
        if (nextButton && nextButton.disabled) {
            nextButton.disabled = false;
            nextButton.textContent = 'Start Step';
        }
    }
    
    // Save state
    saveWorkflowState();
}

function saveWorkflowState() {
    const workflowState = {};
    const steps = document.querySelectorAll('.workflow-step');
    
    steps.forEach(step => {
        const stepNumber = step.getAttribute('data-step');
        const statusBadge = step.querySelector('.status-badge');
        const status = statusBadge.textContent.toLowerCase().replace(' ', '-');
        
        workflowState[stepNumber] = {
            status: status,
            completed: step.classList.contains('completed'),
            inProgress: step.classList.contains('in-progress')
        };
    });
    
    localStorage.setItem('contractWorkflowState', JSON.stringify(workflowState));
}

function loadWorkflowState() {
    const savedState = localStorage.getItem('contractWorkflowState');
    if (!savedState) return;
    
    const workflowState = JSON.parse(savedState);
    
    Object.keys(workflowState).forEach(stepNumber => {
        const stepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (!stepElement) return;
        
        const state = workflowState[stepNumber];
        const statusBadge = stepElement.querySelector('.status-badge');
        const startButton = stepElement.querySelector('.start-step-btn');
        
        if (state.completed) {
            statusBadge.textContent = 'Completed';
            statusBadge.className = 'status-badge completed';
            stepElement.classList.add('completed');
            startButton.textContent = 'Completed';
            startButton.style.background = '#10b981';
            startButton.style.borderColor = '#10b981';
        } else if (state.inProgress) {
            statusBadge.textContent = 'In Progress';
            statusBadge.className = 'status-badge in-progress';
            stepElement.classList.add('in-progress');
            startButton.disabled = true;
            startButton.textContent = 'In Progress...';
        }
    });
}
