// Direct URL access fallback: /kudos/[id]
// Shows the live board with the modal forced open
import { use } from 'react';
import KudosPage from '@/app/kudos/page';
import { KudosDetailModal } from '@/components/kudos/kudos-detail-modal';

export default function KudosDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <>
      <KudosPage />
      <KudosDetailModal id={id} />
    </>
  );
}
