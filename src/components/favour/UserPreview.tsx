import { Avatar, Stack, Text } from "@chakra-ui/core";
import { UserSchema } from "models/User";

interface UserPreviewProps {
  user: UserSchema;
}

const UserPreview: React.FC<UserPreviewProps> = ({ user }) => (
  <Stack direction="row" align="center" spacing={4}>
    <Avatar src={user.photoURL} name={user.displayName} />
    <Text fontSize="2xl" fontWeight="bold">
      {user.displayName}
    </Text>
  </Stack>
);

export default UserPreview;
