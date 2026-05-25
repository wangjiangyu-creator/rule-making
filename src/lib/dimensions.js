import { dimensions } from '../data/dimensions.js';

function asList(value) {
  return Array.isArray(value) ? value : [];
}

export const dimensionById = new Map(dimensions.map((dimension) => [dimension.id, dimension]));

export function summarizeDimensions(records) {
  const counts = new Map(dimensions.map((dimension) => [dimension.id, 0]));

  for (const record of records) {
    for (const dimensionId of asList(record.dimensions)) {
      if (counts.has(dimensionId)) {
        counts.set(dimensionId, counts.get(dimensionId) + 1);
      }
    }
  }

  return dimensions
    .map((dimension) => ({
      ...dimension,
      count: counts.get(dimension.id) ?? 0,
    }))
    .filter((dimension) => dimension.count > 0)
    .sort((left, right) => right.count - left.count || left.title.localeCompare(right.title));
}
