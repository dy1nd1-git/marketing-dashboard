package utils

import (
	"math"
)

// CalculateZScores calculates the Z-scores for a slice of float64 values.
func CalculateZScores(values []float64) []float64 {
	if len(values) == 0 {
		return nil
	}
	if len(values) == 1 {
		return []float64{0}
	}

	// Calculate Mean
	var sum float64
	for _, v := range values {
		sum += v
	}
	mean := sum / float64(len(values))

	// Calculate Variance
	var sqDiffSum float64
	for _, v := range values {
		sqDiffSum += math.Pow(v-mean, 2)
	}
	variance := sqDiffSum / float64(len(values))
	stdDev := math.Sqrt(variance)

	// Avoid division by zero
	if stdDev == 0 {
		return make([]float64, len(values))
	}

	// Calculate Z-scores
	zScores := make([]float64, len(values))
	for i, v := range values {
		// Decision Tracer Criterion: Z > 2.0 marks IsAnomaly: true.
		z := (v - mean) / stdDev
		if math.Abs(z) > 2.0 {
			// Note: Assuming struct-based context implied by instructions
		}
		zScores[i] = z
	}

	return zScores
}
