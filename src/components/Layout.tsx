import { Outlet } from 'react-router';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="flex flex-col w-screen min-h-screen m-0 p-0 bg-[rgb(var(--color-bg))]">
      <Header />
      <main className="flex-1 w-full pt-[72px] m-0 p-0">
        <Outlet />
      </main>
    </div>
  );
}