import { Container, ContainerProps } from "@chakra-ui/core";
import Head from "next/head";

interface LayoutProps {
  title?: string;
}

const Layout: React.FC<LayoutProps & ContainerProps> = ({
  title,
  maxW = "lg",
  children,
  ...restProps
}) => (
  <>
    {title && (
      <Head>
        <title>Pinki | {title}</title>
      </Head>
    )}

    <Container maxW={maxW} flexGrow={1} {...restProps}>
      {children}
    </Container>
  </>
);

export default Layout;
