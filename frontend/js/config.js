const API_BASE_URL = '/api';

const API_ENDPOINTS = {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    
    tvs: `${API_BASE_URL}/tvs`,
    tvById: (id) => `${API_BASE_URL}/tvs/${id}`,
    tvReview: (id) => `${API_BASE_URL}/tvs/${id}/review`,
    deleteReview: (tvId, reviewId) => `${API_BASE_URL}/tvs/${tvId}/review/${reviewId}`,
    updateReview: (tvId, reviewId) => `${API_BASE_URL}/tvs/${tvId}/review/${reviewId}`,
    tvStock: (id) => `${API_BASE_URL}/tvs/${id}/stock`,
    tvBrandsStats: `${API_BASE_URL}/tvs/stats/brands`,
    
    orders: `${API_BASE_URL}/orders`,
    myOrders: `${API_BASE_URL}/orders/my`,
    cancelOrder: (id) => `${API_BASE_URL}/orders/${id}/cancel`,
    updateOrderStatus: (id) => `${API_BASE_URL}/orders/${id}/status`,
    orderStats: `${API_BASE_URL}/orders/stats/sales`,
    
    salesStats: `${API_BASE_URL}/stats/sales`
};

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}

function isLoggedIn() {
    return !!getAuthToken();
}

function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function formatPrice(price) {
    return `$${price.toLocaleString()}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}