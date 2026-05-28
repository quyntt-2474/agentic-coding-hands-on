'use client';

import { use } from 'react';
import { KudosDetailModal } from '@/components/kudos/kudos-detail-modal';

export default function KudosDetailIntercepted({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <KudosDetailModal id={id} />;
}
