import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
}

interface AppState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toastQueue: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toastQueue: [],
  showToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ 
      toastQueue: [...state.toastQueue, { ...toast, id }] 
    }));
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      set((state) => ({ 
        toastQueue: state.toastQueue.filter((t) => t.id !== id) 
      }));
    }, 4000);
  },
  hideToast: (id) => set((state) => ({ 
    toastQueue: state.toastQueue.filter((t) => t.id !== id) 
  })),
}));
