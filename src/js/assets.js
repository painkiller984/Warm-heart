const rawAssets = import.meta.glob("/src/img/**/*", {
    eager: true,
    query: "?url",
    import: "default",
});

const assetMap = Object.fromEntries(
    Object.entries(rawAssets).map(([path, url]) => [
        path.replace("/src/img/", ""),
        url,
    ])
);

const resolveAsset = (key) => assetMap[key] || "";
const resolveAssetList = (list) =>
    (list || []).map(resolveAsset).filter(Boolean);

export { resolveAsset, resolveAssetList };
