"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import { api } from "@/lib/api";
import { confirmAction } from "@/lib/confirm";
import { RENTAL_UNIT, ROLE_LABELS } from "@/lib/constants";
import { formatDate, formatMoney } from "@/lib/format";
import { useApi } from "@/lib/use-api";
import Avatar from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";
import { EmptyState, ErrorState, Spinner } from "@/components/ui";
import { DataTable, PageHeader, Person } from "./parts";

export function AllUsers({ currentUserId }) {
  const { data, loading, error, reload, setData } = useApi("/users");
  const [busyId, setBusyId] = useState("");
  const [search, setSearch] = useState("");

  const changeRole = async (user, role) => {
    if (role === user.role) return;
    setBusyId(user.id);
    try {
      const updated = await api(`/users/${user.id}/role`, { method: "PATCH", body: { role } });
      setData((current) => current.map((row) => (row.id === user.id ? updated : row)));
      toast.success(`${user.name} is now ${ROLE_LABELS[role].toLowerCase()}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId("");
    }
  };

  const remove = async (user) => {
    const ok = await confirmAction({
      title: "Delete this user?",
      text: `${user.name} (${user.email}) will lose access to their account. This cannot be undone.`,
      confirmText: "Yes, delete user",
    });
    if (!ok) return;
    setBusyId(user.id);
    try {
      await api(`/users/${user.id}`, { method: "DELETE" });
      setData((current) => current.filter((row) => row.id !== user.id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId("");
    }
  };

  const term = search.trim().toLowerCase();
  const rows = (data || []).filter((user) => !term || user.name?.toLowerCase().includes(term) || user.email.toLowerCase().includes(term));

  return (
    <>
      <PageHeader title="All Users" text="Everyone registered on the platform. Change roles or remove accounts.">
        <label className="input input-bordered input-sm flex w-full items-center gap-2 sm:w-64">
          <FiSearch className="size-4 text-base-content/50" />
          <span className="sr-only">Search users</span>
          <input type="search" className="grow" placeholder="Search name or email" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
      </PageHeader>

      {loading ? (
        <Spinner label="Loading users" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !rows.length ? (
        <EmptyState title="No users found" text="Try a different name or email." />
      ) : (
        <DataTable columns={["Name", "Email", "Role", "Registration date", "Change role", "Manage"]}>
          {rows.map((user) => {
            const isSelf = user.id === currentUserId;
            return (
              <tr key={user.id}>
                <td>
                  <div className="flex min-w-44 items-center gap-3">
                    <Avatar name={user.name} image={user.image} size="sm" />
                    <span className="font-semibold">
                      {user.name} {isSelf && <span className="text-xs font-normal text-base-content/50">(you)</span>}
                    </span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <StatusBadge status={user.role} />
                </td>
                <td className="whitespace-nowrap">{formatDate(user.createdAt)}</td>
                <td>
                  <select
                    className="select select-bordered select-sm w-32"
                    value={user.role}
                    disabled={isSelf || busyId === user.id}
                    onChange={(event) => changeRole(user, event.target.value)}
                    aria-label={`Role for ${user.name}`}
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button type="button" className="btn btn-outline btn-error btn-xs" disabled={isSelf || busyId === user.id} onClick={() => remove(user)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </DataTable>
      )}
    </>
  );
}

const STATUS_TABS = ["all", "pending", "approved", "rejected"];

export function AllEquipment() {
  const { data, loading, error, reload, setData } = useApi("/equipment/admin/all");
  const [busyId, setBusyId] = useState("");
  const [tab, setTab] = useState("all");

  const setStatus = async (item, status) => {
    setBusyId(item._id);
    try {
      const updated = await api(`/equipment/${item._id}/status`, { method: "PATCH", body: { status } });
      setData((current) => current.map((row) => (row._id === item._id ? updated : row)));
      toast.success(`${item.name} ${status}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId("");
    }
  };

  const remove = async (item) => {
    const ok = await confirmAction({
      title: "Delete this equipment?",
      text: `${item.name} will be removed from the site. This cannot be undone.`,
      confirmText: "Yes, delete it",
    });
    if (!ok) return;
    setBusyId(item._id);
    try {
      await api(`/equipment/${item._id}`, { method: "DELETE" });
      setData((current) => current.filter((row) => row._id !== item._id));
      toast.success("Equipment deleted");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId("");
    }
  };

  const rows = (data || []).filter((item) => tab === "all" || item.status === tab);
  const count = (status) => (data || []).filter((item) => status === "all" || item.status === status).length;

  return (
    <>
      <PageHeader title="All Equipment" text="Approve or reject listings, and update or delete any item." />

      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {STATUS_TABS.map((status) => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={tab === status}
            onClick={() => setTab(status)}
            className={`btn btn-sm capitalize ${tab === status ? "btn-primary" : "btn-outline"}`}
          >
            {status} ({count(status)})
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading equipment" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !rows.length ? (
        <EmptyState title="No equipment here" text="There are no listings with this status." />
      ) : (
        <DataTable columns={["Equipment", "Owner", "Category", "Rental price", "Quantity", "Status", "Actions"]}>
          {rows.map((item) => (
            <tr key={item._id}>
              <td>
                <div className="flex min-w-52 items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                  <span className="font-semibold">{item.name}</span>
                </div>
              </td>
              <td>
                <Person name={item.owner?.name} email={item.owner?.email} />
              </td>
              <td className="whitespace-nowrap">{item.category}</td>
              <td className="whitespace-nowrap font-semibold">
                {formatMoney(item.price)} / {RENTAL_UNIT[item.rentalType]}
              </td>
              <td>{item.availableQuantity}</td>
              <td>
                <StatusBadge status={item.status} />
              </td>
              <td>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-success btn-xs" disabled={item.status === "approved" || busyId === item._id} onClick={() => setStatus(item, "approved")}>
                    Approve
                  </button>
                  <button type="button" className="btn btn-warning btn-xs" disabled={item.status === "rejected" || busyId === item._id} onClick={() => setStatus(item, "rejected")}>
                    Reject
                  </button>
                  <Link href={`/dashboard/equipment/${item._id}/edit`} className="btn btn-outline btn-xs">
                    Update
                  </Link>
                  <button type="button" className="btn btn-outline btn-error btn-xs" disabled={busyId === item._id} onClick={() => remove(item)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
