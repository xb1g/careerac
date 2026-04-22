import { describe, expect, it } from "vitest";
import { getComparisonInstitutionCount, shouldShowComparisonSection } from "@/utils/comparison-visibility";

describe("comparison visibility", () => {
    it("hides comparison when only target institution exists", () => {
        const count = getComparisonInstitutionCount({
            target_institution_id: "ucla-id",
            comparison_targets: [],
        });

        expect(count).toBe(1);
        expect(
            shouldShowComparisonSection({
                target_institution_id: "ucla-id",
                comparison_targets: [],
            }),
        ).toBe(false);
    });

    it("shows comparison when a second institution is present", () => {
        expect(
            shouldShowComparisonSection({
                target_institution_id: "ucla-id",
                comparison_targets: [{ institution_id: "ucb-id" }],
            }),
        ).toBe(true);
    });

    it("deduplicates repeated institutions", () => {
        const count = getComparisonInstitutionCount({
            target_institution_id: "ucla-id",
            comparison_targets: [
                { institution_id: "ucla-id" },
                { institution_id: "ucla-id" },
            ],
        });

        expect(count).toBe(1);
    });

    it("ignores malformed comparison target records", () => {
        const count = getComparisonInstitutionCount({
            target_institution_id: null,
            comparison_targets: [
                null,
                123,
                "school",
                { id: "missing-key" },
                { institution_id: "valid-id" },
            ],
        });

        expect(count).toBe(1);
    });
});
