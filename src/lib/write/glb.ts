import { Handle_TDocStd_Document, OpenCascadeInstance } from "opencascade.js/dist/opencascade.full.js"


export function writeGlbData(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, path: string = "./output.glb") {
    return writeGlbInternal(oc, docHandle, path)
}

function writeGlbInternal(oc: OpenCascadeInstance, docHandle: Handle_TDocStd_Document, path: string) {
    console.log("> Writing GLB")

    console.debug("  > Creating map")
    const map = new oc.TColStd_IndexedDataMapOfStringString_1()

    console.debug("  > Creating progress")
    const progress = new oc.Message_ProgressRange_1()

    console.debug("  > Creating file")
    const file = new oc.TCollection_AsciiString_2(path)

    console.debug("  > Creating writer")
    const writer = new oc.RWGltf_CafWriter(file, true)
    
    console.debug("  > Writing file")
    writer.Perform_2(docHandle, map, progress)

    console.debug("  > Reading file")
    const data = oc.FS.analyzePath(path).exists && oc.FS.readFile(path)

    console.debug("  > Deleting file")
    data && oc.FS.unlink(path)

    return data
}