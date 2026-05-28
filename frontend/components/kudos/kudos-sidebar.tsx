import { SidebarStats } from './sidebar-stats';
import { SidebarRecipients } from './sidebar-recipients';

export function KudosSidebar() {
  return (
    <aside className="flex flex-col gap-6 rounded-xl border border-white/10 bg-white/5 p-5 h-fit sticky top-4">
      <SidebarStats />
      <hr className="border-white/10" />
      <SidebarRecipients />
    </aside>
  );
}
