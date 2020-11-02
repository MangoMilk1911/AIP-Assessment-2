import React from "react";
import { useRouter } from "next/router";
import { Heading, Select, Stack, Text } from "@chakra-ui/core";
import Layout from "components/layout/Layout";
import WithAuth from "components/WithAuth";
import CreateForm from "components/favour/forms/CreateForm";

const Create: React.FC = () => {
  const router = useRouter();
  const { type: formType } = router.query;

  // Swap out form depending on favour type
  const changeFormType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push({
      query: { type: e.target.value },
    });
  };

  return (
    <Layout title="Add Favour" maxW="sm" mt={16}>
      <Stack spacing={8}>
        {/* Heading */}
        <Heading size="2xl" textAlign="center">
          Create Favour
        </Heading>

        {/* Change Form Type */}
        <Stack spacing={4}>
          <Text>Type of Favour</Text>

          <Select value={formType} onChange={changeFormType}>
            <option value="owing">You Owe Someone 😥</option>
            <option value="owed">Someone Owes You 😁</option>
          </Select>
        </Stack>

        {/* Form */}
        <CreateForm />
      </Stack>
    </Layout>
  );
};

export default WithAuth(Create);
