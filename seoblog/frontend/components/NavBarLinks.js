import Link from 'next/link';
import {NavLink, NavbarBrand} from 'reactstrap';

export const NewNavLink = ({href, name}) => {
    return (
    <Link href={href} passHref legacyBehavior>
        <NavLink>{name}</NavLink>
    </Link>
    )
}

export const NewNavbarBrand = ({href, name}) => {
    return (
    <Link href={href} passHref legacyBehavior>
        <NavbarBrand>{name}</NavbarBrand>
    </Link>
    )
}