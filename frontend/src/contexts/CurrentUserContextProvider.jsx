import { useEffect, useState } from 'react';
import CurrentUserContext from './current-user-context';
import { checkForLoggedInUser } from "../adapters/auth-adapter.js";
import { getUser } from "../adapters/user-adapter.js";
import { getOrganization } from "../adapters/organization-adapter.js";

export default function CurrentUserContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); 
  const [isOrganization, setIsOrganization] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const context = { currentUser, setCurrentUser, isOrganization, setIsOrganization, isAuthLoading };

  const getAccount = async () => {
    setIsAuthLoading(true);
    const [org, id] = await checkForLoggedInUser();
    if (id === -1) {
      setIsOrganization(false);
      setIsAuthLoading(false);
      return setCurrentUser(null);
    }
    if (org) {
      setIsOrganization(true);
      const [organization] = await getOrganization(id);
      setIsAuthLoading(false);
      return setCurrentUser(organization);
    }
    setIsOrganization(false);
    const [user] = await getUser(id);
    setIsAuthLoading(false);
    return setCurrentUser(user);
  };
  
  useEffect(() => {
    getAccount();
  },[])

  return (
    <CurrentUserContext.Provider value={ context }>
      {children}
    </CurrentUserContext.Provider>
  );
}
