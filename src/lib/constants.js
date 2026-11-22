export const SITE_NAME = "RentRig";

export const CATEGORIES = [
  {
    name: "Construction Equipment",
    short: "Construction",
    blurb: "Excavators, mixers, scaffolding and site tools",
  },
  {
    name: "Photography Equipment",
    short: "Photography",
    blurb: "Cameras, lenses, lighting and stabilisers",
  },
  {
    name: "Vehicles & Transportation",
    short: "Vehicles",
    blurb: "Vans, pickups, trailers and moving gear",
  },
  {
    name: "Agriculture Equipment",
    short: "Agriculture",
    blurb: "Tractors, tillers, pumps and harvest tools",
  },
  {
    name: "Electronics",
    short: "Electronics",
    blurb: "Projectors, power stations and screens",
  },
  {
    name: "Event Equipment",
    short: "Events",
    blurb: "Sound systems, tents, staging and lights",
  },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"];

export const RENTAL_UNIT = { Daily: "day", Weekly: "week", Monthly: "month" };

export const CONDITIONS = ["Brand new", "Excellent", "Good", "Fair"];

export const SORT_OPTIONS = [
  { value: "recent", label: "Recently added" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export const ROLE_LABELS = { customer: "Customer", owner: "Owner", admin: "Admin" };
