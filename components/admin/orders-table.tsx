import { OrderStatusBadge } from "@/components/ui/badge";
import { formatCents } from "@/lib/money/format";

export type OperationalOrder = {
  id: string;
  buyer: string;
  status: "pending_payment" | "delivered";
  total_cents: number;
};

export function OrdersTable({ orders }: { orders: OperationalOrder[] }) {
  return (
    <div>
      <div className="hidden md:block overflow-x-auto border border-line bg-surface">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <caption className="sr-only">Pedidos para moderação</caption>
          <thead>
            <tr className="border-b border-line">
              <th
                scope="col"
                className="sticky left-0 bg-surface px-3 py-2 font-semibold"
              >
                Pedido
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Comprador
              </th>
              <th scope="col" className="px-3 py-2 font-semibold">
                Situação
              </th>
              <th scope="col" className="px-3 py-2 text-right font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-line last:border-b-0"
              >
                <th
                  scope="row"
                  className="sticky left-0 bg-surface px-3 py-2 font-semibold"
                >
                  {order.id}
                </th>
                <td className="px-3 py-2">{order.buyer}</td>
                <td className="px-3 py-2">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-3 py-2 text-right">
                  {formatCents(order.total_cents)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 md:hidden">
        {orders.map((order) => (
          <li
            key={order.id}
            className="grid gap-2 border border-line bg-surface p-3"
          >
            <p>
              <span className="text-ink-soft">Pedido </span>
              <span className="font-semibold">{order.id}</span>
            </p>
            <p>
              <span className="text-ink-soft">Comprador </span>
              {order.buyer}
            </p>
            <p>
              <span className="text-ink-soft">Situação </span>
              <OrderStatusBadge status={order.status} />
            </p>
            <p>
              <span className="text-ink-soft">Total </span>
              {formatCents(order.total_cents)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
