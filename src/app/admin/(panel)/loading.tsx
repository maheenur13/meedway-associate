import { Card, Skeleton } from "antd";

/**
 * Shown while an admin segment loads. Every page under (panel) is
 * force-dynamic — correct, since the admin must never show cached rows — so
 * each navigation waits on a DB round-trip. This is the route-level fallback;
 * AdminShell separately shows a progress bar for client-side transitions.
 */
export default function AdminLoading() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Skeleton active title={{ width: 220 }} paragraph={{ rows: 1, width: [320] }} />
      </div>
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    </div>
  );
}
