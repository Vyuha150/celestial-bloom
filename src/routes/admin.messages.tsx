import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, RotateCcw, Trash2, Mail } from "lucide-react";
import { listMessages, setMessageHandled, deleteMessage } from "@/admin/api";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesAdmin,
});

function MessagesAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin", "messages"], queryFn: listMessages });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
  const handledMut = useMutation({
    mutationFn: ({ id, handled }: { id: string; handled: boolean }) => setMessageHandled(id, handled),
    onSuccess: invalidate,
  });
  const deleteMut = useMutation({ mutationFn: (id: string) => deleteMessage(id), onSuccess: invalidate });

  const remove = (id: string) => {
    if (!confirm("Delete this message? This can't be undone.")) return;
    deleteMut.mutate(id);
  };

  const messages = data?.messages ?? [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-eyebrow">Inbox</p>
        <h1 className="text-display text-4xl mt-1">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sent through the site's Contact page.{" "}
          {data ? `${data.unhandled} waiting for a reply, ${messages.length} in total.` : ""}
        </p>
      </div>

      {error && <p role="alert" className="text-sm text-rose-400">Failed to load messages.</p>}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : messages.length === 0 ? (
        <div className="border border-border bg-midnight/40 py-16 text-center text-sm text-muted-foreground">
          No messages yet. They'll appear here when someone uses the Contact page.
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m._id} className={`border bg-midnight/40 p-5 ${m.handled ? "border-border opacity-70" : "border-gold/30"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm">
                    {m.name} <span className="text-muted-foreground">· {m.email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(m.createdAt).toLocaleString()}
                    {m.handled && " · Handled"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Your message to Celestial"}`)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border hover:bg-midnight"
                  >
                    <Mail className="size-3.5" /> Reply
                  </a>
                  <button
                    onClick={() => handledMut.mutate({ id: m._id, handled: !m.handled })}
                    disabled={handledMut.isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border hover:bg-midnight disabled:opacity-50"
                  >
                    {m.handled ? <RotateCcw className="size-3.5" /> : <Check className="size-3.5 text-gold" />}
                    {m.handled ? "Reopen" : "Mark handled"}
                  </button>
                  <button
                    onClick={() => remove(m._id)}
                    aria-label={`Delete message from ${m.name}`}
                    title="Delete"
                    className="p-1.5 hover:bg-midnight border border-transparent hover:border-border"
                  >
                    <Trash2 className="size-3.5 text-rose-400" />
                  </button>
                </div>
              </div>
              {m.subject && <p className="mt-3 text-sm text-gold">{m.subject}</p>}
              <p className="mt-2 text-sm text-foreground/85 whitespace-pre-wrap break-words">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
