import React, {
  createContext,
  FunctionComponent,
  useEffect,
  useReducer,
} from "react";
import { getAuthState } from "./auth.actions";
import { authReducer, IAuthReducerAction, IAuthState, IUser } from "./auth.reducer";

export interface IAuthContextProps {
  state: IAuthState;
  dispatch: (action: IAuthReducerAction) => void;
}

export const AuthContext = createContext<IAuthContextProps>(
  {} as IAuthContextProps
);

const AuthContextProvider: FunctionComponent = (props) => {
  const [state, dispatch] = useReducer(authReducer, {
    authenticated: false,
    user: {} as IUser,
    loading: false
  });

  const value = { state, dispatch };

  useEffect(() => {
    getAuthState(dispatch);
  }, []);

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
