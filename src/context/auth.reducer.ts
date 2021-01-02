export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUser {
  id: string;
  email: string;
  // role: UserRole;
  enabled: boolean;
  //settings: IUserSettings;
}

export interface IAuthState {
  authenticated: boolean;
  user?: IUser;
  loading: boolean;
  error?: any;
}

export enum AuthError {
  SERVER_ERROR = "SERVER_ERROR",
  BAD_CREDENTIALS = "BAD_CREDENTIALS",
  CANNOT_LOGIN = "CANNOT_LOGIN",
}

export interface IAuthReducerAction {
  type: AuthAction;
  payload?: { user: any } | { error: any };
  error?: AuthError;
}

export enum AuthAction {
  REQUEST_LOGIN = "REQUEST_LOGIN",
  SUCCESS_LOGIN = "SUCCESS_LOGIN",
  ERROR_LOGIN = "ERROR_LOGIN",
  LOGOUT = "LOGOUT",
  RESET_CTX = "RESET_CTX",
}

/**
 * The reducer for the AuthContext. The actions available for this reducer are
 * defined in the AuthAction enum.
 */
export const authReducer = (
  prevState: IAuthState,
  action: IAuthReducerAction
): IAuthState => {
  switch (action.type) {
    case AuthAction.RESET_CTX:
      return {
        ...prevState,
        error: undefined,
      };
    case AuthAction.REQUEST_LOGIN:
      return {
        ...prevState,
        loading: true,
      };
    case AuthAction.SUCCESS_LOGIN:
      if (!action.payload || !("user" in action.payload))
        throw new Error("Payload is empty or doesn't contain the user key");
      return {
        ...prevState,
        user: action.payload!.user,
        authenticated: true,
        loading: false,
      };
    case AuthAction.LOGOUT:
      return {
        ...prevState,
        user: undefined,
        authenticated: false,
      };
    case AuthAction.ERROR_LOGIN:
      if (!action.payload || !("error" in action.payload))
        throw new Error("Payload is empty or doesn't contain the error key");
      return {
        ...prevState,
        loading: false,
        error: action.payload!.error,
      };
    default:
      throw Error(`Unhandled action type for authReducer: ${action.type}`);
  }
};
