import toast from 'react-hot-toast';

class ToastService {
  success(message: string) {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
    });
  }

  error(message: string) {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
    });
  }

  info(message: string) {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: 'ℹ️',
    });
  }

  warning(message: string) {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      icon: '⚠️',
    });
  }
}

export const toastService = new ToastService();
