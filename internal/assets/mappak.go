package assets

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"strings"
)

// BuildMapPak builds a per-map pk3 containing all map-specific assets not in the baseline.
func BuildMapPak(mapName, game string, manifest *Manifest, quake3Dir, outputPath string) error {
	gm, ok := manifest.Games[game]
	if !ok {
		return fmt.Errorf("game %q not found in manifest", game)
	}

	needed := make(map[string]bool)

	// 1. BSP file
	bspPath := "maps/" + mapName + ".bsp"
	lowerBSP := strings.ToLower(bspPath)
	if _, ok := gm.FileIndex[lowerBSP]; !ok {
		return fmt.Errorf("BSP not found: %s", bspPath)
	}
	needed[lowerBSP] = true

	// 2. Parse BSP
	bspData, err := readFileFromIndex(lowerBSP, gm.FileIndex)
	if err != nil {
		return fmt.Errorf("read BSP: %w", err)
	}
	bspAssets, err := ParseBSP(bytes.NewReader(bspData), int64(len(bspData)))
	if err != nil {
		return fmt.Errorf("parse BSP: %w", err)
	}

	log.Printf("  %s: BSP has %d shaders, %d models, %d sounds, %d music",
		mapName, len(bspAssets.Shaders), len(bspAssets.Models), len(bspAssets.Sounds), len(bspAssets.Music))

	// 3. Resolve BSP surface shaders
	for _, shaderName := range bspAssets.Shaders {
		resolveShaderTextures(shaderName, gm, needed)
	}

	// 4. Resolve entity models (model2)
	for _, modelPath := range bspAssets.Models {
		resolveModel(modelPath, gm, needed)
	}

	// 5. Resolve entity sounds
	for _, soundPath := range bspAssets.Sounds {
		lower := strings.ToLower(soundPath)
		if _, ok := gm.FileIndex[lower]; ok {
			needed[lower] = true
		}
	}

	// 6. Resolve music
	for _, musicPath := range bspAssets.Music {
		lower := strings.ToLower(musicPath)
		if _, ok := gm.FileIndex[lower]; ok {
			needed[lower] = true
		}
	}

	// 9. Include levelshot
	for _, ext := range []string{".jpg", ".tga"} {
		ls := "levelshots/" + mapName + ext
		if _, ok := gm.FileIndex[ls]; ok {
			needed[ls] = true
			break
		}
	}

	// 10. Include arena file
	arenaPath := "scripts/" + mapName + ".arena"
	if _, ok := gm.FileIndex[arenaPath]; ok {
		needed[arenaPath] = true
	}

	// 11. Exclude baseline files
	for path := range needed {
		if gm.BaselineFiles[path] {
			delete(needed, path)
		}
	}

	if len(needed) == 0 {
		log.Printf("  %s: no non-baseline files needed", mapName)
		return nil
	}

	// Extract and write
	paths := make([]string, 0, len(needed))
	for p := range needed {
		paths = append(paths, p)
	}

	files, err := ExtractFilesFromPk3s(paths, gm.FileIndex)
	if err != nil {
		return fmt.Errorf("extract files: %w", err)
	}

	if err := WritePk3(outputPath, files); err != nil {
		return fmt.Errorf("write map pk3: %w", err)
	}

	log.Printf("  %s: %d files", mapName, len(files))
	return nil
}

// resolveShaderTextures resolves a shader name to its texture dependencies and adds them to needed.
func resolveShaderTextures(shaderName string, gm *GameManifest, needed map[string]bool) {
	lower := strings.ToLower(shaderName)

	// Look up shader definition
	if textures, ok := gm.Shaders[lower]; ok {
		for _, tex := range textures {
			if resolved, ok := ResolveTexture(tex, gm.FileIndex); ok {
				needed[resolved] = true
			}
		}
		// If shader def has no texture refs (e.g. only surfaceparms),
		// the engine uses the shader name as an implicit texture
		if len(textures) == 0 {
			if resolved, ok := ResolveTexture(lower, gm.FileIndex); ok {
				needed[resolved] = true
			}
		}
		// Include the .shader script file so the engine can find the definition
		if scriptPath, ok := gm.ShaderFiles[lower]; ok {
			needed[scriptPath] = true
		}
	} else {
		// No shader def — treat as direct texture path
		if resolved, ok := ResolveTexture(lower, gm.FileIndex); ok {
			needed[resolved] = true
		}
	}
}

// resolveModel resolves an MD3 model and all its shader/texture dependencies.
func resolveModel(modelPath string, gm *GameManifest, needed map[string]bool) {
	lower := strings.ToLower(modelPath)
	if _, ok := gm.FileIndex[lower]; !ok {
		return
	}
	needed[lower] = true

	// Parse MD3 to get shader refs
	data, err := readFileFromIndex(lower, gm.FileIndex)
	if err != nil {
		return
	}
	shaderRefs, err := ParseMD3Shaders(bytes.NewReader(data), int64(len(data)))
	if err != nil {
		return
	}

	for _, ref := range shaderRefs {
		resolveShaderTextures(ref, gm, needed)
	}
}

// MapPakFileSet returns the set of files in a map pk3 by reading it.
func MapPakFileSet(mapPk3Path string) (map[string]bool, error) {
	fileSet := make(map[string]bool)
	err := IteratePk3(mapPk3Path, func(name string, open func() (io.ReadCloser, error)) error {
		fileSet[strings.ToLower(name)] = true
		return nil
	})
	return fileSet, err
}
