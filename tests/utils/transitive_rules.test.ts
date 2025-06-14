import { describe, test } from "vitest";
import { wrap_in_codeblock } from "../../src/utils/strings";
import { parse_transitive_relation } from "../../src/utils/transitive_rules";

describe("parse_transitive_relation", () => {
	test("simple", (t) => {
		const expected = {
			ok: true,
			data: {
				chain: [
					{
						field: "foo",
					},
				],
				close_field: "bar",
				close_reversed: false,
			},
		};

		t.expect(parse_transitive_relation("[foo] -> bar")).toStrictEqual(
			expected,
		);
		t.expect(parse_transitive_relation("[foo]     -> bar")).toStrictEqual(
			expected,
		);
		t.expect(parse_transitive_relation("[foo]->bar")).toStrictEqual(
			expected,
		);
		// t.expect(parse_transitive_relation("  \t  [foo]   ->   bar   ")).toStrictEqual(expected);
	});

	test("chained", (t) => {
		const expected = {
			ok: true,
			data: {
				chain: [
					{
						field: "foo",
					},
					{
						field: "bar",
					},
					{
						field: "baz",
					},
				],
				close_field: "qux",
				close_reversed: false,
			},
		};

		t.expect(
			parse_transitive_relation("[foo, bar, baz] -> qux"),
		).toStrictEqual(expected);

		t.expect(
			parse_transitive_relation("[  foo  ,  bar,baz] -> qux"),
		).toStrictEqual(expected);
	});

	test("close reversed", (t) => {
		const expected = {
			ok: true,
			data: {
				chain: [
					{
						field: "foo",
					},
					{
						field: "bar",
					},
					{
						field: "baz",
					},
				],
				close_field: "qux",
				close_reversed: true,
			},
		};

		t.expect(
			parse_transitive_relation("[foo, bar, baz] <- qux"),
		).toStrictEqual(expected);

		t.expect(
			parse_transitive_relation("[  foo  ,  bar,baz] <- qux"),
		).toStrictEqual(expected);
	});

	test("non-ascii & special name", (t) => {
		t.expect(
			parse_transitive_relation("[一去两三里] -> 烟村四五家"),
		).toStrictEqual({
			ok: true,
			data: {
				chain: [
					{
						field: "一去两三里",
					},
				],
				close_field: "烟村四五家",
				close_reversed: false,
			},
		});
		// t.expect(parse_transitive_relation("  \t  [foo]   ->   bar   ")).toStrictEqual(expected);
	});
});
