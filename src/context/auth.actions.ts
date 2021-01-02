import { AuthService } from "../api/auth";
import {
  IUserLogin,
  AuthAction,
  AuthError,
  IAuthReducerAction,
} from "./auth.reducer";

const authService = new AuthService();

export async function loginUser(
  dispatch: (action: IAuthReducerAction) => void,
  loginPayload: IUserLogin
) {
  dispatch({ type: AuthAction.REQUEST_LOGIN });
  authService
    .login(loginPayload)
    .then((email) => {
      dispatch({
        type: AuthAction.SUCCESS_LOGIN,
        payload: { user: email },
      });
    })
    .catch(() => {
      dispatch({
        type: AuthAction.ERROR_LOGIN,
        payload: { error: AuthError.CANNOT_LOGIN },
      });
    });
}

export async function logout(dispatch: (action: IAuthReducerAction) => void) {
  authService.logout();
  dispatch({ type: AuthAction.LOGOUT });
}

export async function getAuthState(
  dispatch: (action: IAuthReducerAction) => void
) {
  const data = authService.getLocalAuthState();
  if (data) {
    dispatch({ type: AuthAction.SUCCESS_LOGIN, payload: data });
  }
}

export async function resetAuthContext(
  dispatch: (action: IAuthReducerAction) => void
) {
  dispatch({ type: AuthAction.RESET_CTX });
}
