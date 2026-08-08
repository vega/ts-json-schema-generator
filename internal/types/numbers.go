package types

import (
	"math"
	"strconv"
	"strings"
)

// NumberToString formats a float64 the way JavaScript's Number#toString does
// for the common cases: integers print without a decimal point, other values
// use the shortest round-trip representation.
func NumberToString(f float64) string {
	if math.IsInf(f, 1) {
		return "Infinity"
	}
	if math.IsInf(f, -1) {
		return "-Infinity"
	}
	if math.IsNaN(f) {
		return "NaN"
	}
	if f == math.Trunc(f) && math.Abs(f) < 1e21 {
		return strconv.FormatFloat(f, 'f', -1, 64)
	}
	s := strconv.FormatFloat(f, 'g', -1, 64)
	// JS uses e+21 style only for very large/small exponents; Go's 'g' switches
	// earlier. Expand small exponents to plain notation like JS.
	if i := strings.IndexAny(s, "eE"); i >= 0 {
		exp, err := strconv.Atoi(s[i+1:])
		if err == nil && exp > -7 && exp < 21 {
			return strconv.FormatFloat(f, 'f', -1, 64)
		}
		// Normalize Go's e-05 to JS's e-5.
		mant, rest := s[:i], s[i+1:]
		sign := ""
		if strings.HasPrefix(rest, "+") || strings.HasPrefix(rest, "-") {
			sign = string(rest[0])
			rest = rest[1:]
		}
		rest = strings.TrimLeft(rest, "0")
		if rest == "" {
			rest = "0"
		}
		if sign == "-" {
			return mant + "e-" + rest
		}
		return mant + "e+" + rest
	}
	return s
}
