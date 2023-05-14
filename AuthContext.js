import { createContext, useReducer, useContext } from 'react';

const AuthContext = createContext();

function authReducer(state, action) {
  switch (action.type) {
    case 'signIn': {
      return { ...state, isAuthenticated: true };
    }
    case 'signOut': {
      return { ...state, isAuthenticated: false };
    }
    case 'validateSignUp': {
      return { ...state, isSignUpValidated: true };
    }
    case 'invalidateSignUp': {
      return { ...state, isSignUpValidated: false };
    }
    case 'signOutAndInvalidateSignUp': {
      return { isAuthenticated: false, isSignUpValidated: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    isSignUpValidated: false,
  });
  const value = { state, dispatch };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
