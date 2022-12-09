/**
 * Return
 * - user
 * - mirrorworld
 * - login function
 */
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { ClusterEnvironment, IUser, MirrorWorld } from "@mirrorworld/web3.js";

export interface IMirrorWorldContext {
  user?: IUser;
  mirrorworld: MirrorWorld;
  login(): Promise<void>;
}

const MirrorWorldContext = createContext<IMirrorWorldContext>(
  {} as IMirrorWorldContext
);

export function useMirrorWorld() {
  return useContext(MirrorWorldContext);
}

const storageKey = `explorer_dapp_refresh_token`;

export const MirrorWorldProvider = ({ children }: { children: ReactNode }) => {
  const [mirrorworld, setMirrorworld] = useState<MirrorWorld>();
  const [user, setUser] = useState<IUser>();
  const isInitialized = useRef(false);

  async function login() {
    if (!mirrorworld) throw new Error("Mirror World SDK is not initialized");
    const result = await mirrorworld.login();
    if (result.user) {
      setUser(result.user);
      localStorage.setItem(storageKey, result.refreshToken);
    }
  }

  function initialize() {
    const refreshToken = localStorage.getItem(storageKey);
    const instance = new MirrorWorld({
      apiKey: "mw_lOquhiJd8VSQas6fY3Q42f5pjKMbkUE6rqt",
      env: ClusterEnvironment.mainnet,
      ...(refreshToken && { autoLoginCredentials: refreshToken }),
    });

    instance.on("auth:refreshToken", async (refreshToken) => {
      if (refreshToken) {
        localStorage.setItem(storageKey, refreshToken);
        const user = await instance.fetchUser();
        setUser(user);
      }
    });

    setMirrorworld(instance);
  }

  useEffect(() => {
    if (!isInitialized.current) {
      initialize();
    }

    return () => {
      isInitialized.current = true;
    };
  }, []);

  return (
    <MirrorWorldContext.Provider
      value={{
        mirrorworld: mirrorworld as MirrorWorld,
        user,
        login,
      }}
    >
      {children}
    </MirrorWorldContext.Provider>
  );
};
