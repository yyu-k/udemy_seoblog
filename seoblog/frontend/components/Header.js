'use client'

import React, { useEffect, useState } from 'react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
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
import {signout, getLocalStorageUser} from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { Search } from './Blog/Search';



const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const [user, setUser] = useState('');

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
    return (
      <>
      <NavItem>
        <NavLink style={{'cursor': 'pointer'}} onClick={() => {
          if (user.role === 1) {
            router.push('/admin/crud/blog');
          } else {
            router.push('/user/crud/blog');
          }
        }}>
        Create Blog
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink style={{'cursor': 'pointer'}} onClick={() => {
          if (user.role === 1) {
            router.push('/admin');
          } else {
            router.push('/user');
          }
        }}>
        Dashboard
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink style={{'cursor': 'pointer'}} onClick={() => signout(() => 
          router.replace('/signin') //prevents user from going back to the invalid signout page by backing
          )}>
        Sign Out
        </NavLink>
      </NavItem>
      </>
    )
  }

  useEffect(
    () => {
      function checkUserData(){
        const user = getLocalStorageUser();
        if (user) {
          setUser(user);
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
    <>
    <div>
        <ProgressBar
          height="4px"
          color="#0000FF"
          options={{ showSpinner: false }}
          shallowRouting
        />
      <Navbar expand={'md'}>
        <NewNavbarBrand href='/' name={APP_NAME}/>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            <NavItem>
              <NewNavLink href='/blogs' name="Blogs"/>
            </NavItem>
            <ShowSignInSignUp bool={!user}/>
            <ShowSignOut bool={user}/>
            <NavItem>
              <NewNavLink href="/contact" name="Contact"/>
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
          <NavbarText>{user.name}</NavbarText>
        </Collapse>
      </Navbar>
    </div>
    <Search/>
    </>
  );
}

export default Header;
