import { createContext, useContext } from 'react'

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  isAdmin: false,
  signOut: async () => {},
  loading: false,
})

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        session: null,
        profile: null,
        isAdmin: false,
        loading: false,
        signOut: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
