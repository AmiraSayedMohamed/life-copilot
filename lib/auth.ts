export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  avatar?: string
  bio?: string
  phone?: string
  timezone?: string
  preferences?: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    emailUpdates: boolean
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Simple client-side auth using localStorage (can be upgraded to real backend later)
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const user = users.find((u: any) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid email or password")
    }

    const { password: _, ...userWithoutPassword } = user
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
    return userWithoutPassword
  },

  signup: async (email: string, password: string, name: string): Promise<User> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem("users") || "[]")

    if (users.find((u: any) => u.email === email)) {
      throw new Error("User already exists")
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = newUser
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
    return userWithoutPassword
  },

  logout: () => {
    localStorage.removeItem("currentUser")
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === userId)

    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates }
    localStorage.setItem("users", JSON.stringify(users))

    // Update current user if it's the same user
    const currentUser = authService.getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      const { password: _, ...userWithoutPassword } = users[userIndex]
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword))
      return userWithoutPassword
    }

    const { password: _, ...userWithoutPassword } = users[userIndex]
    return userWithoutPassword
  },

  changePassword: async (userId: string, currentPassword: string, newPassword: string): Promise<void> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const userIndex = users.findIndex((u: any) => u.id === userId)

    // Debug logging
    console.log("[DEBUG] changePassword called", { userId, currentPassword, newPassword, userIndex, users })

    if (userIndex === -1) {
      console.error("[DEBUG] User not found", { userId })
      throw new Error("User not found")
    }

    if (users[userIndex].password !== currentPassword) {
      console.error("[DEBUG] Current password mismatch", { entered: currentPassword, stored: users[userIndex].password })
      throw new Error("Current password is incorrect")
    }

    users[userIndex].password = newPassword
    localStorage.setItem("users", JSON.stringify(users))
    console.log("[DEBUG] Password updated successfully", { userId })
  },
}
