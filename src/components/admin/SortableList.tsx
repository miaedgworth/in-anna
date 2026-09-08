"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { reorder, type OrderKind } from "@/app/admin/actions";

export type SortableItem = { id: string; content: React.ReactNode };

type Props = {
  kind: OrderKind;
  items: SortableItem[];
  emptyMessage: string;
};

/**
 * Reorderable list. Rows can be dragged with a mouse; the ↑ / ↓ buttons do the
 * same job on a phone, where HTML5 drag-and-drop is not available.
 */
export function SortableList({ kind, items, emptyMessage }: Props) {
  const [order, setOrder] = useState(items);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const router = useRouter();

  // Keep in step with the server after a create/delete re-render.
  useEffect(() => setOrder(items), [items]);

  function persist(next: SortableItem[]) {
    setOrder(next);
    startSaving(async () => {
      await reorder(
        kind,
        next.map((i) => i.id),
      );
      router.refresh();
    });
  }

  function moveBy(id: string, delta: number) {
    const from = order.findIndex((i) => i.id === id);
    const to = from + delta;
    if (from === -1 || to < 0 || to >= order.length) return;
    const next = [...order];
    [next[from], next[to]] = [next[to], next[from]];
    persist(next);
  }

  function dropOn(targetId: string) {
    if (!draggingId || draggingId === targetId) return;
    const from = order.findIndex((i) => i.id === draggingId);
    const to = order.findIndex((i) => i.id === targetId);
    if (from === -1 || to === -1) return;
    const next = [...order];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    persist(next);
  }

  if (order.length === 0) {
    return <p className="rounded-lg border border-dashed border-slate-300 p-6 text-slate-500">{emptyMessage}</p>;
  }

  return (
    <div aria-busy={saving}>
      <p className="sr-only" role="status">
        {saving ? "Saving order" : ""}
      </p>
      <ul className="space-y-3">
        {order.map((item, index) => (
          <li
            key={item.id}
            draggable
            onDragStart={() => setDraggingId(item.id)}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => dropOn(item.id)}
            className={`rounded-xl border border-slate-200 bg-white shadow-sm transition-opacity ${
              draggingId === item.id ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start gap-3 p-3 sm:p-4">
              <div className="flex shrink-0 flex-col items-center gap-1">
                <span
                  aria-hidden="true"
                  title="Drag to reorder"
                  className="cursor-grab select-none px-2 py-1 text-slate-400"
                >
                  ⠿
                </span>
                <button
                  type="button"
                  onClick={() => moveBy(item.id, -1)}
                  disabled={index === 0 || saving}
                  className="admin-icon-button"
                >
                  <span className="sr-only">Move up</span>
                  <span aria-hidden="true">↑</span>
                </button>
                <button
                  type="button"
                  onClick={() => moveBy(item.id, 1)}
                  disabled={index === order.length - 1 || saving}
                  className="admin-icon-button"
                >
                  <span className="sr-only">Move down</span>
                  <span aria-hidden="true">↓</span>
                </button>
              </div>

              <div className="min-w-0 flex-1">{item.content}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
