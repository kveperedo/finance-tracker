import { NavLink, useSubmit } from '@remix-run/react';
import { Menu, MenuTrigger } from 'react-aria-components';
import { LogOut, Menu as MenuIcon } from 'lucide-react';
import { cn } from '~/utils';
import Popover from './popover';
import Button from './button';
import { MenuItem } from './item';

export default function Header() {
    const submit = useSubmit();

    return (
        <header className="border-b border-stone-200 bg-white px-4 py-3 text-stone-800">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex gap-4">
                    <NavLink
                        className={({ isActive }) =>
                            cn('text-sm text-stone-500', isActive && 'font-semibold text-stone-800')
                        }
                        to="/expenses/summary"
                        prefetch="intent"
                    >
                        Expenses
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            cn('text-sm text-stone-500', isActive && 'font-semibold text-stone-800')
                        }
                        to="/investments"
                        prefetch="intent"
                    >
                        Investments
                    </NavLink>
                </div>

                <MenuTrigger>
                    <Button variant="tertiary" size="icon-sm">
                        <MenuIcon size={20} />
                    </Button>
                    <Popover className="w-40" placement="bottom end">
                        <Menu
                            className="p-2 text-sm outline-none"
                            onAction={(id) => {
                                if (id === 'logout') {
                                    submit(null, { method: 'post', action: '/logout' });
                                }
                            }}
                        >
                            <MenuItem id="logout" icon={<LogOut size={16} />}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Popover>
                </MenuTrigger>
            </div>
        </header>
    );
}
