export interface QuotaMetrics {
  storageBytesUsed: number;
  classAOpsCount: number;
  classBOpsCount: number;
  monthCycle: string; // e.g. "2026-10"
  lastUpdated: string;
}

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: "STORAGE_LIMIT_EXCEEDED" | "CLASS_A_LIMIT_EXCEEDED" | "CLASS_B_LIMIT_EXCEEDED";
  message?: string;
  metrics: QuotaMetrics;
}

// Strict Free-Tier Safety Limits
export const QUOTA_LIMITS = {
  MAX_STORAGE_BYTES: 6 * 1024 * 1024 * 1024, // 6 GB (Safety ceiling below 10 GB free)
  MAX_CLASS_A_OPS: 1000,                      // 1,000 operations limit (Safety ceiling below 1M free)
  MAX_CLASS_B_OPS: 10000,                     // 10,000 operations limit (Safety ceiling below 10M free)
};

function getCurrentMonthCycle(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

// In-memory / durable quota state
let currentMetrics: QuotaMetrics = {
  storageBytesUsed: 0,
  classAOpsCount: 0,
  classBOpsCount: 0,
  monthCycle: getCurrentMonthCycle(),
  lastUpdated: new Date().toISOString(),
};

function ensureCurrentMonth() {
  const currentMonth = getCurrentMonthCycle();
  if (currentMetrics.monthCycle !== currentMonth) {
    // Reset counters at the start of a new monthly billing cycle
    currentMetrics = {
      storageBytesUsed: 0,
      classAOpsCount: 0,
      classBOpsCount: 0,
      monthCycle: currentMonth,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export function getQuotaMetrics(): QuotaMetrics {
  ensureCurrentMonth();
  return { ...currentMetrics };
}

export function checkQuotaStatus(): QuotaCheckResult {
  ensureCurrentMonth();

  if (currentMetrics.storageBytesUsed >= QUOTA_LIMITS.MAX_STORAGE_BYTES) {
    return {
      allowed: false,
      reason: "STORAGE_LIMIT_EXCEEDED",
      message: "Server is in maintenance for scheduled optimization. File uploads are temporarily paused.",
      metrics: { ...currentMetrics },
    };
  }

  if (currentMetrics.classAOpsCount >= QUOTA_LIMITS.MAX_CLASS_A_OPS) {
    return {
      allowed: false,
      reason: "CLASS_A_LIMIT_EXCEEDED",
      message: "Server is in maintenance for scheduled optimization. File processing is temporarily paused.",
      metrics: { ...currentMetrics },
    };
  }

  if (currentMetrics.classBOpsCount >= QUOTA_LIMITS.MAX_CLASS_B_OPS) {
    return {
      allowed: false,
      reason: "CLASS_B_LIMIT_EXCEEDED",
      message: "Server is in maintenance for scheduled optimization. Downloads are temporarily paused.",
      metrics: { ...currentMetrics },
    };
  }

  return {
    allowed: true,
    metrics: { ...currentMetrics },
  };
}

export function recordClassAOperation(count = 1) {
  ensureCurrentMonth();
  currentMetrics.classAOpsCount += count;
  currentMetrics.lastUpdated = new Date().toISOString();
}

export function recordClassBOperation(count = 1) {
  ensureCurrentMonth();
  currentMetrics.classBOpsCount += count;
  currentMetrics.lastUpdated = new Date().toISOString();
}

export function recordStorageDelta(bytesDelta: number) {
  ensureCurrentMonth();
  currentMetrics.storageBytesUsed = Math.max(0, currentMetrics.storageBytesUsed + bytesDelta);
  currentMetrics.lastUpdated = new Date().toISOString();
}

