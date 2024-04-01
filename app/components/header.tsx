import { NavLink, useSubmit } from '@remix-run/react';
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import { LogOut, Menu as MenuIcon } from 'lucide-react';
import { cn } from '~/utils';

export default function Header() {
    const submit = useSubmit();

    return (
        <header className="bg-black px-4 py-4 text-white">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex gap-4">
                    <NavLink
                        className={({ isActive }) => cn(isActive && 'text-lime-400 underline')}
                        to="/expenses"
                        prefetch="intent">
                        Expenses
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => cn(isActive && 'text-lime-400 underline')}
                        to="/investments"
                        prefetch="intent">
                        Investments
                    </NavLink>
                </div>

                <MenuTrigger>
                    <Button className="p-1 transition-colors data-[hovered]:bg-stone-900">
                        <MenuIcon size={20} />
                    </Button>
                    <Popover
                        className={({ isEntering, isExiting }) =>
                            cn(
                                'w-40 border border-black bg-white ring-1 ring-black/10 drop-shadow-lg',
                                isEntering && 'duration-200 ease-out animate-in fade-in',
                                isExiting && 'duration-150 ease-in animate-out fade-out'
                            )
                        }
                        placement="bottom end">
                        <Menu
                            autoFocus="first"
                            onAction={(id) => {
                                if (id === 'logout') {
                                    submit(null, { method: 'post', action: '/logout' });
                                }
                            }}>
                            <MenuItem
                                className="flex cursor-pointer items-center p-2 transition-colors data-[hovered]:bg-stone-100"
                                id="logout">
                                <LogOut className="mr-2" size={20} />
                                Logout
                            </MenuItem>
                        </Menu>
                    </Popover>
                </MenuTrigger>
            </div>
        </header>
    );
}
