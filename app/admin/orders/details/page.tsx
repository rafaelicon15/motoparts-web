import { Suspense } from 'react';
import OrderDetailsClient from './OrderDetailsClient';

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-64 items-center justify-center text-sm font-semibold text-slate-500">Cargando pedido…</div>}>
      <OrderDetailsClient />
    </Suspense>
  );
}
