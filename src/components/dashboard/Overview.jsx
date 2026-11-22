"use client";

import Link from "next/link";
import {
  FiBox,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiDollarSign,
  FiHeart,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { useApi } from "@/lib/use-api";
import { formatMoney } from "@/lib/format";
import { ErrorState, Spinner } from "@/components/ui";
import { PageHeader, Panel, StatCard } from "./parts";
import { BookingsRevenueChart, CountBarChart, MoneyAreaChart, SharePieChart } from "./charts";

function AdminOverview({ data }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total users" value={data.totalUsers} Icon={FiUsers} />
        <StatCard label="Total equipment" value={data.totalEquipment} Icon={FiBox} tone="info" />
        <StatCard label="Total bookings" value={data.totalBookings} Icon={FiClipboard} tone="secondary" />
        <StatCard label="Pending approvals" value={data.pendingApprovals} Icon={FiClock} tone="warning" />
        <StatCard label="Completed rentals" value={data.completedRentals} Icon={FiCheckCircle} tone="success" />
        <StatCard label="Total revenue" value={formatMoney(data.totalRevenue)} Icon={FiDollarSign} tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Monthly bookings and revenue" text="Last six months" className="xl:col-span-2">
          <BookingsRevenueChart data={data.monthly} barKey="bookings" barLabel="Bookings" lineKey="revenue" lineLabel="Revenue" />
        </Panel>
        <Panel title="Equipment by category" text="All listings">
          <SharePieChart data={data.equipmentByCategory} />
        </Panel>
        <Panel title="Bookings by status" className="xl:col-span-2">
          <CountBarChart data={data.bookingsByStatus} label="Bookings" />
        </Panel>
        <Panel title="Users by role">
          <SharePieChart data={data.usersByRole} />
        </Panel>
      </div>
    </>
  );
}

function OwnerOverview({ data }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Listed equipment" value={data.totalEquipment} Icon={FiBox} />
        <StatCard label="Active rentals" value={data.activeRentals} Icon={FiClock} tone="info" />
        <StatCard label="Completed rentals" value={data.completedRentals} Icon={FiCheckCircle} tone="success" />
        <StatCard label="Total earnings" value={formatMoney(data.totalEarnings)} Icon={FiDollarSign} tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Monthly earnings" text="Paid bookings in the last six months" className="xl:col-span-2">
          <MoneyAreaChart data={data.monthly} dataKey="earnings" label="Earnings" />
        </Panel>
        <Panel title="Listings by status" text={`${data.approvedEquipment} approved`}>
          <SharePieChart data={data.equipmentByStatus} />
        </Panel>
        <Panel title="Monthly rentals" text="Bookings received each month" className="xl:col-span-3">
          <CountBarChart data={data.monthly} dataKey="rentals" nameKey="month" label="Rentals" color="primary" />
        </Panel>
      </div>
    </>
  );
}

function CustomerOverview({ data }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total rentals" value={data.totalRentals} Icon={FiClipboard} />
        <StatCard label="Active rentals" value={data.activeRentals} Icon={FiTrendingUp} tone="info" />
        <StatCard label="Favorites" value={data.favoriteCount} Icon={FiHeart} tone="accent" />
        <StatCard label="Total spent" value={formatMoney(data.totalSpent)} Icon={FiDollarSign} tone="success" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Monthly spending" text="Payments in the last six months" className="xl:col-span-2">
          <MoneyAreaChart data={data.monthly} dataKey="spent" label="Spent" />
        </Panel>
        <Panel title="Rentals by status">
          <SharePieChart data={data.bookingsByStatus} />
        </Panel>
      </div>
    </>
  );
}

const VIEWS = {
  admin: { Component: AdminOverview, text: "Platform performance across users, equipment, bookings and payments." },
  owner: { Component: OwnerOverview, text: "How your listings and rentals are performing." },
  customer: { Component: CustomerOverview, text: "A summary of your rentals, favorites and spending." },
};

export default function Overview({ role, name }) {
  const view = VIEWS[role] || VIEWS.customer;
  const { data, loading, error, reload } = useApi(`/analytics/${VIEWS[role] ? role : "customer"}`);
  const firstName = name?.split(" ")[0] || "there";

  return (
    <>
      <PageHeader title={`Welcome back, ${firstName}`} text={view.text}>
        {role === "customer" && (
          <Link href="/equipment" className="btn btn-primary btn-sm">
            Browse equipment
          </Link>
        )}
        {role === "owner" && (
          <Link href="/dashboard/add-equipment" className="btn btn-primary btn-sm">
            Add equipment
          </Link>
        )}
        {role === "admin" && (
          <Link href="/dashboard/all-equipment" className="btn btn-primary btn-sm">
            Review listings
          </Link>
        )}
      </PageHeader>

      {loading ? (
        <Spinner label="Loading analytics" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <view.Component data={data} />
      )}
    </>
  );
}
