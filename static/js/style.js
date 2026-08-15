// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Display notification message
 */
function showNotification(message, type = 'success', duration = 3000) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '100px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.maxWidth = '400px';
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, duration);
}

/**
 * Format date to readable string
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

/**
 * Debounce function for better performance
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Get URL parameter by name
 */
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// ============================================
// FORM HANDLING
// ============================================

/**
 * Handle form submission with CSRF token
 */
function handleFormSubmit(formId, callback) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        fetch(this.action || window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCSRFToken()
            }
        })
        .then(response => response.json())
        .then(data => {
            if (callback) callback(data);
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred', 'error');
        });
    });
}

/**
 * Get CSRF token from cookie
 */
function getCSRFToken() {
    let csrfToken = '';
    const name = 'csrftoken';
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                csrfToken = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return csrfToken;
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate password strength
 */
function validatePasswordStrength(password) {
    const strength = {
        score: 0,
        feedback: []
    };
    
    if (password.length >= 8) strength.score++;
    else strength.feedback.push('At least 8 characters');
    
    if (/[a-z]/.test(password)) strength.score++;
    else strength.feedback.push('Lowercase letters');
    
    if (/[A-Z]/.test(password)) strength.score++;
    else strength.feedback.push('Uppercase letters');
    
    if (/[0-9]/.test(password)) strength.score++;
    else strength.feedback.push('Numbers');
    
    if (/[^a-zA-Z0-9]/.test(password)) strength.score++;
    else strength.feedback.push('Special characters');
    
    return strength;
}

// ============================================
// MODAL/DIALOG FUNCTIONS
// ============================================

/**
 * Open modal dialog
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close modal dialog
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/**
 * Show confirmation dialog
 */
function showConfirm(message, onConfirm, onCancel) {
    if (confirm(message)) {
        if (onConfirm) onConfirm();
    } else {
        if (onCancel) onCancel();
    }
}

// ============================================
// TABLE/DATA DISPLAY FUNCTIONS
// ============================================

/**
 * Sort table by column
 */
function sortTable(tableId, columnIndex) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        
        // Try to parse as numbers
        const aNum = parseFloat(aText);
        const bNum = parseFloat(bText);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
        }
        
        return aText.localeCompare(bText);
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * Filter table rows
 */
function filterTable(tableId, searchTerm) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

// ============================================
// UI INTERACTIONS
// ============================================

/**
 * Toggle element visibility
 */
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * Toggle class on element
 */
function toggleClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.toggle(className);
    }
}

/**
 * Add active state to navigation links
 */
function setActiveNavLink() {
    const currentLocation = location.pathname;
    const menuItems = document.querySelectorAll('.nav-link');
    
    menuItems.forEach(item => {
        if (item.href.includes(currentLocation)) {
            item.classList.add('active');
        }
    });
}

/**
 * Handle smooth scrolling
 */
function smoothScroll(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// CHART/PROGRESS FUNCTIONS
// ============================================

/**
 * Update progress circle
 */
function updateProgressCircle(percentage) {
    const circle = document.querySelector('.progress-bar');
    if (circle) {
        const circumference = 282.6;
        const offset = circumference * (1 - percentage / 100);
        circle.style.strokeDashoffset = offset;
    }
}

/**
 * Animate number counter
 */
function animateCounter(elementId, targetValue, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const startTime = Date.now();
    
    function updateCounter() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    updateCounter();
}

// ============================================
// STORAGE FUNCTIONS
// ============================================

/**
 * Store data in localStorage
 */
function storeData(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error storing data:', error);
        return false;
    }
}

/**
 * Retrieve data from localStorage
 */
function retrieveData(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error retrieving data:', error);
        return defaultValue;
    }
}

/**
 * Remove data from localStorage
 */
function removeData(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing data:', error);
        return false;
    }
}

/**
 * Clear all localStorage
 */
function clearAllData() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing data:', error);
        return false;
    }
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Generic API call function
 */
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        }
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(endpoint, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

/**
 * GET request
 */
async function apiGet(endpoint) {
    return apiCall(endpoint, 'GET');
}

/**
 * POST request
 */
async function apiPost(endpoint, data) {
    return apiCall(endpoint, 'POST', data);
}

/**
 * PUT request
 */
async function apiPut(endpoint, data) {
    return apiCall(endpoint, 'PUT', data);
}

/**
 * DELETE request
 */
async function apiDelete(endpoint) {
    return apiCall(endpoint, 'DELETE');
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page initialized');
    
    // Set active nav link
    setActiveNavLink();
    
    // Close alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        if (!alert.querySelector('input, button')) {
            setTimeout(() => {
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }, 5000);
        }
    });
    
    // Add smooth scroll to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                smoothScroll(href.substring(1));
            }
        });
    });
});

/**
 * Handle page unload
 */
window.addEventListener('beforeunload', function(e) {
    // Save any unsaved data
    const formData = retrieveData('formDraft');
    if (formData) {
        storeData('formDraft', formData);
    }
});

// ============================================
// LOGGING/DEBUG
// ============================================

/**
 * Log message (development only)
 */
function log(message, data = null) {
    if (window.DEBUG) {
        console.log(`[Log] ${message}`, data || '');
    }
}

/**
 * Log warning (development only)
 */
function logWarning(message, data = null) {
    if (window.DEBUG) {
        console.warn(`[Warning] ${message}`, data || '');
    }
}

/**
 * Log error (always)
 */
function logError(message, data = null) {
    console.error(`[Error] ${message}`, data || '');
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        formatDate,
        debounce,
        getQueryParam,
        getCSRFToken,
        validateEmail,
        validatePasswordStrength,
        openModal,
        closeModal,
        showConfirm,
        sortTable,
        filterTable,
        toggleElement,
        toggleClass,
        setActiveNavLink,
        smoothScroll,
        updateProgressCircle,
        animateCounter,
        storeData,
        retrieveData,
        removeData,
        clearAllData,
        apiCall,
        apiGet,
        apiPost,
        apiPut,
        apiDelete
    };
}
