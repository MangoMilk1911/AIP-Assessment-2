import React from "react";
import NextLink, { LinkProps } from "next/link";
import {
  Box,
  Button,
  Container,
  Flex,
  Spacer,
  Heading,
  ButtonProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
  MenuDivider,
} from "@chakra-ui/core";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAuth } from "lib/auth";

/**
 * Navbar Item
 */
type NavItemProps = LinkProps & ButtonProps;

const NavItem: React.FC<NavItemProps> = ({ children, href, ...restProps }) => (
  <NextLink href={href}>
    <Button
      variant="unstyled"
      mr={10}
      fontSize={15}
      color={useColorModeValue("primary.900", "primary.50")}
      _hover={{
        color: useColorModeValue("primary.500", "primary.200"),
      }}
      {...restProps}
    >
      {children}
    </Button>
  </NextLink>
);

/**
 * Navbar Drop Down Menu
 */
const NavDropDown = () => {
  const { user, signOut } = useAuth();

  if (!user) return <NavItem href="/login">Sign In</NavItem>;

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon boxSize={6} />}
        variant="ghost"
        color={useColorModeValue("primary.900", "primary.50")}
      >
        {user.displayName}
      </MenuButton>
      <MenuList>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuDivider />
        <MenuItem onClick={signOut}>Sign Out</MenuItem>
      </MenuList>
    </Menu>
  );
};

/**
 * Header
 */
const Header: React.FC = () => {
  return (
    <Container maxW="lg">
      <Flex as="nav" justifyContent="space-between" alignItems="center" py={4}>
        <NavItem href="/">
          <Heading size="md">Pinky</Heading>
        </NavItem>
        <NavItem href="/requests">Requests</NavItem>
        <NavItem href="/favours">Favours</NavItem>
        <NavItem href="/leaderboard">Leaderboard</NavItem>

        <Spacer />

        <NavDropDown />
      </Flex>
    </Container>
  );
};

export default Header;
