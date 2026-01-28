/**
 * Serializes BigInt values to strings for JSON compatibility.
 * Use this when returning Prisma data that contains BigInt fields.
 */
export function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  ) as T;
}
