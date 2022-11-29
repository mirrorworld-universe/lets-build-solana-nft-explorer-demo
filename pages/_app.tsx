import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { MirrorWorldProvider } from "../hooks/useMirrorWorld";
import "@fontsource/space-grotesk";

export const theme = extendTheme({
  fonts: {
    body: `'Space Grotesk', sans-serif;`,
    heading: `'Space Grotesk', sans-serif;`,
  },
  config: {
    initialColorMode: "dark",
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <MirrorWorldProvider>
        <Component {...pageProps} />
      </MirrorWorldProvider>
    </ChakraProvider>
  );
}
