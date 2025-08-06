export function writeGlbData(oc, docHandle, path) {
    if (path === void 0) { path = "./output.glb"; }
    return writeGlbInternal(oc, docHandle, path);
}
function writeGlbInternal(oc, docHandle, path) {
    console.log("> Writing GLB");
    console.debug("  > Creating map");
    var map = new oc.TColStd_IndexedDataMapOfStringString_1();
    console.debug("  > Creating progress");
    var progress = new oc.Message_ProgressRange_1();
    console.debug("  > Creating file");
    var file = new oc.TCollection_AsciiString_2(path);
    console.debug("  > Creating writer");
    var writer = new oc.RWGltf_CafWriter(file, true);
    console.debug("  > Writing file");
    writer.Perform_2(docHandle, map, progress);
    console.debug("  > Reading file");
    var data = oc.FS.analyzePath(path).exists && oc.FS.readFile(path);
    console.debug("  > Deleting file");
    data && oc.FS.unlink(path);
    return data;
}
