import type { Json } from "@/types/database";

interface ComparisonVisibilityInput {
    target_institution_id: string | null;
    comparison_targets: Json | null | undefined;
}

function isObjectRecord(value: Json): value is Record<string, Json> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getComparisonInstitutionCount({
    target_institution_id,
    comparison_targets,
}: ComparisonVisibilityInput): number {
    const institutionIds = new Set<string>();

    if (target_institution_id) {
        institutionIds.add(target_institution_id);
    }

    if (Array.isArray(comparison_targets)) {
        for (const target of comparison_targets) {
            if (!isObjectRecord(target)) continue;
            const institutionId = target.institution_id;
            if (typeof institutionId !== "string" || institutionId.length === 0) continue;
            institutionIds.add(institutionId);
        }
    }

    return institutionIds.size;
}

export function shouldShowComparisonSection(input: ComparisonVisibilityInput): boolean {
    return getComparisonInstitutionCount(input) > 1;
}
