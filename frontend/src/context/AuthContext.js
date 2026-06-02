import React, {
  createContext,
  useContext,
  useState
} from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [admin, setAdmin] = useState(null);

  const login = async (email, password) => {

    if (
      email === 'admin@vison.pt' &&
      password === 'Admin@1234'
    ) {

      const fakeAdmin = {
        nome: 'Administrador',
        email: 'admin@vison.pt',
        role: 'admin'
      };

      localStorage.setItem(
        'vison_admin',
        JSON.stringify(fakeAdmin)
      );

      setAdmin(fakeAdmin);

      return fakeAdmin;
    }

    throw new Error('Credenciais inválidas');
  };

  const logout = () => {
    localStorage.removeItem('vison_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        login,
        logout,
        loading: false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);