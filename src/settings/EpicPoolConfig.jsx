import { useEffect, useState } from "react";
import { ArrowLeft, Inbox, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Alert, Button, Card, Dialog, DropdownMenu, EmptyState, Input, PageHeader, Switch, Table, Toast } from "@hc1com/design-system";
import { ConfirmDialog, PageTemplate } from "@hc1com/design-system/patterns";
import { deleteEpicPool, getEpicPools, saveEpicPool, togglePoolActive } from "../lib/notifyStores";

/** Add or edit one message pool. `pool` is null for a new one. */
function PoolDialog({ pool, pools, onClose, onSaved }) {
  const [form, setForm] = useState({ name: pool?.name ?? "", poolId: pool?.poolId ?? "", active: pool?.active ?? true });
  const [error, setError] = useState("");
  const set = patch => { setForm(f => ({ ...f, ...patch })); setError(""); };

  const save = () => {
    if (!form.name.trim() || !form.poolId.trim()) { setError("Pool name and Epic pool ID are required."); return; }
    const dup = pools.find(p => p.poolId.toLowerCase() === form.poolId.trim().toLowerCase() && p.id !== pool?.id);
    if (dup) { setError(`A pool with ID "${form.poolId.trim()}" already exists.`); return; }
    saveEpicPool({ id: pool?.id, name: form.name.trim(), poolId: form.poolId.trim(), active: form.active });
    onSaved(pool ? "Pool updated" : "Pool added");
  };

  return (
    <Dialog open onOpenChange={o => { if (!o) onClose(); }}>
      <Dialog.Content size="sm">
        <Dialog.Header>
          <Dialog.Title>{pool ? "Edit message pool" : "Add message pool"}</Dialog.Title>
          <Dialog.Description>Active pools are offered as recipients in the Notify step.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-16 [&>*]:shrink-0">
          {error && (
            <Alert variant="danger"><Alert.Description>{error}</Alert.Description></Alert>
          )}
          <Input label="Pool name" required placeholder="For example, Anemia Optimization" value={form.name} onChange={e => set({ name: e.target.value })} fullWidth />
          <Input label="Epic pool ID" required placeholder="For example, ANEMIA-OPT" value={form.poolId} onChange={e => set({ poolId: e.target.value })} fullWidth />
          <Switch checked={form.active} onCheckedChange={active => set({ active })}>Active</Switch>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Actions>
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button variant="default" size="sm" onClick={save}>{pool ? "Save changes" : "Add pool"}</Button>
          </Dialog.Actions>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

/** Client configuration: the Epic message pools the Notify step can send to. */
export function EpicPoolConfig({ onBack }) {
  const [pools, setPools] = useState(() => getEpicPools());
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = new, pool = edit
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const refresh = () => setPools(getEpicPools());
    window.addEventListener("epic-pools-updated", refresh);
    return () => window.removeEventListener("epic-pools-updated", refresh);
  }, []);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const refresh = () => setPools(getEpicPools());

  return (
    <PageTemplate>
      <PageHeader
        breadcrumb={<Button variant="link" size="sm" className="px-0" onClick={onBack}><ArrowLeft /> Back to worklist</Button>}
        title="Epic message pools"
        subtitle="Add, edit and deactivate the pools offered as recipients in the Notify step"
        actions={<Button variant="default" size="sm" onClick={() => setEditing(null)}><Plus /> Add pool</Button>}
      />

      <Card variant="default" density="comfortable">
        {pools.length === 0 ? (
          <EmptyState variant="default" layout="contained">
            <EmptyState.Icon><Inbox /></EmptyState.Icon>
            <EmptyState.Title>No pools configured</EmptyState.Title>
            <EmptyState.Description>Add a pool so care teams can be notified through Epic.</EmptyState.Description>
            <EmptyState.Actions><Button variant="default" size="sm" onClick={() => setEditing(null)}><Plus /> Add pool</Button></EmptyState.Actions>
          </EmptyState>
        ) : (
          <Table density="relaxed">
            <Table.Content>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Pool name</Table.Head>
                  <Table.Head>Epic pool ID</Table.Head>
                  <Table.Head width={160}>Status</Table.Head>
                  <Table.Head width={64}><span className="sr-only">Actions</span></Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {pools.map(pool => (
                  <Table.Row key={pool.id}>
                    <Table.Cell className="font-medium">{pool.name}</Table.Cell>
                    <Table.Cell className="tabular-nums">{pool.poolId}</Table.Cell>
                    <Table.Cell truncate={false}>
                      <Switch size="sm" checked={pool.active} onCheckedChange={() => { togglePoolActive(pool.id); refresh(); }}>
                        {pool.active ? "Active" : "Inactive"}
                      </Switch>
                    </Table.Cell>
                    <Table.Cell truncate={false} className="text-right">
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${pool.name}`}><MoreHorizontal /></Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content size="sm" align="end">
                          <DropdownMenu.Item onSelect={() => setEditing(pool)}><Pencil /> Edit</DropdownMenu.Item>
                          <DropdownMenu.Item destructive onSelect={() => setDeleting(pool)}><Trash2 /> Delete</DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table>
        )}
      </Card>

      <p className="text-12 text-[color:var(--hc-color-text-supporting)]">
        Inactive pools are hidden from the Notify step but stay in the audit history.
      </p>

      {editing !== undefined && (
        <PoolDialog
          pool={editing}
          pools={pools}
          onClose={() => setEditing(undefined)}
          onSaved={msg => { setEditing(undefined); refresh(); setToast(msg); }}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={o => { if (!o) setDeleting(null); }}
        variant="destructive"
        title={`Delete ${deleting?.name ?? "pool"}?`}
        description="The pool is removed from the Notify step. Messages already sent keep their history."
        confirmLabel="Delete pool"
        onConfirm={() => { deleteEpicPool(deleting.id); setDeleting(null); refresh(); setToast("Pool deleted"); }}
        onCancel={() => setDeleting(null)}
      />
      {toast && (
        <div className="fixed right-24 bottom-24 z-[var(--hc-z-toast)]">
          <Toast variant="success" onDismiss={() => setToast("")}><Toast.Title>{toast}</Toast.Title></Toast>
        </div>
      )}
    </PageTemplate>
  );
}
