import { Heading, Spinner, Stack } from "@chakra-ui/core";
import Layout from "./Layout";

const Loader: React.FC = () => (
  <Layout title="Loading..." mt={48}>
    <Stack w="full" direction="column" spacing={6} align="center">
      <Heading size="xl" fontWeight="medium">
        Loading...
      </Heading>
      <Spinner size="xl" speed="1s" thickness="4px" />
    </Stack>
  </Layout>
);

export default Loader;
