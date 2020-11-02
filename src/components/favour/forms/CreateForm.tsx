import React from "react";
import { RewardListProvider } from "hooks/useRewardList";
import { useRouter } from "next/router";
import OweForm from "./OweFormContent";
import OwingForm from "./OwingFormContent";

const CreateForm: React.FC = () => {
  const router = useRouter();

  return (
    <RewardListProvider>
      {router.query.type === "owing" ? <OwingForm /> : <OweForm />}
    </RewardListProvider>
  );
};

export default CreateForm;
