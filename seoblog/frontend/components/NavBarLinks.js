import Link from 'next/link';
import {NavLink, NavbarBrand} from 'reactstrap';
import React from 'react';

export const NewNavLink = ({href, name}) => {
    return (
    <Link href={href} passHref legacyBehavior>
        <NavLink>{name}</NavLink>
    </Link>
    )
}

const CustomNavbarBrand = React.forwardRef(({href, name}, ref) => {
    return (
      <NavbarBrand href={href}>
        {name}
      </NavbarBrand>
    )
  })

export const NewNavbarBrand = ({href, name}) => {
    return (
    <Link href={href} passHref legacyBehavior>
        <CustomNavbarBrand name={name}/>
    </Link>
    )
}

