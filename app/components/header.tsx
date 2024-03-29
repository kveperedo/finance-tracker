import { Link, NavLink } from '@remix-run/react';
import { cn } from '~/utils';

export default function Header() {
    return (
        <header className="bg-black px-4 py-4 text-white">
            <div className="container mx-auto flex items-center justify-between">
                <Link className="flex-1" to="/expenses" prefetch="intent">
                    Finance Tracker
                </Link>

                <div className="flex gap-4">
                    <NavLink
                        className={({ isActive }) =>
                            cn(isActive && 'text-lime-400 underline')
                        }
                        to="/expenses"
                        prefetch="intent">
                        Expenses
                    </NavLink>
                    <NavLink
                        className={({ isActive }) =>
                            cn(isActive && 'text-lime-400 underline')
                        }
                        to="/investments"
                        prefetch="intent">
                        Investments
                    </NavLink>
                </div>
            </div>
        </header>
    );
}
