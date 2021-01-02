import { IUserLogin } from "../context/auth.reducer";
import Firebase from "../firebase.config";
import { StorageKey, StorageService } from "./storage";

export class AuthService {
  storage: StorageService;
  firebase: Firebase;

  constructor() {
    this.storage = new StorageService();
    this.firebase = new Firebase();
  }

  getLocalAuthState() {
    const user = this.storage.get(StorageKey.user);
    if (user) {
      return { user };
    }
  }
  async login(cred: IUserLogin) {
    return new Promise((res, rej) => {
      this.firebase.auth
        .signInWithEmailAndPassword(cred.email, cred.password)
        .then((o) => {
          if ("user" in o) {
            this.storage.save({ email: o.user?.email }, StorageKey.user);
            res(o.user?.email);
          }
        })
        .catch(() => {
          rej(false);
        });
    });
  }

  async logout() {
    this.storage.deleteAll();
  }
}
