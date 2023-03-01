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
import { useToast } from "@chakra-ui/react"
import { ClusterEnvironment, IUser, MirrorWorld } from "@mirrorworld/web3.js";
import { MIRROR_WORLD_API_KEY } from "../utils/env";

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

  const toast = useToast()

  async function login() {
    if (!mirrorworld) throw new Error("Mirror World SDK is not initialized");
    const result = await mirrorworld.login();
    console.log("result", result);
    if (result.user) {
      setUser(result.user);
      localStorage.setItem(storageKey, result.refreshToken);
    }
  }

  function initialize() {
    if (!MIRROR_WORLD_API_KEY) {
      return toast({
        title: "Missing API Key",
        description: "Looks like you're missing a Mirror World API Key. Please create one on the developer dashboard https://app.mirrorworld.fun",
        position: "bottom"
      })
    }
    const refreshToken = localStorage.getItem(storageKey);
    const instance = new MirrorWorld({
      apiKey: MIRROR_WORLD_API_KEY,
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
