// API service for handling backend requests

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Base API request function with error handling
const apiRequest = async <T>(url: string, options: RequestInit): Promise<T> => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `Request failed with status ${response.status}`
    );
  }

  return response.json();
};

// Helper to set cookies
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
};

// Helper to delete cookies
const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};

// Authentication services
export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    // Store token in both localStorage and cookies for middleware
    localStorage.setItem("authToken", response.token);
    setCookie("authToken", response.token);

    return response;
  },

  // Register user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Store token in both localStorage and cookies for middleware
    localStorage.setItem("authToken", response.token);
    setCookie("authToken", response.token);

    return response;
  },

  // Get current user with token
  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return null;
    }

    try {
      return apiRequest<User>("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },

  // Logout (client-side only)
  logout: (): void => {
    localStorage.removeItem("authToken");
    deleteCookie("authToken");
  },
};

// Event services can be added here
