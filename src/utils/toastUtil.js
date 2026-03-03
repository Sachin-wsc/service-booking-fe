/**
 * Utility for displaying toast notifications
 * Usage: toastUtil.showSuccess(toastRef, 'Success', 'Operation completed')
 */

const toastUtil = {
  // Success Toast
  showSuccess: (toastRef, summary = 'Success', detail = 'Operation completed successfully', life = 3000) => {
    toastRef?.current?.show({
      severity: 'success',
      summary,
      detail,
      life,
    });
  },

  // Error Toast
  showError: (toastRef, summary = 'Error', detail = 'An error occurred', life = 4000) => {
    toastRef?.current?.show({
      severity: 'error',
      summary,
      detail,
      life,
    });
  },

  // Warning Toast
  showWarning: (toastRef, summary = 'Warning', detail = 'Please check the information', life = 3500) => {
    toastRef?.current?.show({
      severity: 'warn',
      summary,
      detail,
      life,
    });
  },

  // Info Toast
  showInfo: (toastRef, summary = 'Info', detail = 'Information', life = 3000) => {
    toastRef?.current?.show({
      severity: 'info',
      summary,
      detail,
      life,
    });
  },

  // Loading/Processing Toast (blue)
  showLoading: (toastRef, summary = 'Processing', detail = 'Please wait...', life = 0) => {
    toastRef?.current?.show({
      severity: 'info',
      summary,
      detail,
      life, // 0 means it stays until closed
      sticky: true,
    });
  },

  // Auth Success Messages
  showLoginSuccess: (toastRef, userName = 'User') => {
    toastUtil.showSuccess(toastRef, 'Login Successful', `Welcome back, ${userName}!`, 3000);
  },

  showSignupSuccess: (toastRef) => {
    toastUtil.showSuccess(toastRef, 'Account Created', 'Your account has been created! Redirecting to login...', 3000);
  },

  showProviderSignupSuccess: (toastRef) => {
    toastUtil.showSuccess(toastRef, 'Registration Successful', 'Your account has been created! Please log in and wait for admin approval.', 4000);
  },

  // Auth Error Messages
  showLoginError: (toastRef, error) => {
    const message = typeof error === 'string' ? error : error?.message || 'An error occurred during login';
    toastUtil.showError(toastRef, 'Login Failed', message, 4000);
  },

  showSignupError: (toastRef, error) => {
    const message = typeof error === 'string' ? error : error?.message || 'An error occurred during registration';
    toastUtil.showError(toastRef, 'Registration Failed', message, 4000);
  },

  // Action Messages
  showApproveSuccess: (toastRef, itemName = 'Item') => {
    toastUtil.showSuccess(toastRef, 'Approved', `${itemName} has been approved successfully!`, 3000);
  },

  showRejectSuccess: (toastRef, itemName = 'Item') => {
    toastUtil.showSuccess(toastRef, 'Rejected', `${itemName} has been rejected successfully!`, 3000);
  },

  showDeleteSuccess: (toastRef, itemName = 'Item') => {
    toastUtil.showSuccess(toastRef, 'Deleted', `${itemName} has been deleted successfully!`, 3000);
  },

  showUpdateSuccess: (toastRef, itemName = 'Item') => {
    toastUtil.showSuccess(toastRef, 'Updated', `${itemName} has been updated successfully!`, 3000);
  },

  showCreatedSuccess: (toastRef, itemName = 'Item') => {
    toastUtil.showSuccess(toastRef, 'Created', `${itemName} has been created successfully!`, 3000);
  },

  // Generic Action Error
  showActionError: (toastRef, action = 'Action', error) => {
    const message = typeof error === 'string' ? error : error?.message || `Failed to complete ${action}`;
    toastUtil.showError(toastRef, 'Operation Failed', message, 4000);
  },

  // Validation Error
  showValidationError: (toastRef, fieldName = 'Field') => {
    toastUtil.showWarning(toastRef, 'Validation Error', `${fieldName} is required or invalid`, 3500);
  },

  // Clear all toasts
  clearAll: (toastRef) => {
    toastRef?.current?.clear();
  },
};

export default toastUtil;
