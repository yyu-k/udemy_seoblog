'use client'

import React, { useEffect, useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from 'reactstrap';
import {APP_NAME} from '../config';
import {NewNavLink, NewNavbarBrand} from './NavBarLinks';
import {signout} from '@/actions/auth';
import { useRouter } from 'next/navigation';

const Header = () => {

  const ShowSignInSignUp = ({bool}) => {
    if (!bool) {
      return
    }
    return (
      <>
      <NavItem>
        <NewNavLink href='/signin' name='Sign In'/>
      </NavItem>
      <NavItem>
        <NewNavLink href='/signup' name='Sign Up'/>
      </NavItem>  
      </>
    )
  }
  
  const ShowSignOut = ({bool}) => {
    if (!bool) {
      return 
    }
    const router = useRouter();
    return (
      <NavItem>
        <NavLink style={{'cursor': 'pointer'}} onClick={() => signout(() => 
          router.replace('/signin') //prevents user from going back to the invalid signout page by backing
          )}>
        Sign Out
        </NavLink>
      </NavItem>
    )
  }

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [user, setUser] = useState('');
  useEffect(
    () => {
      function checkUserData(){
        const item = window.localStorage.getItem('user');
        if (item) {
          setUser(JSON.parse(item).name);
        } else {
          setUser('');
        };
      }
    checkUserData(); //in case of refresh/new user tab
    window.addEventListener("storage", checkUserData);
    return () => {
      window.removeEventListener("storage", checkUserData);
    };
  }, []);
  
  return (
    <div>
      <Navbar expand={'md'}>
        <NewNavbarBrand href='/' name={APP_NAME}/>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <ShowSignInSignUp bool={!user}/>
            <ShowSignOut bool={user}/>
            <NavItem>
              <NavLink href="https://github.com/reactstrap/reactstrap">
                GitHub
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <NavbarText>{user}</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;
