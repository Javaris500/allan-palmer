import { AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";

type FailureRow = {
  id: string;
  action: string;
  createdAt: Date;
  metadata: Record<string, unknown> | null;
};

function formatStage(action: string): string {
  return action.replace(/^photo\.upload_failed\./, "").replace(/_/g, " ");
}

function formatTime(d: Date): string {
  const diffMs = Date.now() - d.getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export async function UploadFailuresPanel() {
  let rows: FailureRow[] = [];
  try {
    rows = (await prisma.adminAction.findMany({
      where: { action: { startsWith: "photo.upload_failed." } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, action: true, createdAt: true, metadata: true },
    })) as FailureRow[];
  } catch {
    return null;
  }

  if (rows.length === 0) return null;

  return (
    <section className="rounded-xl border border-destructive/40 bg-destructive/[0.06] p-5">
      <header className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <h2 className="font-serif text-sm font-bold text-destructive">
          Recent upload failures
        </h2>
        <span className="text-[11px] text-destructive/70 ml-auto">
          most recent first
        </span>
      </header>
      <ul className="space-y-2 text-xs">
        {rows.map((row) => {
          const meta = row.metadata ?? {};
          const message = typeof meta.message === "string" ? meta.message : "(no message)";
          const fileName = typeof meta.fileName === "string" ? meta.fileName : null;
          const fileType = typeof meta.fileType === "string" ? meta.fileType : null;
          const fileSize = typeof meta.fileSize === "number" ? meta.fileSize : null;
          const placement = typeof meta.placement === "string" ? meta.placement : null;
          return (
            <li
              key={row.id}
              className="rounded-md border border-destructive/20 bg-background/40 px-3 py-2"
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <span className="font-medium text-destructive uppercase tracking-wider text-[10px]">
                  {formatStage(row.action)}
                </span>
                <span className="text-muted-foreground text-[11px]">
                  {formatTime(row.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-foreground/80 break-words">{message}</p>
              {(fileName || fileType || fileSize !== null || placement) && (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {fileName && <span>{fileName}</span>}
                  {fileType && <span> · {fileType}</span>}
                  {fileSize !== null && (
                    <span> · {(fileSize / 1024 / 1024).toFixed(1)} MB</span>
                  )}
                  {placement && <span> · placement: {placement}</span>}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
