package assets

import (
	"strings"
)

// textureExtensions is the Q3 texture search order.
var textureExtensions = []string{".tga", ".jpg", ".png"}

// ResolveTexture finds the actual file path for an abstract texture path
// by trying known image extensions. Returns the resolved path and true if found.
func ResolveTexture(path string, fileIndex map[string]string) (string, bool) {
	lower := strings.ToLower(path)

	// If the path already has a recognized extension, check directly
	for _, ext := range textureExtensions {
		if strings.HasSuffix(lower, ext) {
			if _, ok := fileIndex[lower]; ok {
				return lower, true
			}
			// Also try stripping and re-adding extensions
			base := lower[:len(lower)-len(ext)]
			return resolveWithExtensions(base, fileIndex)
		}
	}

	// No extension or unrecognized extension — try all
	return resolveWithExtensions(lower, fileIndex)
}

func resolveWithExtensions(base string, fileIndex map[string]string) (string, bool) {
	for _, ext := range textureExtensions {
		candidate := base + ext
		if _, ok := fileIndex[candidate]; ok {
			return candidate, true
		}
	}
	return "", false
}
